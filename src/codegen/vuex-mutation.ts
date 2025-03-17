import { builders as b } from 'vue-metamorph';
import type { VuexMutationNode } from '../ast';

export function renderVuexMutationNode(node: VuexMutationNode, isTypescript: boolean) {
  const namespacedMutationExpression = node.namespace.type === 'Literal' && typeof node.namespace.value === 'string'
    ? b.literal(`${node.namespace.value}/${node.mutationName}`)
    : b.binaryExpression(
      '+',
      node.namespace,
      b.literal(`/${node.mutationName}`),
    );

  const varName = b.identifier('payload');

  if (isTypescript) {
    varName.typeAnnotation = b.tsTypeAnnotation(b.tsUnknownKeyword());
  }

  const decl = b.variableDeclaration(
    'const',
    [b.variableDeclarator(
      b.identifier(node.name),
      b.arrowFunctionExpression(
        [varName],
        b.blockStatement([
          b.expressionStatement(
            b.callExpression(
              b.memberExpression(
                b.identifier('$store'),
                b.identifier('commit'),
              ),
              [
                namespacedMutationExpression,
                b.identifier('payload'),
              ],
            ),
          ),
        ]),
      ),
    )],
  );

  decl.comments = node.comments;

  return decl;
}
