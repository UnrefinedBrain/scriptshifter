import {
  traverseScriptAST,
  builders as b,
  namedTypes as n,
  type Kinds,
} from 'vue-metamorph';
import type {
  ComputedNode,
  CreatedHookNode,
  DataNode,
  LifecycleHookNode,
  MethodNode,
  OptionsNode,
  PiniaStateNode,
  ProvideNode,
  ScriptSetupAst,
  WatcherNode,
} from '../ast';
import {
  insertNamedImport,
  type NodeTypeMap,
} from './utils';
import { addStore } from './vuex';
import { VueVersion } from '../options';
import { getStringKey, isStringKey, isThisDotRefs } from '../analyze/utils';
import { refName } from '../analyze/refs';
import { isVersionGtEq } from '../version';

function isThisExpression(object: n.MemberExpression['object']) {
  if (object.type === 'ThisExpression') {
    return true;
  }

  if (object.type === 'TSAsExpression' && object.expression.type === 'ThisExpression') {
    return true;
  }

  return false;
}

type MemberNodePath = Parameters<NonNullable<NonNullable<Parameters<typeof traverseScriptAST>[1]>['visitMemberExpression']>>[0] & { node: { property: n.Identifier | (n.Literal & { value: string; }); }; };

type TransformArgs = {
  path: MemberNodePath;
  ast: ScriptSetupAst;
  vueVersion: VueVersion;
  isTypescript: boolean;
  node:
  | ProvideNode
  | ComputedNode
  | MethodNode
  | LifecycleHookNode
  | WatcherNode
  | DataNode
  | CreatedHookNode
  | OptionsNode
  | PiniaStateNode;
};

const createAccessPatterns = (
  {
    ast,
    isTypescript,
    path,
    vueVersion,
    node,
  }: TransformArgs,
) => ({
  ref() {
    path.replace(
      b.memberExpression(
        b.identifier(getStringKey(path.node.property)),
        b.identifier('value'),
      ),
    );
    return false;
  },

  raw() {
    path.replace(
      b.identifier(getStringKey(path.node.property)),
    );
    return false;
  },

  piniaAction() {
    const action = ast.piniaActions[getStringKey(path.node.property)]!;

    path.replace(
      b.memberExpression(
        b.identifier(action.storeName),
        b.identifier(action.actionName),
      ),
    );

    return false;
  },

  piniaState() {
    const state = ast.piniaStates[getStringKey(path.node.property)]!;

    if (state.node.type === 'Literal') {
      path.replace(
        b.memberExpression(
          b.identifier(state.storeName),
          b.identifier(state.node.value as string),
        ),
      );
    }

    if (state.node.type === 'ArrowFunctionExpression') {
      // inline getter will be emitted as a computed, so access with .value
      path.replace(
        b.memberExpression(
          b.identifier(getStringKey(path.node.property)),
          b.identifier('value'),
        ),
      );
    }

    return false;
  },

  piniaWritableState() {
    const property = getStringKey(path.node.property);
    const writableStateNode = ast.piniaWritableStates.find((x) => x.name === property)!;
    node.dependencies.push(writableStateNode.storeName);
    path.replace(
      b.memberExpression(
        b.identifier(writableStateNode.storeName),
        b.identifier(writableStateNode.stateName),
      ),
    );

    return false;
  },

  prop() {
    const newNode = b.memberExpression(
      b.identifier('props'),
      b.identifier(getStringKey(path.node.property)),
    );

    if (node.type === 'data' && node.node === path.node) {
      // the referencing node is a `data` and uses the prop as its initial value
      node.node = newNode;
    } else {
      path.replace(newNode);
    }

    return false;
  },

  $attrs() {
    insertNamedImport(ast, 'vue', 'useAttrs');
    path.replace(b.identifier('$attrs'));
    if (!ast.wasEmitted.attrs) {
      ast.beforeOptionsStatements.push(
        b.variableDeclaration(
          'const',
          [b.variableDeclarator(
            b.identifier('$attrs'),
            b.callExpression(
              b.identifier('useAttrs'),
              [],
            ),
          )],
        ),
      );

      ast.wasEmitted.attrs = true;
    }

    return false;
  },

  $slots() {
    insertNamedImport(ast, 'vue', 'useSlots');
    path.replace(b.identifier('$slots'));
    if (!ast.wasEmitted.slots) {
      ast.beforeOptionsStatements.push(
        b.variableDeclaration(
          'const',
          [b.variableDeclarator(
            b.identifier('$slots'),
            b.callExpression(
              b.identifier('useSlots'),
              [],
            ),
          )],
        ),
      );

      ast.wasEmitted.slots = true;
    }

    return false;
  },

  $nextTick() {
    insertNamedImport(ast, 'vue', 'nextTick');
    path.replace(b.identifier('nextTick'));
    return false;
  },

  $set() {
    insertNamedImport(ast, 'vue', 'set');
    path.replace(b.identifier('set'));
    return false;
  },

  $del() {
    insertNamedImport(ast, 'vue', 'del');
    path.replace(b.identifier('del'));
    return false;
  },

  $emit() {
    path.replace(b.identifier('emit'));

    return false;
  },

  $options() {
    path.replace(b.identifier('$options'));
    return false;
  },

  $store() {
    path.replace(b.identifier('$store'));

    if (!ast.wasEmitted.store) {
      addStore(ast, vueVersion, isTypescript);
    }
    return false;
  },

  $style() {
    if (!ast.wasEmitted.cssModule) {
      ast.wasEmitted.cssModule = true;
      ast.beforeOptionsStatements.push(
        b.variableDeclaration(
          'const',
          [b.variableDeclarator(
            b.identifier('$style'),
            b.callExpression(
              b.identifier('useCssModule'),
              [],
            ),
          )],
        ),
      );

      insertNamedImport(ast, 'vue', 'useCssModule');
    }

    path.replace(b.identifier('$style'));

    return false;
  },

  $router() {
    if (!ast.wasEmitted.router) {
      ast.wasEmitted.router = true;
      insertNamedImport(
        ast,
        isVersionGtEq(vueVersion, '3.4')
          ? 'vue-router'
          : 'vue-router/composables',
        'useRouter',
      );
      ast.beforeOptionsStatements.push(
        b.variableDeclaration(
          'const',
          [b.variableDeclarator(
            b.identifier('$router'),
            b.callExpression(
              b.identifier('useRouter'),
              [],
            ),
          )],
        ),
      );
    }

    path.replace(b.identifier('$router'));

    return false;
  },

  $route() {
    if (!ast.wasEmitted.route) {
      ast.wasEmitted.route = true;
      insertNamedImport(
        ast,
        vueVersion === '2.7'
          ? 'vue-router/composables'
          : 'vue-router',
        'useRoute',
      );
      ast.beforeOptionsStatements.push(
        b.variableDeclaration(
          'const',
          [b.variableDeclarator(
            b.identifier('$route'),
            b.callExpression(
              b.identifier('useRoute'),
              [],
            ),
          )],
        ),
      );
    }

    path.replace(b.identifier('$route'));

    return false;
  },

  unknown() {
    const name = getStringKey(path.node.property);
    path.replace(b.identifier(name));

    if (!ast.unknowns.some((unknownNode) => unknownNode.name === name)) {
      ast.unknowns.push({
        dependencies: [],
        name,
        type: 'unknown',
      });
    }

    return false;
  },

} satisfies Record<string, () => boolean>);

