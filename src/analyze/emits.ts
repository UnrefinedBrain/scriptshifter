import {
  namedTypes as n,
  traverseScriptAST,
  astHelpers,
  builders as b,
  AST,
} from 'vue-metamorph';
import type { EmitsNode } from '../ast';
import { getStringKey, isStringKey } from './utils';

export function analyzeEmits(optionsBlock: n.ObjectExpression, sfcAST: AST.VDocumentFragment): EmitsNode | null {
  for (const option of optionsBlock.properties) {
    if (option.type === 'Property'
        && isStringKey(option.key)
        && getStringKey(option.key) === 'emits'
        && (option.value.type === 'ArrayExpression' || option.value.type === 'ObjectExpression')) {
      return {
        type: 'emit',
        node: option.value,
        dependencies: [],
        name: 'defineEmits',
        comments: option.comments,
      };
    }
  }

  const emits = b.arrayExpression([]);
  const events = new Set<string>();
  traverseScriptAST(optionsBlock, {
    visitCallExpression(path) {
      if (path.node.callee.type === 'MemberExpression'
          && path.node.callee.object.type === 'ThisExpression'
          && path.node.callee.property.type === 'Identifier'
          && path.node.callee.property.name === '$emit'
          && path.node.arguments[0]?.type === 'Literal'
          && typeof path.node.arguments[0].value === 'string') {
        events.add(path.node.arguments[0].value);
      }
      return this.traverse(path);
    },
  });

  astHelpers
    .findAll(sfcAST, {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: '$emit',
      },
    })
    .forEach((node) => {
      if (node.callee.type === 'Identifier'
        && node.arguments[0]?.type === 'Literal'
        && typeof node.arguments[0].value === 'string'
      ) {
        events.add(node.arguments[0].value);
        node.callee.name = 'emit';
      }
    });

  Array
    .from(events)
    .forEach((event) => {
      emits.elements.push(b.literal(event));
    });

  return emits.elements.length > 0
    ? {
      dependencies: [],
      name: 'defineEmits',
      type: 'emit',
      node: emits,
      comments: [],
    }
    : null;
}
