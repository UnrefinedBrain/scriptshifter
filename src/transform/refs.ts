import { AST, astHelpers } from 'vue-metamorph';
import { ScriptSetupAst } from '../ast';
import { refName } from '../analyze/refs';

export function transformRefs(
  ast: ScriptSetupAst,
  sfcAst: AST.VDocumentFragment,
) {
  const $refs = astHelpers.findAll(sfcAst, {
    type: 'VAttribute',
    directive: false,
    key: {
      type: 'VIdentifier',
      name: 'ref',
    },
    value: {
      type: 'VLiteral',
    },
  });

  for (const ref of $refs) {
    const name = refName((ref.value as AST.VLiteral).value);
    if (ast.$refs.some((node) => node.name === name)) {
      (ref.value as AST.VLiteral).value = name;
    }
  }
}
