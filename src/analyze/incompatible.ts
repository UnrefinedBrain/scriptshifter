import {
  namedTypes as n,
  builders as b,
} from 'vue-metamorph';
import {
  getStringKey,
  isStringKey,
} from './utils';

export function analyzeIncompatibleOptions(optionsBlock: n.ObjectExpression): n.Program | null {
  const program = b.program([]);
  const properties: n.Property[] = [];

  for (const option of optionsBlock.properties) {
    if (option.type !== 'Property'
      || !isStringKey(option.key)
    ) {
      continue;
    }

    if ([
      'mixins',
      'beforeCreate',
      'beforeRouteEnter',
      'name',
    ].includes(getStringKey(option.key))) {
      properties.push(option);
    }
  }

  if (properties.length > 0) {
    program.body.push(
      b.exportDefaultDeclaration(
        b.objectExpression(properties),
      ),
    );
  }

  return program.body.length > 0
    ? program
    : null;
}
