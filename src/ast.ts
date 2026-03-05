import {
  namedTypes as n,
  type Kinds,
} from 'vue-metamorph';

type NodeBase = {
  /**
   * The name of the node.
   * Generally, if a node is reference like `this.foo`, the `name` would be `foo`
   */
  name: string;

  /**
   * The `name` of nodes that this node directly references
   */
  dependencies: string[];
};

type HasComments = {
  comments: Kinds.CommentKind[] | null | undefined;
};

/**
 * Intermediate node representing a function defined in the `methods` block
 */
export type MethodNode = NodeBase & HasComments & {
  type: 'method';

  /**
   * the expression defining the method. In most cases, this is an
   * ArrowFunctionExpression, but can also be a CallExpression
   */
  node: Kinds.ExpressionKind;
};

/**
 * Intermediate node representing a watcher defined in the `watch` block
 */
export type WatcherNode = NodeBase & HasComments & {
  type: 'watcher';

  /**
   * the watcher function, or the object containing the handler property
   */
  node: n.ArrowFunctionExpression | n.ObjectExpression;

  /**
   * whether the watcher has the `deep: true` option
   */
  isDeep: boolean;

  /**
   * whether the watcher has the `immediate: true` option
   */
  isImmediate: boolean;

  /**
   * the name of the property being watched
   */
  watchName: string;

  /**
   * The type of the property being watched
   * `'prop'` is a top-level prop like `'person'`.
   *
   * `'ref'` is a top-level ref like `'person'`.
   *
   * `'compoundProp'` is a deep property of a prop like `'person.firstName'`
   *
   * `'compoundRef'` is a deep property of a ref like `'person.firstName'`
   */
  sourceType: 'prop' | 'ref' | 'compoundProp' | 'compoundRef';
};

/**
 * Intermediate node type representing a value defined in the `computed` block
 */
export type ComputedNode = NodeBase & HasComments & {
  type: 'computed';

  /**
   * the function or the object containing get/set functions
   */
  node: n.ArrowFunctionExpression | n.ObjectExpression;
};

/**
 * Intermediate node representing a ref that is defined in the `data` block
 */
export type DataNode = NodeBase & HasComments & {
  type: 'data' | 'rawData';

  /**
   * the value of the data variable
   */
  node: Kinds.ExpressionKind;
};

/**
 * Intermediate node representing a component prop
 */
export type PropsNode = NodeBase & HasComments & {
  type: 'prop';

  /**
   * the property in the props block
   */
  node: n.Property;
};

/**
 * Intermediate node representing the `emits` option
 */
export type EmitsNode = NodeBase & HasComments & {
  type: 'emit';

  /**
   * the array of event names, or the object defining event names and parameter types
   */
  node: n.ArrayExpression | n.ObjectExpression;
};

/**
 * Intermediate node representing a vuex action created by mapActions inside of the `methods` block
 */
export type VuexActionNode = NodeBase & HasComments & {
  type: 'vuexAction';

  /**
   * The action's name in the Vuex module
   */
  actionName: string;

  /**
   * the vuex namespace the action belongs to
   */
  namespace: Kinds.ExpressionKind;
  node: null;
};

/**
 * Intermediate node representing a vuex getter created by mapGetters inside the `computed` block
 */
export type VuexGetterNode = NodeBase & HasComments & {
  type: 'vuexGetter';

  /**
   * The name of the getter in the vuex module
   */
  getterName: string;

  /**
   * the vuex namespace the getter belongs to
   */
  namespace: Kinds.ExpressionKind;
  node: null;
};

/**
 * Intermediate node representing a vuex mutation defined by `mapMutations` in the `methods` block
 */
export type VuexMutationNode = NodeBase & HasComments & {
  type: 'vuexMutation';

  /**
   * The name of the mutation in the vuex module
   */
  mutationName: string;

  /**
   * the vuex namespace the mutation belongs to
   */
  namespace: Kinds.ExpressionKind;

  node: null;
};

/**
 * Intermediate node representing an inline directive defined in the `directives` option
 */
export type DirectiveNode = NodeBase & HasComments & {
  type: 'directive';

  /**
   * The object containing the directive, or `null` if the object is defined as a variable outside
   * the options block, or is an import
   */
  node: n.ObjectExpression | null;
};

/**
 * Intermediate node representing a vuex state variable defined by `mapState` in the `computed` block
 */
export type VuexStateNode = NodeBase & HasComments & {
  type: 'vuexState';

  /**
   * The inline getter function, or the local name
   */
  node: n.ArrowFunctionExpression | n.Identifier | n.Literal;

  /**
   * The namespace the state belongs to
   */
  namespace: Kinds.ExpressionKind;
};

type LifecycleHookName =
  | 'onMounted'
  | 'onUpdated'
  | 'onUnmounted'
  | 'onBeforeMount'
  | 'onBeforeUpdate'
  | 'onBeforeUnmount';

/**
 * Intermediate node representing a component lifecycle hook, except the `created` hook, which
 * has special handling
 */
export type LifecycleHookNode = NodeBase & {
  type: 'lifecycle';

  /**
   * the composition hook name
   */
  name: LifecycleHookName;

  /**
   * the function defining the hook's body
   */
  node: n.ArrowFunctionExpression;
};

/**
 * Intermediate node representing the 'created' lifecycle hook
 *
 * This hook is treated differently than the others because it has no Composition API hook
 */
