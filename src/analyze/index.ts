import {
  AST,
  astHelpers,
  namedTypes as n,
} from 'vue-metamorph';
import type { ScriptSetupAst } from '../ast';
import { analyzeComputed } from './computed';
import { analyzeCreatedHook } from './created';
import { analyzeData } from './data';
import { analyzeDirectives } from './directives';
import { analyzeEmits } from './emits';
import { analyzeLifecycleHooks } from './lifecycle';
import { analyzeMethods } from './methods';
import {
  analyzeIfPropsReferenced,
  analyzeProps,
} from './props';
import {
  analyzeVuexActions,
  analyzeVuexGetters,
  analyzeVuexMutations,
  analyzeVuexState,
} from './vuex';
import { analyzeWatcherSourceTypes } from './watcher-sources';
import { analyzeWatchers } from './watchers';
import { analyzeSetup, analyzeSetupPropsReferenced } from './setup';
import { toArrowFunctionExpression } from './utils';
import { analyzeProvide } from './provide';
import { analyzeInject } from './inject';
import { analyzeOptions } from './options';
import { analyzeRefs } from './refs';
import { analyzePiniaMapStores } from './pinia-mapstores';
import { analyzePiniaActions } from './pinia-actions';
import { analyzePiniaMapState } from './pinia-mapstate';
import { analyzePiniaMapWriteableState } from './pinia-mapwritablestate';

function findSfcOptionsBlock(program: n.Program): [n.ObjectExpression | null, number] {
  let i = 0;
  for (const statement of program.body) {
    if (statement.type === 'ExportDefaultDeclaration') {
      if (statement.declaration.type === 'ObjectExpression') {
        return [statement.declaration, i];
      } if (statement.declaration.type === 'CallExpression'
        && statement.declaration.arguments[0]?.type === 'ObjectExpression') {
        return [statement.declaration.arguments[0], i];
      }
    }

    i++;
  }

  return [null, -1];
}

function findSfcOption<
  T extends n.Property['value']['type'][],
>(
  optionsBlock: n.ObjectExpression,
  name: string,
  types: T,
): (n.Property['value'] & { type: T[number]; }) | null {
  for (const property of optionsBlock.properties) {
    if (property.type === 'Property'
      && property.key.type === 'Identifier'
      && property.key.name === name
      && types.includes(property.value.type)) {
      return property.value;
    }
  }

  return null;
}

function findLocalImportName(program: n.Program, source: string, importedName: string) {
  const importDecls = astHelpers
    .findAll(program, {
      type: 'ImportDeclaration',
      source: {
        type: 'Literal',
        value: source,
      },
    });

  for (const decl of importDecls) {
    if (!decl.specifiers) {
      continue;
    }

    for (const specifier of decl.specifiers) {
      if (specifier.type === 'ImportSpecifier'
        && specifier.imported?.name === importedName) {
        // eslint-disable-next-line no-nested-ternary
        return specifier.local?.type === 'Identifier'
          ? specifier.local.name
          : specifier.imported.type === 'Identifier'
            ? specifier.imported.name
            : null;
      }
    }
  }

  return null;
}

