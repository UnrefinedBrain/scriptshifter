import {
  namedTypes as n,
  traverseScriptAST,
} from 'vue-metamorph';
import type {
  PiniaStateNode,
  PiniaStoreNode,
} from '../ast';
import { buildStoreNode } from './pinia-mapstores';
import { analyzeDependencies } from './dependencies';
import {
  getStringKey,
  isStringKey,
  toArrowFunctionExpression,
} from './utils';

export function analyzePiniaMapState(computed: n.ObjectExpression, localMapStateName: string) {
  const state: PiniaStateNode[] = [];
  const stores: PiniaStoreNode[] = [];

  for (const computedProp of computed.properties) {
    if (computedProp.type === 'SpreadElement'
      && computedProp.argument.type === 'CallExpression'
      && computedProp.argument.callee.type === 'Identifier'
      && computedProp.argument.callee.name === localMapStateName
      && computedProp.argument.arguments[0]?.type === 'Identifier'
      && (computedProp.argument.arguments[1]?.type === 'ArrayExpression' || computedProp.argument.arguments[1]?.type === 'ObjectExpression')
    ) {
      const storeName = computedProp.argument.arguments[0].name;
      const store = buildStoreNode(storeName);
      stores.push(store);

      const definition = computedProp.argument.arguments[1];

      if (definition.type === 'ArrayExpression') {
        for (const el of definition.elements) {
          if (!el) {
            continue;
          }

          if (el.type === 'Literal' && typeof el.value === 'string') {
            state.push({
              dependencies: [store.name],
              name: el.value,
              node: el,
              storeName: store.name,
              type: 'piniaState',
            });
          }
        }
      } else {
        for (const prop of definition.properties) {
          if (prop.type !== 'Property'
            || !isStringKey(prop.key)
          ) {
            continue;
          }

          if (prop.value.type === 'Literal'
            && typeof prop.value.value === 'string') {
            state.push({
              dependencies: [store.name],
              name: getStringKey(prop.key),
              node: prop.value,
              storeName: store.name,
              type: 'piniaState',
            });
          }

          if (prop.value.type === 'FunctionExpression' || prop.value.type === 'ArrowFunctionExpression') {
            if (prop.value.params[0]?.type === 'Identifier') {
              const paramName = prop.value.params[0].name;
              traverseScriptAST(prop.value.body, {
                visitMemberExpression(path) {
                  if (path.node.object.type === 'Identifier'
                    && path.node.object.name === paramName
                  ) {
                    path.node.object.name = store.name;
                    return false;
                  }

                  return this.traverse(path);
                },
              });

              prop.value.params = [];

              state.push({
                dependencies: [store.name],
                name: getStringKey(prop.key),
                node: toArrowFunctionExpression(prop.value),
                storeName: store.name,
                type: 'piniaState',
              });
            }
          }
        }
      }
    }
  }

  state.forEach((node) => {
    node.dependencies.push(...analyzeDependencies(node));
  });

  return {
    state,
    stores,
  };
}
