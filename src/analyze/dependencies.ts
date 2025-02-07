import {
  traverseScriptAST,
  type Kinds,
} from 'vue-metamorph';
import type { ScriptSetupNode } from '../ast';
import { CompoundWatcherRegex, isThisDotRefs } from './utils';
import { refName } from './refs';

export function analyzeDependencies(node: ScriptSetupNode) {
  const dependencies = new Set<string>();

  const visitExpression = (expr: Kinds.ExpressionKind) => {
    traverseScriptAST(expr, {
      visitVariableDeclaration(path) {
        for (const declarator of path.node.declarations) {
          if (
            declarator.type !== 'VariableDeclarator'
            || declarator.id.type !== 'ObjectPattern'
          ) {
            continue;
          }

          // `const { foo } = this` depends on foo
          // `const { foo } = this.$refs` depends on foo
          if (
            declarator.init
            && (declarator.init?.type === 'ThisExpression'
              || isThisDotRefs(declarator.init))) {
            for (const prop of declarator.id.properties) {
              if (prop.type !== 'Property'
                || prop.value.type !== 'Identifier'
              ) {
                continue;
              }

              dependencies.add(refName(prop.value.name));
            }
          }
        }

        return this.traverse(path);
      },
      visitMemberExpression(path) {
        if (path.node.object.type === 'ThisExpression') {
          // this['foo'] depends on foo
          if (path.node.property.type === 'Literal'
              && typeof path.node.property.value === 'string') {
            dependencies.add(path.node.property.value);
          }

          // this.foo depends on foo
          if (path.node.property.type === 'Identifier') {
            dependencies.add(path.node.property.name);
          }
        }

        // this.$refs.foo depends on foo
        if (path.node.object.type === 'MemberExpression'
          && path.node.property.type === 'Identifier'
          && path.node.object.object.type === 'ThisExpression'
          && path.node.object.property.type === 'Identifier'
          && path.node.object.property.name === '$refs'
        ) {
          dependencies.add(refName(path.node.property.name));
        }

        return this.traverse(path);
      },
    });
  };

  // normal computed / methods / watchers
  if (node.node?.type === 'ArrowFunctionExpression') {
    visitExpression(node.node);
  }

  if (node.type === 'data') {
    visitExpression(node.node);
  }

  if (node.type === 'created') {
    visitExpression(node.node.expression);
  }

  if (node.type === 'provide') {
    visitExpression(node.node.expression);
  }

  // settable computed properties
  if (node.type === 'computed' && node.node.type === 'ObjectExpression') {
    for (const prop of node.node.properties) {
      if (prop.type === 'Property'
          && prop.key.type === 'Identifier'
          && ['get', 'set'].includes(prop.key.name)
          && (prop.value.type === 'ArrowFunctionExpression' || prop.value.type === 'FunctionExpression')) {
        visitExpression(prop.value);
      }
    }
  }

  if (node.type === 'watcher') {
    if (CompoundWatcherRegex.test(node.watchName)) {
      // if the watch key is something like 'person.firstName', we have a dependency on `person`
      const [name] = node.watchName.split('.');
      dependencies.add(name!);
    } else {
      dependencies.add(node.watchName);
    }
  }

  return Array.from(dependencies);
}