/**
 * Replaces `this.foo` with the new access pattern for foo depending on what it is
 *
 * @example this.someData     ---> someData.value
 * @example this.someComputed ---> someComputed.value
 * @example this.someProp     ---> props.someProp
 * @example this.someMethod() ---> someMethod()
 * @example this.$emit()      ---> emit()
 * @example this.$style.foo   ---> $style.foo
 * @example this.$router.foo  ---> $router.foo
 * @example this.$route.foo   ---> $route.foo
 * @example this.$refs.foo    ---> foo.value
 */
export function transformThisExpressions(ast: ScriptSetupAst, nodeTypes: NodeTypeMap, vueVersion: VueVersion, isTypescript: boolean) {
  const nodes = [
    ...ast.computed,
    ...ast.methods,
    ...ast.lifecycleHooks,
    ...ast.watchers,
    ...ast.data,
    ...ast.createdHook ? [ast.createdHook] : [],
    ...ast.$options ? [ast.$options] : [],
    ...Object.values(ast.piniaStates),
    ...ast.provides,
  ] satisfies { node: n.ASTNode; }[];

  nodes.forEach((node) => {
    // Pass 1: destructure transform
    // - transforms destructured vars to MemberExpression, where it will be transformed properly in pass 2
    // - removes destructure declarations
    traverseScriptAST(node.node, {
      visitVariableDeclaration(path) {
        const toRemove = new Set<n.VariableDeclarator | Kinds.IdentifierKind>();
        for (const declarator of path.node.declarations) {
          if (declarator.type !== 'VariableDeclarator'
            || declarator.id.type !== 'ObjectPattern'
          ) {
            continue;
          }

          if (
            declarator.init?.type === 'ThisExpression'
            || (declarator.init && isThisDotRefs(declarator.init))
          ) {
            const vars = declarator.id.properties.reduce((prev, cur) => {
              if (cur.type === 'Property'
                && cur.key.type === 'Identifier'
                && cur.value.type === 'Identifier') {
                prev[cur.value.name] = cur.key.name;
              }
              return prev;
            }, {} as Record<string, string>);

            const blocks = new Set<Kinds.ExpressionKind>();

            for (const variable of Object.keys(vars)) {
              blocks.add(path.scope?.lookup(variable).node);
            }

            for (const block of blocks) {
              traverseScriptAST(block, {
                visitIdentifier(innerPath) {
                  if (innerPath.parent.node.type === 'MemberExpression' && innerPath.parent.node.property === innerPath.node) {
                    return this.traverse(innerPath);
                  }
                  for (const variable of Object.keys(vars)) {
                    if (innerPath.node.name === variable) {
                      if (declarator.init?.type === 'MemberExpression' || declarator.init?.type === 'TSAsExpression') {
                        innerPath.replace(
                          b.memberExpression(
                            b.memberExpression(
                              b.thisExpression(),
                              b.identifier('$refs'),
                            ),
                            b.identifier(innerPath.node.name),
                          ),
                        );
                      } else {
                        innerPath.replace(
                          b.memberExpression(
                            b.thisExpression(),
                            b.identifier(innerPath.node.name),
                          ),
                        );
                      }
                      return false;
                    }
                  }
                  return this.traverse(innerPath);
                },
              });
            }

            toRemove.add(declarator);
          }
        }

        path.node.declarations = path.node.declarations.filter((decl) => !toRemove.has(decl));

        if (path.node.declarations.length === 0) {
          path.replace(undefined);
          return false;
        }

        return this.traverse(path);
      },
    });

    // Pass 2: transform this.something to new access patterns
    traverseScriptAST(node.node, {
      visitMemberExpression(path) {
        if (
          path.node.object.type === 'MemberExpression'
          && isThisExpression(path.node.object.object)
          && path.node.object.property.type === 'Identifier'
          && path.node.object.property.name === '$refs'
          && path.node.property.type === 'Identifier'
        ) {
          // this.$refs.foo becomes foo.value
          path.replace(
            b.memberExpression(
              b.identifier(refName(path.node.property.name)),
              b.identifier('value'),
            ),
          );

          return false;
        }

        if (isThisExpression(path.node.object) && isStringKey(path.node.property)) {
          const name = getStringKey(path.node.property);
          const referencedNodeType = nodeTypes[name];
          const accessPatterns = createAccessPatterns({
            ast,
            isTypescript,
            path: path as never,
            vueVersion,
            node,
          });

          switch (true) {
            // this.something ---> something.value
            case referencedNodeType === 'computed': return accessPatterns.ref();
            case referencedNodeType === 'data': return accessPatterns.ref();
            case referencedNodeType === 'watcher': return accessPatterns.ref();
            case referencedNodeType === 'vuexGetter': return accessPatterns.ref();
            case referencedNodeType === 'vuexState': return accessPatterns.ref();

            // this.something ---> something
            case referencedNodeType === 'rawData': return accessPatterns.raw();
            case referencedNodeType === 'inject': return accessPatterns.raw();
            case referencedNodeType === 'piniaStore': return accessPatterns.raw();
            case referencedNodeType === 'method': return accessPatterns.raw();
            case referencedNodeType === 'vuexAction': return accessPatterns.raw();
            case ast.setupVarNames[name] === 'ref': return accessPatterns.ref();
            case ast.setupVarNames[name] === 'raw': return accessPatterns.raw();

            // this.storeAction ---> storeName.storeAction
            case referencedNodeType === 'piniaAction': return accessPatterns.piniaAction();

            // this.foo ---> storeName.foo
            case referencedNodeType === 'piniaState': return accessPatterns.piniaState();

            // this.foo ---> storeName.foo
            case referencedNodeType === 'piniaWritableState': return accessPatterns.piniaWritableState();

            // this.foo ---> props.foo
            case referencedNodeType === 'prop': return accessPatterns.prop();

            // this.$attrs --> $attrs
            case name === '$attrs': return accessPatterns.$attrs();

            // this.$slots --> $slots
            case name === '$slots': return accessPatterns.$slots();

            // this.$nextTick --> nextTick
            case name === '$nextTick': return accessPatterns.$nextTick();

            // this.$set --> set
            case name === '$set': return accessPatterns.$set();

            // this.$delete --> del
            case name === '$delete': return accessPatterns.$del();

            // this.$emit --> emit
            case name === '$emit': return accessPatterns.$emit();

            // this.$options --> $options
            case name === '$options': return accessPatterns.$options();

            // this.$store --> store
            case name === '$store': return accessPatterns.$store();

            // this.$style --> $style
            case name === '$style': return accessPatterns.$style();

            // this.$router --> $router
            case name === '$router': return accessPatterns.$router();

            // this.$route --> $route
            case name === '$route': return accessPatterns.$route();
            default: return accessPatterns.unknown();
          }
        }

        return this.traverse(path);
      },
    });
  });
}
