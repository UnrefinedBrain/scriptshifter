import { namedTypes } from 'vue-metamorph';
import { camelCase } from 'change-case';
import type { PiniaStoreNode } from '../ast';

export function buildStoreNode(name: string): PiniaStoreNode {
  return {
    dependencies: [],
    name: camelCase(name.replace(/^use/, '')),
    storeFunctionName: name,
    type: 'piniaStore',
    node: null,
  };
}

export function analyzePiniaMapStores(computed: namedTypes.ObjectExpression, mapStoresName: string) {
  const nodes: PiniaStoreNode[] = [];

  for (const prop of computed.properties) {
    if (prop.type === 'SpreadElement'
      && prop.argument.type === 'CallExpression'
      && prop.argument.callee.type === 'Identifier'
      && prop.argument.callee.name === mapStoresName
    ) {
      for (const arg of prop.argument.arguments) {
        if (arg.type === 'Identifier') {
          nodes.push(buildStoreNode(arg.name));
        }
      }
    }
  }

  return nodes;
}
