import { builders as b } from 'vue-metamorph';
import type { ComputedNode } from '../ast';

export function renderComputedNode(node: ComputedNode) {
  const decl = b.variableDeclaration('const', [
    b.variableDeclarator(
      b.identifier(node.name),
      b.callExpression(
        b.identifier('computed'),
        [node.node],
      ),
    ),
  ]);

  decl.comments = node.comments;

  return decl;
}
