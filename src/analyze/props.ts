import { namedTypes as n } from 'vue-metamorph';
import type {
  PropsNode,
  ScriptSetupAst,
} from '../ast';
import { analyzeDependencies } from './dependencies';
import {
  getStringKey,
  isStringKey,
} from './utils';

export function analyzeProps(props: n.ObjectExpression): PropsNode[] {
  const nodes: PropsNode[] = [];

  props.properties.forEach((prop) => {
    if (prop.type === 'Property' && isStringKey(prop.key)) {
      nodes.push({
        name: getStringKey(prop.key),
        dependencies: [],
        node: prop,
        type: 'prop',
        comments: prop.comments,
      });
    }
  });

  nodes.forEach((node) => {
    node.dependencies = analyzeDependencies(node);
  });

  return nodes;
}

/**
 * Checks if props are referenced by other nodes.
 *
 * Used to determine whether to emit defineProps() as a variable declaration or a top-level function call
 */
export function analyzeIfPropsReferenced(ast: ScriptSetupAst): boolean {
  if (!ast.props) {
    return false;
  }

  const dependencyNodes = [
    ...ast.data,
    ...ast.lifecycleHooks,
    ...ast.watchers,
    ...ast.createdHook ? [ast.createdHook] : [],
    ...ast.methods,
    ...ast.computed,
    ...ast.provides,
  ];

  const propsNames = ast.props?.reduce<Record<string, true>>((acc, cur) => {
    acc[cur.name] = true;
    return acc;
  }, {});

  for (const node of dependencyNodes) {
    for (const dep of node.dependencies) {
      if (propsNames[dep]) {
        return true;
      }
    }
  }

  return false;
}
