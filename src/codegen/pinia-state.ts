import { builders as b } from 'vue-metamorph';
import type { PiniaStateNode } from '../ast';

export function renderPiniaStateNode(node: PiniaStateNode) {
  if (node.node.type !== 'ArrowFunctionExpression') {
    return null;
  }

  return b.variableDeclaration(
    'const',
    [
      b.variableDeclarator(
        b.identifier(node.name),
        b.callExpression(
          b.identifier('computed'),
          [node.node],
        ),
      ),
    ],
  );
}
