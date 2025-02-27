import { builders as b } from 'vue-metamorph';
import type { ScriptSetupAst } from '../ast';
import { insertNamedImport } from './utils';
import { VueVersion } from '../options';
import { isVersionGtEq } from '../version';

const identity = <T>(i: T) => i;

// const store = useStore();
export const useStoreDeclarationVue3 = b.variableDeclaration(
  'const',
  [
    b.variableDeclarator(
      b.identifier('store'),
      b.callExpression(
        b.identifier('useStore'),
        [],
      ),
    ),
  ],
);

// const store = getCurrentInstance().proxy.$store;
export const storeDeclarationVue2 = (isTypescript: boolean) => b.variableDeclaration(
  'const',
  [
    b.variableDeclarator(
      b.identifier('store'),
      b.memberExpression(
        b.memberExpression(
          (isTypescript ? b.tsNonNullExpression : identity)(b.callExpression(
            b.identifier('getCurrentInstance'),
            [],
          )),

          b.identifier('proxy'),
        ),
        b.identifier('$store'),
      ),

    ),
  ],
);

export const addStore = (ast: ScriptSetupAst, vueVersion: VueVersion, isTypescript: boolean) => {
  if (isVersionGtEq(vueVersion, '3.4')) {
    ast.beforeOptionsStatements.push(useStoreDeclarationVue3);
    insertNamedImport(ast, 'vuex', 'useStore');
  } else {
    insertNamedImport(ast, 'vue', 'getCurrentInstance');
    ast.beforeOptionsStatements.push(storeDeclarationVue2(isTypescript));
  }
  ast.wasEmitted.store = true;
};

export const mapStateAccessHelper = (isTypescript: boolean) => {
  const obj = b.identifier('obj');
  const namespace = b.identifier('namespace');
  const path = b.identifier('path');

  if (isTypescript) {
    namespace.typeAnnotation = b.tsTypeAnnotation(b.tsStringKeyword());
    obj.typeAnnotation = b.tsTypeAnnotation(
      b.tsTypeReference(
        b.identifier('Record'),
        b.tsTypeParameterInstantiation([
          b.tsStringKeyword(),
          b.tsAnyKeyword(),
        ]),
      ),
    );
  }

  const varName = b.identifier('getVuexState');

  const decl = b.variableDeclaration(
    'const',
    [
      b.variableDeclarator(
        varName,
        b.arrowFunctionExpression(
          [
            obj,
            namespace,
            b.assignmentPattern(
              path,
              b.callExpression(
                b.memberExpression(
                  b.identifier('namespace'),
                  b.identifier('split'),
                ),
                [b.literal('/')],
              ),
            ),
          ],
          b.blockStatement([
            b.ifStatement(
              b.binaryExpression(
                '===',
                b.memberExpression(path, b.identifier('length')),
                b.literal(1),
              ),
              b.blockStatement([
                b.returnStatement(
                  b.memberExpression(
                    b.identifier('obj'),
                    (isTypescript ? b.tsNonNullExpression : identity)(b.memberExpression(
                      path,
                      b.literal(0),
                      true,
                    )),
                    true,
                  ),
                ),
              ]),
            ),

            b.returnStatement(
              b.callExpression(
                varName,
                [
                  b.memberExpression(
                    b.identifier('obj'),
                    (isTypescript ? b.tsNonNullExpression : identity)(b.memberExpression(
                      b.callExpression(
                        b.memberExpression(
                          path,
                          b.identifier('splice'),
                        ),
                        [
                          b.literal(0),
                          b.literal(1),
                        ],
                      ),
                      b.literal(0),
                      true,
                    )),
                    true,
                  ),

                  b.identifier('namespace'),

                  path,
                ],
              ),
            ),
          ]),
        ),
      ),
    ],
  );

  decl.comments = [b.commentBlock('*\n * accesses a vuex state \n ')];
  return decl;
};
