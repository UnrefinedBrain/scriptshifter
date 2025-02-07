import { namedTypes as n, Kinds } from 'vue-metamorph';
import * as AST from '../ast';
import { Graph } from './graph';
import { renderMethodNode } from './method';
import { renderOptionsNode } from './$options';
import { renderRefsNode } from './$refs';
import { renderComputedNode } from './computed';
import { renderDataNode } from './data';
import { renderDirectiveNode } from './directive';
import { renderEmitsNode } from './emits';
import { renderLifecycleHook } from './lifecycle';
import { renderPropsNodes } from './props';
import { renderUnknownNode } from './unknown';
import { renderVuexActionNode } from './vuex-action';
import { renderVuexGetterNode } from './vuex-getter';
import { renderVuexMutationNode } from './vuex-mutation';
import { renderVuexStateNode } from './vuex-state';
import { renderWatcherNode } from './watcher';
import { renderPiniaMapStoresNode } from './pinia-store';
import { renderPiniaStateNode } from './pinia-state';
import { VueVersion } from '../options';

export function render(
  ast: AST.ScriptSetupAst,
  vueVersion: VueVersion,
  isTypescript: boolean,
) {
  const statements: Kinds.StatementKind[] = [];

  // 1. any statements before the options block
  statements.push(...ast.beforeOptionsStatements);

  // 2. $options
  if (ast.$options) {
    statements.push(renderOptionsNode(ast.$options));
  }

  // 3. unknowns
  statements.push(...ast.unknowns.map((node) => renderUnknownNode(node)));

  // 4. props
  if (ast.props) {
    statements.push(renderPropsNodes(ast.props, ast.areThereDependenciesOn.props));
  }

  // 5. after props statements (existing setup() block)
  statements.push(...ast.afterPropsStatements);

  // 6. emits
  if (ast.emits) {
    statements.push(renderEmitsNode(ast.emits));
  }

  // 7. directives
  if (ast.directives) {
    statements.push(
      ...ast.directives
        .map(renderDirectiveNode)
        .filter((x): x is n.VariableDeclaration => !!x),
    );
  }

  // 8. sorted statements
  const graph = new Graph<AST.ScriptSetupNode>();
  const allNodes = [
    ...ast.computed,
    ...ast.data,
    ...ast.lifecycleHooks,
    ...ast.methods,
    ...ast.props ?? [],
    ...ast.watchers,
    ...ast.vuexActions,
    ...ast.vuexGetters,
    ...ast.vuexMutations,
    ...ast.vuexState,
    ...ast.$refs,
    ...Object.values(ast.piniaActions),
    ...Object.values(ast.piniaStates),
    ...Object.values(ast.piniaStores),
  ];

  allNodes.forEach((node) => graph.addNode(node.name, node));
  allNodes.forEach((node) => {
    node.dependencies.forEach((dep) => {
      graph.addEdge(dep, node.name);
    });
  });

  for (const node of graph.cycleTolerantTopSort()) {
    switch (node.type) {
      case 'computed': statements.push(renderComputedNode(node)); break;
      case 'data': statements.push(renderDataNode(node)); break;
      case 'method': statements.push(renderMethodNode(node)); break;
      case 'watcher': statements.push(renderWatcherNode(node)); break;
      case 'lifecycle': statements.push(renderLifecycleHook(node)); break;
      case 'vuexAction': statements.push(renderVuexActionNode(node, isTypescript)); break;
      case 'vuexGetter': statements.push(renderVuexGetterNode(node)); break;
      case 'vuexMutation': statements.push(renderVuexMutationNode(node, isTypescript)); break;
      case 'vuexState': statements.push(renderVuexStateNode(node)); break;
      case 'refs': statements.push(renderRefsNode(node, vueVersion, isTypescript)); break;
      case 'piniaStore': statements.push(renderPiniaMapStoresNode(node)); break;
      case 'piniaState': {
        const rendered = renderPiniaStateNode(node);
        if (rendered) {
          statements.push(rendered);
        }
        break;
      }
      default: break;
    }
  }

  // 9. any statements after the options block
  statements.push(...ast.afterOptionsStatements);

  // 10. created hook
  if (ast.createdHook) {
    statements.push(ast.createdHook.node);
  }

  return statements;
}