export function analyze(program: n.Program, sfcAST: AST.VDocumentFragment): ScriptSetupAst {
  const [optionsBlock, optionsBlockIndex] = findSfcOptionsBlock(program);

  if (!optionsBlock) {
    throw new Error('Could not find SFC options block');
  }

  const computedBlock = findSfcOption(optionsBlock, 'computed', ['ObjectExpression']);
  const propsBlock = findSfcOption(optionsBlock, 'props', ['ObjectExpression']);
  const dataBlock = findSfcOption(optionsBlock, 'data', ['ArrowFunctionExpression', 'FunctionExpression']);
  const methodsBlock = findSfcOption(optionsBlock, 'methods', ['ObjectExpression']);
  const watchBlock = findSfcOption(optionsBlock, 'watch', ['ObjectExpression']);
  const directivesBlock = findSfcOption(optionsBlock, 'directives', ['ObjectExpression']);
  const setupBlock = findSfcOption(optionsBlock, 'setup', ['ArrowFunctionExpression', 'FunctionExpression']);
  const provideBlock = findSfcOption(optionsBlock, 'provide', ['ArrowFunctionExpression', 'ObjectExpression', 'FunctionExpression']);
  const injectBlock = findSfcOption(optionsBlock, 'inject', ['ArrayExpression', 'ObjectExpression']);

  const localVuexMapActionsName = findLocalImportName(program, 'vuex', 'mapActions');
  const localVuexMapGettersName = findLocalImportName(program, 'vuex', 'mapGetters');
  const localVuexMapMutationsName = findLocalImportName(program, 'vuex', 'mapMutations');
  const localVuexMapStateName = findLocalImportName(program, 'vuex', 'mapState');

  const localPiniaMapActionsName = findLocalImportName(program, 'pinia', 'mapActions');
  const localPiniaMapStateName = findLocalImportName(program, 'pinia', 'mapState');
  const localPiniaMapGettersName = findLocalImportName(program, 'pinia', 'mapGetters');
  const localPiniaMapWritableStateName = findLocalImportName(program, 'pinia', 'mapWritableState');
  const localPiniaMapStoresName = findLocalImportName(program, 'pinia', 'mapStores');

  const ast: ScriptSetupAst = {
    computed: computedBlock
      ? analyzeComputed(computedBlock)
      : [],
    data: dataBlock
      ? analyzeData(dataBlock)
      : [],
    emits: analyzeEmits(optionsBlock, sfcAST),
    lifecycleHooks: analyzeLifecycleHooks(optionsBlock),
    methods: methodsBlock
      ? analyzeMethods(methodsBlock)
      : [],
    props: propsBlock
      ? analyzeProps(propsBlock)
      : null,
    watchers: watchBlock
      ? analyzeWatchers(watchBlock)
      : [],
    unknowns: [],
    vuexActions: methodsBlock && localVuexMapActionsName
      ? analyzeVuexActions(methodsBlock, localVuexMapActionsName)
      : [],
    vuexGetters: computedBlock && localVuexMapGettersName
      ? analyzeVuexGetters(computedBlock, localVuexMapGettersName)
      : [],
    vuexMutations: methodsBlock && localVuexMapMutationsName
      ? analyzeVuexMutations(methodsBlock, localVuexMapMutationsName)
      : [],
    vuexState: computedBlock && localVuexMapStateName
      ? analyzeVuexState(computedBlock, localVuexMapStateName)
      : [],
    afterOptionsStatements: program.body.slice(optionsBlockIndex + 1),
    beforeOptionsStatements: program.body.slice(0, optionsBlockIndex),
    piniaStores: {},
    piniaActions: {},
    piniaStates: {},
    piniaWritableStates: [],
    directives: directivesBlock
      ? analyzeDirectives(directivesBlock)
      : [],
    createdHook: analyzeCreatedHook(optionsBlock),
    afterPropsStatements: [],
    provides: provideBlock
      ? analyzeProvide(provideBlock)
      : [],
    injects: injectBlock
      ? analyzeInject(injectBlock)
      : [],
    $options: analyzeOptions(optionsBlock),
    $refs: analyzeRefs(optionsBlock),
    wasEmitted: {
      cssModule: false,
      router: false,
      route: false,
      store: false,
      vuexStateAccessHelper: false,
      attrs: false,
      slots: false,
    },
    areThereDependenciesOn: {
      props: false,
    },
    setupVarNames: {},
  };

  ast.areThereDependenciesOn.props = analyzeIfPropsReferenced(ast);

  if (setupBlock) {
    const normalizedSetup = toArrowFunctionExpression(setupBlock);
    ast.areThereDependenciesOn.props = ast.areThereDependenciesOn.props || analyzeSetupPropsReferenced(normalizedSetup);
    const { statements, names } = analyzeSetup(normalizedSetup);
    ast.afterPropsStatements.push(
      ...statements,
    );
    ast.setupVarNames = names;
  }

  if (computedBlock && localPiniaMapStoresName) {
    for (const node of analyzePiniaMapStores(computedBlock, localPiniaMapStoresName)) {
      ast.piniaStores[node.storeFunctionName] = node;
    }
  }

  if (methodsBlock && localPiniaMapActionsName) {
    const res = analyzePiniaActions(methodsBlock, localPiniaMapActionsName);
    for (const node of res.stores) {
      ast.piniaStores[node.storeFunctionName] = node;
    }

    for (const action of res.actions) {
      ast.piniaActions[action.name] = action;
    }
  }

  if (computedBlock && localPiniaMapStateName) {
    const res = analyzePiniaMapState(computedBlock, localPiniaMapStateName);
    for (const node of res.stores) {
      ast.piniaStores[node.storeFunctionName] = node;
    }

    for (const state of res.state) {
      ast.piniaStates[state.name] = state;
    }
  }

  if (computedBlock && localPiniaMapWritableStateName) {
    const res = analyzePiniaMapWriteableState(computedBlock, localPiniaMapWritableStateName);
    for (const node of res.stores) {
      ast.piniaStores[node.storeFunctionName] = node;
    }

    ast.piniaWritableStates.push(...res.state);
  }

  if (computedBlock && localPiniaMapGettersName) {
    // mapGetters is a subset of mapState
    const res = analyzePiniaMapState(computedBlock, localPiniaMapGettersName);
    for (const node of res.stores) {
      ast.piniaStores[node.storeFunctionName] = node;
    }

    for (const state of res.state) {
      ast.piniaStates[state.name] = state;
    }
  }

  // now that refs/props have been analyzed, detect watcher source types
  analyzeWatcherSourceTypes(ast);

  return ast;
}
