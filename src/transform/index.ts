import { AST } from 'vue-metamorph';
import { ScriptSetupAst } from '../ast';
import { VueVersion } from '../options';
import { transformDirectives } from './directives';
import { transformProvideInject } from './provide-inject';
import { transformThisExpressions } from './this';
import {
  createNodeTypeLookup,
  insertNamedImport,
  removeNamedImport,
} from './utils';
import {
  addStore,
  mapStateAccessHelper,
} from './vuex';
import { transformRefs } from './refs';

export function transform(
  ast: ScriptSetupAst,
  vueVersion: VueVersion,
  isTypescript: boolean,
  sfcAST: AST.VDocumentFragment,
) {
  const nodeTypeMap = createNodeTypeLookup(ast);

  transformThisExpressions(ast, nodeTypeMap, vueVersion, isTypescript);
  transformProvideInject(ast);
  transformDirectives(ast);
  transformRefs(ast, sfcAST);

  if (
    ast.data.filter((x) => x.type === 'data').length
    || (ast.$refs.length && ['2.7', '3.4'].includes(vueVersion))) {
    insertNamedImport(ast, 'vue', 'ref');
  }

  if (ast.$refs.length && vueVersion === '3.5') {
    insertNamedImport(ast, 'vue', 'useTemplateRef');
  }

  if (ast.computed.length || ast.vuexGetters.length || ast.vuexState.length) {
    insertNamedImport(ast, 'vue', 'computed');
  }

  if (ast.watchers.length) {
    insertNamedImport(ast, 'vue', 'watch');
  }

  if (
    (ast.vuexActions.length || ast.vuexGetters.length || ast.vuexMutations.length || ast.vuexState.length)
    && !ast.wasEmitted.store
  ) {
    addStore(ast, vueVersion, isTypescript);
  }

  if (ast.vuexState.length) {
    ast.beforeOptionsStatements.push(
      mapStateAccessHelper(isTypescript),
    );
  }

  for (const hook of ast.lifecycleHooks) {
    insertNamedImport(ast, 'vue', hook.name);
  }

  if (ast.vuexActions.length) {
    removeNamedImport(ast, 'vuex', 'mapActions');
  }

  if (ast.vuexGetters.length) {
    removeNamedImport(ast, 'vuex', 'mapGetters');
  }

  if (ast.vuexMutations.length) {
    removeNamedImport(ast, 'vuex', 'mapMutations');
  }

  if (ast.vuexState.length) {
    removeNamedImport(ast, 'vuex', 'mapState');
  }

  if (Object.values(ast.piniaStores).length) {
    removeNamedImport(ast, 'pinia', 'mapStores');
  }

  if (Object.values(ast.piniaActions).length) {
    removeNamedImport(ast, 'pinia', 'mapActions');
  }

  if (Object.values(ast.piniaStates).length) {
    removeNamedImport(ast, 'pinia', 'mapState');
    removeNamedImport(ast, 'pinia', 'mapGetters');
  }
}
