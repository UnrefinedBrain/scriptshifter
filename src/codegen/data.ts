import { builders as b } from 'vue-metamorph';
import type { DataNode } from '../ast';

export function renderDataNode(node: DataNode) {
  const decl = b.variableDeclaration('const', [
    b.variableDeclarator(
      b.identifier(node.name),
      b.callExpression(
        b.identifier('ref'),
        [node.node],
      ),
    ),
  ]);

  decl.comments = node.comments;

  return decl;
}
