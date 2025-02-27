import { builders as b } from 'vue-metamorph';
import type { RefsNode } from '../ast';
import { VueVersion } from '../options';
import { isVersionLtEq } from '../version';

export function renderRefsNode(node: RefsNode, vueVersion: VueVersion, isTypescript: boolean) {
  // vue 2.7 / 3.4: const refName = ref(null);
  // vue 3.5:       const refName = useTemplateRef('refName');

  const refCall = b.callExpression(
    b.identifier('ref'),
    [b.literal(null)],
  );

  if (isTypescript) {
    refCall.typeParameters = b.tsTypeParameterInstantiation([
      b.tsUnionType([
        b.tsTypeReference(b.identifier('HTMLElement')),
        b.tsNullKeyword(),
      ]),

    ]);
  }

  return b.variableDeclaration(
    'const',
    [
      b.variableDeclarator(
        b.identifier(node.name),
        isVersionLtEq(vueVersion, '3.4')
          ? refCall
          : b.callExpression(
            b.identifier('useTemplateRef'),
            [b.literal(node.name)],
          ),
      ),
    ],
  );
}
