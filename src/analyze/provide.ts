import {
  namedTypes as n,
  builders as b,
  traverseScriptAST,
} from 'vue-metamorph';
import type { ProvideNode } from '../ast';
import {
  getStringKey,
  isPattern,
  isStringKey,
} from './utils';
import { analyzeDependencies } from './dependencies';

export function analyzeProvide(provide: n.ObjectExpression | n.ArrowFunctionExpression | n.FunctionExpression) {
  const nodes: ProvideNode[] = [];

  let properties: n.ObjectExpression['properties'] | undefined;

  if (provide.type === 'ObjectExpression'
    || provide.body.type === 'ObjectExpression'
  ) {
    properties = provide.type === 'ObjectExpression'
      ? provide.properties
      : (provide.body as n.ObjectExpression).properties;
  } else {
    traverseScriptAST(provide.body, {
      visitReturnStatement(path) {
        if (path.node.argument?.type === 'ObjectExpression') {
          properties = path.node.argument.properties;
          return false;
        }

        return this.traverse(path);
      },
    });
  }

  if (!properties) {
    throw new Error('Could not determine properties of provide block');
  }

  for (const prop of properties) {
    if (prop.type === 'Property'
    && isStringKey(prop.key)
    && !isPattern(prop.value)
    ) {
      nodes.push({
        type: 'provide',
        dependencies: [],
        name: `provide-${getStringKey(prop.key)}`,
        key: prop.key,
        node: b.expressionStatement(prop.value),
        computed: prop.computed ?? false,
      });
    }
  }

  nodes.forEach((node) => {
    node.dependencies = analyzeDependencies(node);
  });

  return nodes;
}
