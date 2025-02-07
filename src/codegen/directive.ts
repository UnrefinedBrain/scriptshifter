import { builders as b } from 'vue-metamorph';
import type { DirectiveNode } from '../ast';

export const transformDirectiveName = (str: string) => `v${str.slice(0, 1).toUpperCase()}${str.slice(1)}`;

export function renderDirectiveNode(node: DirectiveNode) {
  if (!node.node) {
    // this directive is imported and was already handled during transformation
    return null;
  }

  return b.variableDeclaration(
    'const',
    [b.variableDeclarator(
      b.identifier(transformDirectiveName(node.name)),
      node.node,
    )],
  );
}
