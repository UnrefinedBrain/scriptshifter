import {
  namedTypes as n,
  builders as b,
} from 'vue-metamorph';
import type { ScriptSetupAst } from '../ast';

const transformDirectiveName = (str: string) => `v${str.slice(0, 1).toUpperCase()}${str.slice(1)}`;

export function transformDirectives(ast: ScriptSetupAst) {
  // in <script setup>, directives just need to be imported and named as
  // vDirectiveName

  for (const directive of ast.directives) {
    if (directive.node) {
      // only dealing with imported directives here
      continue;
    }

    let specifier: n.ImportSpecifier | n.ImportNamespaceSpecifier | n.ImportDefaultSpecifier | undefined;

    for (const stmt of ast.beforeOptionsStatements) {
      if (stmt.type !== 'ImportDeclaration'
        || stmt.importKind !== 'value'
        || !stmt.specifiers
      ) {
        continue;
      }

      for (const spec of stmt.specifiers) {
        if (spec.local?.name === directive.name) {
          specifier = spec;
        }

        if (spec.type === 'ImportSpecifier' && spec.imported.name === directive.name) {
          specifier = spec;
        }
      }

      if (specifier) {
        break;
      }
    }

    if (!specifier || !specifier.local) {
      throw new Error();
    }

    const name = specifier.local?.name ?? (() => {
      switch (specifier.type) {
        case 'ImportSpecifier': return specifier.imported.name;
        default: throw new Error();
      }
    })();

    if (name === directive.name) {
      const local = b.identifier(transformDirectiveName(name));
      specifier.name = local;
      specifier.local = local;
    }
  }
}
