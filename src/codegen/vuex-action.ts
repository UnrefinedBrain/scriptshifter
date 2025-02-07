import { builders as b } from 'vue-metamorph';
import type { VuexActionNode } from '../ast';

export function renderVuexActionNode(node: VuexActionNode, isTypescript: boolean) {
  const namespacedActionExpression = node.namespace.type === 'Literal' && typeof node.namespace.value === 'string'
    ? b.literal(`${node.namespace.value}/${node.actionName}`)
    : b.binaryExpression(
      '+',
      node.namespace,
      b.literal(`/${node.actionName}`),
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
        b.callExpression(
          b.memberExpression(
            b.identifier('store'),
            b.identifier('dispatch'),
          ),
          [
            namespacedActionExpression,
            b.identifier('payload'),
          ],
        ),
      ),
    )],
  );

  decl.comments = node.comments;

  return decl;
}
