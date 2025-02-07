import { namedTypes as n } from 'vue-metamorph';
import type { WatcherNode } from '../ast';
import { analyzeDependencies } from './dependencies';
import {
  getStringKey,
  isStringKey,
  toArrowFunctionExpression,
} from './utils';

export function analyzeWatchers(watch: n.ObjectExpression): WatcherNode[] {
  const nodes: WatcherNode[] = [];

  for (const watcher of watch.properties) {
    if (watcher.type === 'Property'
      && (isStringKey(watcher.key))
      && (watcher.value.type === 'FunctionExpression'
        || watcher.value.type === 'ObjectExpression'
        || watcher.value.type === 'ArrowFunctionExpression')) {
      const isDeep = watcher.value.type === 'ObjectExpression'
        && watcher.value.properties.some((watchProp) => watchProp.type === 'Property'
          && isStringKey(watchProp.key)
          && getStringKey(watchProp.key) === 'deep'
          && watchProp.value.type === 'Literal'
          && watchProp.value.value === true);

      const isImmediate = watcher.value.type === 'ObjectExpression'
        && watcher.value.properties.some((watchProp) => watchProp.type === 'Property'
          && isStringKey(watchProp.key)
          && getStringKey(watchProp.key) === 'immediate'
          && watchProp.value.type === 'Literal'
          && watchProp.value.value === true);

      const name = getStringKey(watcher.key);

      let handler = watcher.value.type === 'FunctionExpression'
        ? toArrowFunctionExpression(watcher.value)
        : watcher.value;

      if (watcher.value.type === 'ObjectExpression') {
        for (const property of watcher.value.properties) {
          if (property.type === 'Property'
            && isStringKey(property.key)
            && getStringKey(property.key) === 'handler'
            && (property.value.type === 'FunctionExpression'
              || property.value.type === 'ArrowFunctionExpression')) {
            handler = toArrowFunctionExpression(property.value);
          }
        }
      }

      nodes.push({
        dependencies: [],
        isDeep,
        isImmediate,
        name: `${name}_watcher`,
        watchName: name,
        node: handler,
        type: 'watcher',
        sourceType: 'ref', // this will be overwritten later
        comments: watcher.comments,
      });
    }
  }

  nodes.forEach((node) => {
    node.dependencies = analyzeDependencies(node);
  });

  return nodes;
}
