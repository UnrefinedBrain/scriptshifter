import { namedTypes as n } from 'vue-metamorph';
import type {
  PiniaActionNode,
  PiniaStoreNode,
} from '../ast';
import { buildStoreNode } from './pinia-mapstores';
import {
  getStringKey,
  isStringKey,
} from './utils';

export function analyzePiniaActions(
  methodsBlock: n.ObjectExpression,
  mapActionsLocalName: string,
) {
  const actions: PiniaActionNode[] = [];
  const stores: PiniaStoreNode[] = [];

  for (const method of methodsBlock.properties) {
    if (method.type === 'SpreadElement'
      && method.argument.type === 'CallExpression'
      && method.argument.callee.type === 'Identifier'
      && method.argument.callee.name === mapActionsLocalName
      && method.argument.arguments[0]?.type === 'Identifier'
      && (method.argument.arguments[1]?.type === 'ArrayExpression'
        || method.argument.arguments[1]?.type === 'ObjectExpression'
      )) {
      const { name } = method.argument.arguments[0];
      const store = buildStoreNode(name);
      stores.push(store);

      const definition = method.argument.arguments[1];

      if (definition.type === 'ArrayExpression') {
        for (const item of definition.elements) {
          if (item?.type === 'Literal' && typeof item.value === 'string') {
            actions.push({
              actionName: item.value,
              dependencies: [store.name],
              name: item.value,
              node: null,
              type: 'piniaAction',
              storeName: store.name,
            });
          }
        }
      } else {
        for (const prop of definition.properties) {
          if (prop.type !== 'Property'
            || !isStringKey(prop.key)
            || prop.value.type !== 'Literal'
            || typeof prop.value.value !== 'string'
          ) {
            continue;
          }

          actions.push({
            actionName: prop.value.value,
            dependencies: [store.name],
            name: getStringKey(prop.key),
            node: null,
            storeName: store.name,
            type: 'piniaAction',
          });
        }
      }
    }
  }

  return {
    actions,
    stores,
  };
}