export type CreatedHookNode = NodeBase & {
  type: 'created';

  /**
   * The IIFE statement containing the created hook
   */
  node: n.ExpressionStatement;
};

/**
 * An intermediate node referencing a value whose type could not be analyzed.
 * This could be any value that was not defined by `data`, `computed`, or `methods`,
 * such as a property added by a mixin or a global mixin.
 */
export type UnknownNode = NodeBase & {
  type: 'unknown';
};

/**
 * Intermediate node representing a value in the `provide` block
 */
export type ProvideNode = NodeBase & {
  type: 'provide';

  /**
   * the name of the value being provided
   */
  key: n.Identifier | n.Literal;

  /**
   * whether the key is a variable (true) or a literal (false)
   */
  computed: boolean;

  /**
   * the value being provided
   */
  node: n.ExpressionStatement;
};

/**
 * Intermediate node representing a value in the `inject` block
 */
export type InjectNode = NodeBase & {
  type: 'inject';

  /**
   * the value being injected
   */
  injectionKey: n.Identifier | n.Literal;

  /**
   * the default value of the inject, if any
   */
  defaultValue: Kinds.ExpressionKind | null;
  node: null;
};

/**
 * Intermediate node representing properties defined on the Options block that
 * were not recognized as another node type.
 */
export type OptionsNode = NodeBase & {
  type: 'options';

  /**
   * The object containing the extra options
   */
  node: n.ObjectExpression;
};

/**
 * Intermediate node type representing a template ref (`this.$refs.foo`)
 */
export type RefsNode = NodeBase & {
  type: 'refs';
  node: null;
};

/**
 * Intermediate node defining a pinia store referenced in some way, via
 * mapStores, mapState, mapActions, mapGetters, or mapWritableState
 *
 * If the store is called `useFooStore`, the `name` will be `fooStore`
 */
export type PiniaStoreNode = NodeBase & {
  type: 'piniaStore';

  /**
   * The function name to call to obtain the store
   * @example `useFooStore`
   */
  storeFunctionName: string;
  node: null;
};

/**
 * Intermediate node representing a pinia action defined by `mapActions` on the `methods` block
 */
export type PiniaActionNode = NodeBase & {
  type: 'piniaAction';

  /**
   * The name of the action on the store
   */
  actionName: string;

  /**
   * The variable name of the store containing this action
   */
  storeName: string;
  node: null;
};

/**
 * Intermediate node representing a pinia state variable defined by `mapState` on the `computed` block
 */
export type PiniaStateNode = NodeBase & {
  type: 'piniaState';

  /**
   * The function defining the inline getter, or the state name on the store
   */
  node: n.ArrowFunctionExpression | n.Identifier | n.Literal;

  /**
   * The name of the variable that contains the store
   */
  storeName: string;
};

/**
 * Intermediate node representing a writable property on a pinia store, defined by mapWritableState
 * on the `computed` block
 */
export type PiniaWritableStateNode = NodeBase & {
  type: 'piniaWritableState';
  node: null;

  /**
   * The name of the state
   */
  stateName: string;

  /**
   * Name of the variable containing the store
   */
  storeName: string;
};

/**
 * Data structure containing analyzed options constructs
 */
export type ScriptSetupAst = {
  methods: MethodNode[];
  watchers: WatcherNode[];
  computed: ComputedNode[];
  data: DataNode[];
  lifecycleHooks: LifecycleHookNode[];
  props: PropsNode[] | null;
  emits: EmitsNode | null;
  createdHook: CreatedHookNode | null;
  directives: DirectiveNode[];
  provides: ProvideNode[];
  injects: InjectNode[];
  $options: OptionsNode | null;
  $refs: RefsNode[];
  vuexActions: VuexActionNode[];
  vuexGetters: VuexGetterNode[];
  vuexMutations: VuexMutationNode[];
  vuexState: VuexStateNode[];
  piniaStores: Record<string, PiniaStoreNode>;
  piniaActions: Record<string, PiniaActionNode>;
  piniaStates: Record<string, PiniaStateNode>;
  piniaWritableStates: PiniaWritableStateNode[];
  unknowns: UnknownNode[];
  setupVarNames: Record<string, 'ref' | 'raw'>;

  /**
   * statements that came before the options block, such as imports, top-level variables, etc.
   */
  beforeOptionsStatements: Kinds.StatementKind[];

  /**
   * statements to emit after `defineProps`
   */
  afterPropsStatements: Kinds.StatementKind[];

  /**
   * statements that were defined after the Options API object, to emit after all other statements,
   * but prior to the created hook
   */
  afterOptionsStatements: Kinds.StatementKind[];

  areThereDependenciesOn: {
    props: boolean;
  };

  wasEmitted: {
    cssModule: boolean;
    router: boolean;
    route: boolean;
    store: boolean;
    vuexStateAccessHelper: boolean;
    attrs: boolean;
    slots: boolean;
  };
};

export type ScriptSetupNode =
  | MethodNode
  | WatcherNode
  | ComputedNode
  | DataNode
  | PropsNode
  | EmitsNode
  | LifecycleHookNode
  | VuexActionNode
  | VuexGetterNode
  | VuexMutationNode
  | VuexStateNode
  | OptionsNode
  | RefsNode
  | ProvideNode
  | InjectNode
  | PiniaStoreNode
  | PiniaActionNode
  | PiniaStateNode
  | PiniaWritableStateNode
  | CreatedHookNode;
