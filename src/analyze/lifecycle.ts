import { namedTypes as n } from 'vue-metamorph';
import type { LifecycleHookNode } from '../ast';
import { analyzeDependencies } from './dependencies';
import {
  getStringKey,
  isStringKey,
  normalizeLifecycleHookName,
  toArrowFunctionExpression,
} from './utils';

export function analyzeLifecycleHooks(optionsBlock: n.ObjectExpression): LifecycleHookNode[] {
  // created hook is not handled here
  const nodes: LifecycleHookNode[] = [];

  for (const option of optionsBlock.properties) {
    if (option.type === 'Property'
      && isStringKey(option.key)
      && (option.value.type === 'ArrowFunctionExpression' || option.value.type === 'FunctionExpression')
      && normalizeLifecycleHookName(getStringKey(option.key))) {
      nodes.push({
        dependencies: [],
        name: normalizeLifecycleHookName(getStringKey(option.key))!,
        node: toArrowFunctionExpression(option.value),
        type: 'lifecycle',
      });
    }
  }

  nodes.forEach((node) => {
    node.dependencies = analyzeDependencies(node);
  });

  return nodes;
}
