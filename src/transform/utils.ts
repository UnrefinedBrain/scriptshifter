import {
  namedTypes as n,
  builders as b,
} from 'vue-metamorph';
import type {
  ScriptSetupAst,
  ScriptSetupNode,
} from '../ast';

export type NodeTypeMap = Record<string, ScriptSetupNode['type']>;

function findExistingImport(ast: ScriptSetupAst, moduleName: string) {
  const index = ast.beforeOptionsStatements
    .findIndex((statement): statement is n.ImportDeclaration => n.ImportDeclaration.check(statement)
    && statement.source.type === 'Literal'
    && typeof statement.source.value === 'string'
    && statement.source.value === moduleName);

  return [
    index,
    index >= 0
      ? ast.beforeOptionsStatements[index] as n.ImportDeclaration
      : undefined,
  ] as const;
}

export function removeNamedImport(ast: ScriptSetupAst, moduleName: string, importName: string) {
  const [idx, existingImport] = findExistingImport(ast, moduleName);
  if (existingImport) {
    existingImport.specifiers = existingImport.specifiers?.filter((spec) => spec.type === 'ImportSpecifier' && spec.imported.name !== importName);

    // if that was the only import, remove the entire import declaration
    if (!existingImport.specifiers?.length) {
      ast.beforeOptionsStatements.splice(idx, 1);
    }
  }
}

export function insertNamedImport(ast: ScriptSetupAst, moduleName: string, importName: string) {
  const [, existingImport] = findExistingImport(ast, moduleName);

  const specifier = b.importSpecifier(b.identifier(importName));

  if (existingImport) {
    existingImport.specifiers ??= [];
    if (!existingImport.specifiers?.some((spec) => spec.type === 'ImportSpecifier' && spec.imported.name === importName)) {
      existingImport.specifiers.push(specifier);
    }
  } else {
    ast.beforeOptionsStatements.unshift(
      b.importDeclaration(
        [specifier],
        b.literal(moduleName),
        'value',
      ),
    );
  }
}

/**
 * creates a map of name to node type for quick lookup
 */
export function createNodeTypeLookup(ast: ScriptSetupAst) {
  return [
    ...ast.computed,
    ...ast.data,
    ...ast.emits ? [ast.emits] : [],
    ...ast.methods,
    ...ast.props ?? [],
    ...ast.watchers,
    ...ast.vuexActions,
    ...ast.vuexGetters,
    ...ast.vuexMutations,
    ...ast.vuexState,
    ...ast.$refs,
    ...ast.provides,
    ...ast.injects,
    ...Object.values(ast.piniaStores),
    ...Object.values(ast.piniaActions),
    ...Object.values(ast.piniaStates),
    ...ast.piniaWritableStates,
  ].reduce((prev, cur) => {
    prev[cur.name] = cur.type;
    return prev;
  }, {} as NodeTypeMap);
}
