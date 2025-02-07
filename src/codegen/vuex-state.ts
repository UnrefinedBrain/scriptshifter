import { builders as b } from 'vue-metamorph';
import type { VuexStateNode } from '../ast';

export function renderVuexStateNode(node: VuexStateNode) {
  const accessHelperCall = b.callExpression(
    b.identifier('getVuexState'),
    [
      b.memberExpression(
        b.identifier('store'),
        b.identifier('state'),
      ),
      node.namespace,
    ],
  );

  if (node.node.type === 'ArrowFunctionExpression') {
    const body = node.node.body.type === 'BlockStatement'
      ? node.node.body
      : b.blockStatement([]);

    const localStateName = node.node.params[0]!;

    body.body.unshift(
      b.variableDeclaration(
        'const',
        [
          b.variableDeclarator(localStateName, accessHelperCall),
        ],
      ),
    );

    if (node.node.body.type !== 'BlockStatement') {
      body.body.push(
        b.returnStatement(
          node.node.body,
        ),
      );
    }

    return b.variableDeclaration(
      'const',
      [
        b.variableDeclarator(
          b.identifier(node.name),
          b.callExpression(
            b.identifier('computed'),
            [
              b.arrowFunctionExpression([], body),
            ],
          ),
        ),
      ],
    );
  }

  return b.variableDeclaration(
    'const',
    [
      b.variableDeclarator(
        b.identifier(node.name),
        b.callExpression(
          b.identifier('computed'),
          [
            b.arrowFunctionExpression(
              [],
              b.memberExpression(
                accessHelperCall,
                node.node as never,
                true,
              ),
            ),
          ],
        ),
      ),
    ],
  );
}
