import { builders as b } from 'vue-metamorph';
import type { UnknownNode } from '../ast';

export function renderUnknownNode(node: UnknownNode) {
  const decl = b.variableDeclaration(
    'const',
    [b.variableDeclarator(
      b.identifier(node.name),
      b.identifier('FIX_ME'),
    )],
  );

  decl.comments = [
    b.commentLine(` ⚠️ scriptshifter: Could not determine how/where the "${node.name}" variable was defined in this file`),
  ];

  return decl;
}
