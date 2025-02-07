import {
  namedTypes as n,
  traverseScriptAST,
} from 'vue-metamorph';
import type { RefsNode } from '../ast';
import {
  getStringKey,
  isStringKey,
  isThisDotRefs,
} from './utils';

export const refName = (s: string) => `${s}$`;

export function analyzeRefs(options: n.ObjectExpression) {
  const nodes: RefsNode[] = [];

  const refs: Record<string, true> = {};

  traverseScriptAST(options, {
    visitVariableDeclaration(path) {
      for (const declarator of path.node.declarations) {
        if (
          declarator.type !== 'VariableDeclarator'
          || declarator.id.type !== 'ObjectPattern'
          || !declarator.init
          || !isThisDotRefs(declarator.init)
        ) {
          continue;
        }

        for (const prop of declarator.id.properties) {
          if (prop.type !== 'Property'
            || prop.key.type !== 'Identifier'
            || prop.value.type !== 'Identifier'
          ) {
            continue;
          }

          const name = refName(prop.value.name);

          if (!refs[name]) {
            nodes.push({
              dependencies: [],
              name,
              node: null,
              type: 'refs',
            });

            refs[name] = true;
          }
        }
      }
      this.traverse(path);
    },
    visitMemberExpression(path) {
      if (
        path.node.object.type === 'MemberExpression'
        && path.node.object.object.type === 'ThisExpression'
        && path.node.object.property.type === 'Identifier'
        && path.node.object.property.name === '$refs'
        && isStringKey(path.node.property)
        && !refs[refName(getStringKey(path.node.property))]
      ) {
        const name = refName(getStringKey(path.node.property));
        nodes.push({
          dependencies: [],
          name,
          node: null,
          type: 'refs',
        });
        refs[name] = true;
      }
      this.traverse(path);
    },
  });

  return nodes;
}
