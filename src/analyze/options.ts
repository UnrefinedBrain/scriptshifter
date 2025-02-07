import {
  namedTypes as n,
  builders as b,
} from 'vue-metamorph';
import type { OptionsNode } from '../ast';
import {
  getStringKey,
  isStringKey,
} from './utils';

const vueOptions = [
  'compatConfig',
  'data',
  'computed',
  'methods',
  'watch',
  'provide',
  'inject',
  'filters',
  'mixins',
  'extends',
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'activated',
  'deactivated',
  'beforeDestroy',
  'beforeUnmount',
  'destroyed',
  'unmounted',
  'renderTracked',
  'renderTriggered',
  'errorCaptured',
  'name',
  'setup',
  'template',
  'components',
  'directives',
  'inheritAttrs',
  'emits',
  'slots',
  'expose',
  'props',
].reduce<Record<string, true>>((prev, cur) => {
  prev[cur] = true;
  return prev;
}, {});

export function analyzeOptions(options: n.ObjectExpression): OptionsNode | null {
  const node: OptionsNode = {
    type: 'options',
    dependencies: [],
    name: '$options',
    node: b.objectExpression([]),
  };

  for (const prop of options.properties) {
    if (prop.type === 'Property'
      && isStringKey(prop.key)
      && vueOptions[getStringKey(prop.key)]
    ) {
      continue;
    }

    node.node.properties.push(prop);
  }

  if (node.node.properties.length > 0) {
    return node;
  }

  return null;
}
