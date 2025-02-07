import { namedTypes as n } from 'vue-metamorph';
import type {
  VuexActionNode,
  VuexGetterNode,
  VuexMutationNode,
  VuexStateNode,
} from '../ast';
import { analyzeDependencies } from './dependencies';
import {
  getStringKey,
  isStringKey,
  toArrowFunctionExpression,
} from './utils';

export function analyzeVuexActions(methods: n.ObjectExpression, mapActionsLocalName: string): VuexActionNode[] {
  const nodes: VuexActionNode[] = [];

  for (const method of methods.properties) {
    if (method.type === 'SpreadElement'
      && method.argument.type === 'CallExpression'
      && method.argument.callee.type === 'Identifier'
      && method.argument.callee.name === mapActionsLocalName
      && (method.argument.arguments[0]?.type === 'MemberExpression'
        || method.argument.arguments[0]?.type === 'Identifier'
        || method.argument.arguments[0]?.type === 'Literal'
        || method.argument.arguments[0]?.type === 'CallExpression')
      && (method.argument.arguments[1]?.type === 'ArrayExpression'
        || method.argument.arguments[1]?.type === 'ObjectExpression')) {
      const namespace = method.argument.arguments[0];
      const definition = method.argument.arguments[1];

      if (definition.type === 'ArrayExpression') {
        for (const element of definition.elements) {
          if (element?.type === 'Literal' && typeof element.value === 'string') {
            nodes.push({
              actionName: element.value,
              dependencies: [],
              name: element.value,
              namespace,
              node: null,
              type: 'vuexAction',
              comments: element.comments,
            });
          }
        }
      } else {
        for (const prop of definition.properties) {
          if (prop.type === 'Property'
            && isStringKey(prop.key)
            && prop.value.type === 'Literal'
            && typeof prop.value.value === 'string') {
            nodes.push({
              actionName: prop.value.value,
              dependencies: [],
              name: getStringKey(prop.key),
              namespace,
              node: null,
              type: 'vuexAction',
              comments: prop.comments,
            });
          }
        }
      }
    }
  }

  return nodes;
}

export function analyzeVuexGetters(computed: n.ObjectExpression, mapGettersLocalName: string): VuexGetterNode[] {
  const nodes: VuexGetterNode[] = [];

  for (const getter of computed.properties) {
    if (getter.type === 'SpreadElement'
      && getter.argument.type === 'CallExpression'
      && getter.argument.callee.type === 'Identifier'
      && getter.argument.callee.name === mapGettersLocalName
      && (getter.argument.arguments[0]?.type === 'MemberExpression'
        || getter.argument.arguments[0]?.type === 'Identifier'
        || getter.argument.arguments[0]?.type === 'Literal'
        || getter.argument.arguments[0]?.type === 'CallExpression')
      && (getter.argument.arguments[1]?.type === 'ArrayExpression'
        || getter.argument.arguments[1]?.type === 'ObjectExpression')) {
      const namespace = getter.argument.arguments[0];
      const definition = getter.argument.arguments[1];

      if (definition.type === 'ArrayExpression') {
        for (const element of definition.elements) {
          if (element?.type === 'Literal' && typeof element.value === 'string') {
            nodes.push({
              getterName: element.value,
              dependencies: [],
              name: element.value,
              namespace,
              node: null,
              type: 'vuexGetter',
              comments: element.comments,
            });
          }
        }
      } else {
        for (const prop of definition.properties) {
          if (prop.type === 'Property'
            && isStringKey(prop.key)
            && prop.value.type === 'Literal'
            && typeof prop.value.value === 'string') {
            nodes.push({
              getterName: prop.value.value,
              dependencies: [],
              name: getStringKey(prop.key),
              namespace,
              node: null,
              type: 'vuexGetter',
              comments: prop.comments,
            });
          }
        }
      }
    }
  }

  return nodes;
}

export function analyzeVuexMutations(methods: n.ObjectExpression, mapMutationsLocalName: string): VuexMutationNode[] {
  const nodes: VuexMutationNode[] = [];

  for (const method of methods.properties) {
    if (method.type === 'SpreadElement'
      && method.argument.type === 'CallExpression'
      && method.argument.callee.type === 'Identifier'
      && method.argument.callee.name === mapMutationsLocalName
      && (method.argument.arguments[0]?.type === 'MemberExpression'
        || method.argument.arguments[0]?.type === 'Identifier'
        || method.argument.arguments[0]?.type === 'Literal'
        || method.argument.arguments[0]?.type === 'CallExpression')
      && (method.argument.arguments[1]?.type === 'ArrayExpression'
        || method.argument.arguments[1]?.type === 'ObjectExpression')) {
      const namespace = method.argument.arguments[0];
      const definition = method.argument.arguments[1];

      if (definition.type === 'ArrayExpression') {
        for (const element of definition.elements) {
          if (element?.type === 'Literal' && typeof element.value === 'string') {
            nodes.push({
              mutationName: element.value,
              dependencies: [],
              name: element.value,
              namespace,
              node: null,
              type: 'vuexMutation',
              comments: element.comments,
            });
          }
        }
      } else {
        for (const prop of definition.properties) {
          if (prop.type === 'Property'
            && isStringKey(prop.key)
            && prop.value.type === 'Literal'
            && typeof prop.value.value === 'string') {
            nodes.push({
              mutationName: prop.value.value,
              dependencies: [],
              name: getStringKey(prop.key),
              namespace,
              node: null,
              type: 'vuexMutation',
              comments: prop.comments,
            });
          }
        }
      }
    }
  }

  return nodes;
}

export function analyzeVuexState(computed: n.ObjectExpression, mapStateLocalName: string) {
  const nodes: VuexStateNode[] = [];

  for (const prop of computed.properties) {
    if (prop.type !== 'SpreadElement'
      || prop.argument.type !== 'CallExpression'
      || prop.argument.callee.type !== 'Identifier'
      || prop.argument.callee.name !== mapStateLocalName
      || !prop.argument.arguments[0]
      || !prop.argument.arguments[1]
      || prop.argument.arguments[0].type === 'SpreadElement'
      || prop.argument.arguments[1].type === 'SpreadElement'
    ) {
      continue;
    }

    const namespace = prop.argument.arguments[0];
    const mapping = prop.argument.arguments[1];

    if (mapping.type === 'ArrayExpression') {
      for (const el of mapping.elements) {
        if (
          !el
          || el.type !== 'Literal'
          || typeof el.value !== 'string'
        ) {
          continue;
        }

        nodes.push({
          comments: el.comments,
          dependencies: [],
          name: el.value,
          namespace,
          node: el,
          type: 'vuexState',
        });
      }
    } else if (mapping.type === 'ObjectExpression') {
      for (const mappingProp of mapping.properties) {
        if (
          mappingProp.type !== 'Property'
          || !isStringKey(mappingProp.key)
        ) {
          continue;
        }

        const localName = getStringKey(mappingProp.key);

        nodes.push({
          comments: mappingProp.comments,
          dependencies: [],
          name: localName,
          namespace,
          node: mappingProp.value.type === 'FunctionExpression'
            ? toArrowFunctionExpression(mappingProp.value)
            : mappingProp.value as never,
          type: 'vuexState',
        });
      }
    }
  }

  nodes.forEach((node) => {
    node.dependencies = analyzeDependencies(node);
  });

  return nodes;
}
