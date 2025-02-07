import { builders as b } from 'vue-metamorph';
import type { MethodNode } from '../ast';

export function renderMethodNode(node: MethodNode) {
  const decl = b.variableDeclaration(
    'const',
    [b.variableDeclarator(
      b.identifier(node.name),
      node.node,
    )],
  );

  decl.comments = node.comments;

  return decl;
}
