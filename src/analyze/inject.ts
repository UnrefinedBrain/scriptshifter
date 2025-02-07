import {
  namedTypes as n,
  builders as b,
} from 'vue-metamorph';
import type { InjectNode } from '../ast';
import {
  getStringKey,
  isPattern,
  isStringKey,
} from './utils';

export function analyzeInject(injectBlock: n.ArrayExpression | n.ObjectExpression) {
  const nodes: InjectNode[] = [];

  if (injectBlock.type === 'ArrayExpression') {
    for (const inject of injectBlock.elements) {
      if (
        inject?.type !== 'Literal'
        || typeof inject.value !== 'string'
      ) {
        continue;
      }
      nodes.push({
        type: 'inject',
        dependencies: [],
        name: inject.value,
        injectionKey: inject,
        node: null,
        defaultValue: null,
      });
    }
  } else {
    for (const inject of injectBlock.properties) {
      if (inject.type !== 'Property'
        || !isStringKey(inject.key)
      ) {
        continue;
      }

      if (inject.value.type === 'Literal' || inject.value.type === 'Identifier') {
        nodes.push({
          type: 'inject',
          defaultValue: null,
          dependencies: [],
          injectionKey: inject.value,
          name: getStringKey(inject.key),
          node: null,
        });
      } else if (inject.value.type === 'ObjectExpression') {
        let injectionKey: InjectNode['injectionKey'] = inject.key;
        let defaultValue: InjectNode['defaultValue'] = null;

        let hasFrom = false;

        for (const prop of inject.value.properties) {
          if (prop.type !== 'Property'
            || isPattern(prop.value)
          ) {
            continue;
          }

          if (prop.key.type === 'Identifier') {
            switch (prop.key.name) {
              case 'from': {
                if (prop.value.type === 'Literal' || prop.value.type === 'Identifier') {
                  injectionKey = prop.value;
                }

                hasFrom = true;
                break;
              }

              case 'default': {
                defaultValue = prop.value;
                break;
              }

              default:
            }
          }
        }

        nodes.push({
          defaultValue,
          dependencies: [],
          injectionKey: !hasFrom && injectionKey.type === 'Identifier'
            ? b.literal(injectionKey.name)
            : injectionKey,
          name: getStringKey(inject.key),
          node: null,
          type: 'inject',
        });
      }
    }
  }

  return nodes;
}
