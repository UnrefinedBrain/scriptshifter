import { builders as b } from 'vue-metamorph';
import type { OptionsNode } from '../ast';

export function renderOptionsNode(node: OptionsNode) {
  return b.variableDeclaration(
    'const',
    [
      b.variableDeclarator(
        b.identifier('$options'),
        node.node,
      ),
    ],
  );
}
