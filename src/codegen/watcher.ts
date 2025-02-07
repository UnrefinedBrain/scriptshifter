import { builders as b } from 'vue-metamorph';
import type { WatcherNode } from '../ast';

// eslint-disable-next-line consistent-return
export function renderWatcherSource(node: WatcherNode) {
  // eslint-disable-next-line default-case
  switch (node.sourceType) {
    case 'compoundRef': {
      const parts = node.watchName.split('.');
      parts.splice(1, 0, 'value');
      return b.arrowFunctionExpression(
        [],
        b.identifier(parts.join('.')),
      );
    }

    case 'compoundProp': return b.arrowFunctionExpression(
      [],
      b.identifier(`props.${node.watchName}`),
    );

    case 'prop': return b.arrowFunctionExpression(
      [],
      b.memberExpression(
        b.identifier('props'),
        b.identifier(node.watchName),
      ),
    );

    case 'ref': return b.identifier(node.watchName);
  }
}

export function renderWatcherNode(node: WatcherNode) {
  const decl = b.expressionStatement(
    b.callExpression(
      b.identifier('watch'),
      [
        renderWatcherSource(node),
        node.node,
        ...(node.isDeep || node.isImmediate) ? [
          b.objectExpression([
            ...node.isDeep ? [b.property('init', b.identifier('deep'), b.literal(true))] : [],
            ...node.isImmediate ? [b.property('init', b.identifier('immediate'), b.literal(true))] : [],
          ]),
        ] : [],
      ],
    ),
  );

  decl.comments = node.comments;

  return decl;
}
