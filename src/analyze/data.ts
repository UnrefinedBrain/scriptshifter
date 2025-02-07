import { namedTypes as n } from 'vue-metamorph';
import type { DataNode } from '../ast';
import { analyzeDependencies } from './dependencies';
import {
  getStringKey,
  isStringKey,
} from './utils';

export function analyzeData(dataFn: n.ArrowFunctionExpression | n.FunctionExpression): DataNode[] {
  const nodes: DataNode[] = [];
  // case 1: data() { return { prop1: 0 } }
  // case 2: data: () => ({ prop1: 0 })

  const visitObjectExpression = (expr: n.ObjectExpression) => {
    for (const prop of expr.properties) {
      if (prop.type === 'Property'
        && isStringKey(prop.key)
        && (prop.value.type.includes('Expression')
          || prop.value.type === 'Identifier'
          || prop.value.type === 'Literal')) {
        nodes.push({
          type: prop.value.type === 'Identifier' && getStringKey(prop.key) === prop.value.name
            ? 'rawData'
            : 'data',
          name: getStringKey(prop.key),
          dependencies: [],
          node: prop.value as never,
          comments: prop.comments,
        });
      }
    }
  };

  if (dataFn.body.type === 'ObjectExpression') {
    visitObjectExpression(dataFn.body);
  } else if (dataFn.body.type === 'BlockStatement') {
    for (const statement of dataFn.body.body) {
      if (statement.type === 'ReturnStatement'
        && statement.argument?.type === 'ObjectExpression') {
        visitObjectExpression(statement.argument);
      }
    }
  }

  nodes.forEach((node) => {
    node.dependencies = analyzeDependencies(node);
  });

  return nodes;
}
