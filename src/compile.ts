import {
  builders,
  type CodemodPlugin,
  namedTypes as n,
} from 'vue-metamorph';
import { analyze } from './analyze';
import { transform } from './transform';
import { render } from './codegen';
import { analyzeIncompatibleOptions } from './analyze/incompatible';
import { VueVersion } from './options';

export const scriptshifter: CodemodPlugin = {
  type: 'codemod',
  name: 'scriptshifter',
  transform({
    scriptASTs,
    sfcAST,
    utils: { astHelpers },
    opts,
    filename,
  }) {
    if (!filename.endsWith('.vue') || !sfcAST || !scriptASTs[0]) {
      return 0;
    }

    const vueVersion = opts.vue as VueVersion;

    let transformCount = 0;
    let incompatibleOptions: n.Program | null = null;

    if (scriptASTs.some((ast) => ast.isScriptSetup)) {
      // if this is already a <script setup> component, do nothing
      return 0;
    }

    const scriptAST = scriptASTs[0];
    const scriptTag = astHelpers.findFirst(sfcAST, {
      type: 'VElement',
      name: 'script',
    })!;

    const isTypescript = scriptTag
      ?.startTag
      .attributes
      .some((attr) => !attr.directive
        && attr.key.name === 'lang'
        && attr.value?.value.startsWith('ts'));

    // find options that cannot be compositionized like 'name', 'beforeCreate', 'mixins', 'beforeRouteEnter', etc
    incompatibleOptions = analyzeIncompatibleOptions(astHelpers.findVueComponentOptions(scriptAST, true)[0]!);

    const scriptSetupAst = analyze(scriptAST, sfcAST);
    transform(scriptSetupAst, vueVersion, isTypescript, sfcAST);
    scriptAST.body = render(scriptSetupAst, vueVersion, isTypescript);

    transformCount++;

    if (scriptTag) {
      if (incompatibleOptions) {
        const index = sfcAST.children.indexOf(scriptTag);

        sfcAST?.children.splice(
          index + 1,
          0,
          builders.vText('\n\n'),
          builders.vElement(
            'script',
            builders.vStartTag(
              structuredClone(scriptTag.startTag.attributes),
              false,
            ),
            [],
          ),
        );

        scriptASTs.push({
          ...incompatibleOptions,
          isScriptSetup: false,
        });
      }

      scriptTag.startTag.attributes.push(
        builders.vAttribute(
          builders.vIdentifier('setup'),
          null,
        ),
      );
    }

    return transformCount;
  },
};
