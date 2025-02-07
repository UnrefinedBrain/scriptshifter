import { builders as b } from 'vue-metamorph';
import type { VuexGetterNode } from '../ast';

export function renderVuexGetterNode(node: VuexGetterNode) {
  const namespacedGetterExpression = node.namespace.type === 'Literal' && typeof node.namespace.value === 'string'
    ? b.literal(`${node.namespace.value}/${node.getterName}`)
    : b.binaryExpression(
      '+',
      node.namespace,
      b.literal(`/${node.getterName}`),
    );

  const decl = b.variableDeclaration(
    'const',
    [b.variableDeclarator(
      b.identifier(node.name),
      b.callExpression(
        b.identifier('computed'),
        [b.arrowFunctionExpression(
          [],
          b.memberExpression(
            b.memberExpression(
              b.identifier('store'),
              b.identifier('getters'),
            ),
            namespacedGetterExpression,
            true,
          ),
        )],
      ),
    )],
  );

  decl.comments = node.comments;

  return decl;
}
