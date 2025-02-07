import { namedTypes as n } from 'vue-metamorph';
import type { ComputedNode } from '../ast';
import { analyzeDependencies } from './dependencies';
import {
  getStringKey,
  isStringKey,
  toArrowFunctionExpression,
} from './utils';

export function analyzeComputed(computedBlock: n.ObjectExpression): ComputedNode[] {
  const nodes: ComputedNode[] = [];

  for (const computed of computedBlock.properties) {
    if (computed.type === 'Property'
      && isStringKey(computed.key)
      && (computed.value.type === 'ArrowFunctionExpression'
        || computed.value.type === 'ObjectExpression'
        || computed.value.type === 'FunctionExpression')) {
      nodes.push({
        dependencies: [],
        name: getStringKey(computed.key),
        node: computed.value.type === 'ObjectExpression'
          ? computed.value
          : toArrowFunctionExpression(computed.value),
        type: 'computed',
        comments: computed.comments,
      });
    }
  }

  nodes.forEach((node) => {
    node.dependencies = analyzeDependencies(node);
  });

  return nodes;
}
