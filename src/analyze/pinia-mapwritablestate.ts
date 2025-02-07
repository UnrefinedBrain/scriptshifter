import { namedTypes as n } from 'vue-metamorph';
import type {
  PiniaWritableStateNode,
  PiniaStoreNode,
} from '../ast';
import { buildStoreNode } from './pinia-mapstores';
import {
  getStringKey,
  isStringKey,
} from './utils';

export function analyzePiniaMapWriteableState(computed: n.ObjectExpression, localMapWriteableStateName: string) {
  const state: PiniaWritableStateNode[] = [];
  const stores: PiniaStoreNode[] = [];

  for (const computedProp of computed.properties) {
    if (computedProp.type === 'SpreadElement'
      && computedProp.argument.type === 'CallExpression'
      && computedProp.argument.callee.type === 'Identifier'
      && computedProp.argument.callee.name === localMapWriteableStateName
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
              node: null,
              storeName: store.name,
              type: 'piniaWritableState',
              stateName: el.value,
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

          state.push({
            dependencies: [store.name],
            name: getStringKey(prop.key),
            node: null,
            stateName: prop.value.value,
            storeName: store.name,
            type: 'piniaWritableState',
          });
        }
      }
    }
  }

  return {
    state,
    stores,
  };
}
