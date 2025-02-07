import { builders as b } from 'vue-metamorph';
import type { ScriptSetupAst } from '../ast';
import { insertNamedImport } from './utils';
import { getStringKey } from '../analyze/utils';

export function transformProvideInject(ast: ScriptSetupAst) {
  if (ast.provides.length > 0) {
    insertNamedImport(ast, 'vue', 'provide');

    for (const provide of ast.provides) {
      ast.afterOptionsStatements.push(
        b.expressionStatement(
          b.callExpression(
            b.identifier('provide'),
            [
              provide.computed ? provide.key : b.literal(getStringKey(provide.key)),
              provide.node.expression,
            ],
          ),
        ),
      );
    }
  }

  if (ast.injects.length > 0) {
    insertNamedImport(ast, 'vue', 'inject');

    for (const inject of ast.injects) {
      ast.beforeOptionsStatements.push(
        b.variableDeclaration(
          'const',
          [
            b.variableDeclarator(
              b.identifier(inject.name),
              b.callExpression(
                b.identifier('inject'),
                [
                  inject.injectionKey,
                  ...inject.defaultValue
                    ? [inject.defaultValue]
                    : [],
                ],
              ),
            ),
          ],
        ),
      );
    }
  }
}
