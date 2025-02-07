import { builders as b } from 'vue-metamorph';
import type { PropsNode } from '../ast';

export function renderPropsNodes(nodes: PropsNode[], shouldEmitVariable: boolean) {
  const defineProps = b.callExpression(
    b.identifier('defineProps'),
    [b.objectExpression(nodes.map((node) => node.node))],
  );

  return shouldEmitVariable
    ? b.variableDeclaration('const', [
      b.variableDeclarator(
        b.identifier('props'),
        defineProps,
      ),
    ])
    : b.expressionStatement(defineProps);
}
