import { builders as b } from 'vue-metamorph';
import type { EmitsNode } from '../ast';

export function renderEmitsNode(node: EmitsNode) {
  const decl = b.variableDeclaration('const', [
    b.variableDeclarator(
      b.identifier('emit'),
      b.callExpression(
        b.identifier('defineEmits'),
        [node.node],
      ),
    ),
  ]);

  decl.comments = node.comments;

  return decl;
}
