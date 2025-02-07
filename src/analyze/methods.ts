import { namedTypes as n } from 'vue-metamorph';
import type { MethodNode } from '../ast';
import { analyzeDependencies } from './dependencies';
import {
  getStringKey,
  isPattern,
  isStringKey,
  toArrowFunctionExpression,
} from './utils';

export function analyzeMethods(methods: n.ObjectExpression): MethodNode[] {
  const nodes: MethodNode[] = [];

  methods.properties
    .filter(
      (prop): prop is n.Property & { key: n.Identifier | (n.Literal & { value: string; }); } => prop.type === 'Property'
      && isStringKey(prop.key),
    )
    .forEach((prop) => {
      if (isPattern(prop.value)) {
        return;
      }

      nodes.push({
        dependencies: [],
        name: getStringKey(prop.key),
        node: prop.value.type === 'FunctionExpression'
          ? toArrowFunctionExpression(prop.value)
          : prop.value,
        type: 'method',
        comments: prop.comments,
      });
    });

  nodes.forEach((node) => {
    node.dependencies = analyzeDependencies(node);
  });

  return nodes;
}
