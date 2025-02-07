import { namedTypes as n } from 'vue-metamorph';
import type { DirectiveNode } from '../ast';
import {
  getStringKey,
  isStringKey,
} from './utils';

export function analyzeDirectives(directivesBlock: n.ObjectExpression): DirectiveNode[] {
  const nodes: DirectiveNode[] = [];

  for (const directive of directivesBlock.properties) {
    if (directive.type === 'Property'
      && isStringKey(directive.key)) {
      nodes.push({
        dependencies: [],
        name: getStringKey(directive.key),
        node: directive.value.type === 'ObjectExpression'
          ? directive.value
          : null,
        type: 'directive',
        comments: directive.comments,
      });
    }
  }

  return nodes;
}
