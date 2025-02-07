import { builders as b } from 'vue-metamorph';
import type { LifecycleHookNode } from '../ast';

export function renderLifecycleHook(node: LifecycleHookNode) {
  return b.expressionStatement(
    b.callExpression(
      b.identifier(node.name),
      [node.node],
    ),
  );
}
