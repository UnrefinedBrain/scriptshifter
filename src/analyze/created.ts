import {
  namedTypes as n,
  builders as b,
} from 'vue-metamorph';
import type { CreatedHookNode } from '../ast';
import { analyzeDependencies } from './dependencies';
import {
  getStringKey,
  isStringKey,
} from './utils';

export function analyzeCreatedHook(optionsBlock: n.ObjectExpression): CreatedHookNode | null {
  // created hooks should be turned into an iife to preserve block scoping
  for (const option of optionsBlock.properties) {
    if (option.type === 'Property'
      && isStringKey(option.key)
      && getStringKey(option.key) === 'created'
      && option.value.type === 'FunctionExpression') {
      const fn = b.arrowFunctionExpression(
        [],
        option.value.body,
      );

      if (option.value.async) {
        fn.async = true;
      }

      const stmt = b.expressionStatement(
        b.callExpression(
          fn,
          [],
        ),
      );

      const node: CreatedHookNode = {
        type: 'created',
        dependencies: [],
        name: '',
        node: stmt,
      };

      node.dependencies.push(...analyzeDependencies(node));

      return node;
    }
  }

  return null;
}
