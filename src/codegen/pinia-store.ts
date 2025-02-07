import { builders as b } from 'vue-metamorph';
import type { PiniaStoreNode } from '../ast';

export function renderPiniaMapStoresNode(node: PiniaStoreNode) {
  return b.variableDeclaration(
    'const',
    [
      b.variableDeclarator(
        b.identifier(node.name),
        b.callExpression(b.identifier(node.storeFunctionName), []),
      ),
    ],
  );
}
