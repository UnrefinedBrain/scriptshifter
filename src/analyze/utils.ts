import {
  builders as b,
  Kinds,
  namedTypes as n,
} from 'vue-metamorph';

export function normalizeLifecycleHookName(name: string) {
  // created hook is not handled here
  const map = {
    destroyed: 'onUnmounted',
    unmounted: 'onUnmounted',
    beforeDestroy: 'onBeforeUnmount',
    beforeUnmount: 'onBeforeUnmount',
    mounted: 'onMounted',
    beforeMount: 'onBeforeMount',
    beforeUpdate: 'onBeforeUpdate',
    updated: 'onUpdated',
  } as const;

  if (!(name in map)) {
    return null;
  }

  return map[name as keyof typeof map];
}

export function isStringKey(p: n.Property['key']): p is n.Identifier | (n.Literal & { value: string; }) {
  return (p.type === 'Identifier')
    || (p.type === 'Literal' && typeof p.value === 'string');
}

export function getStringKey(p: n.Property['key']) {
  if (!isStringKey(p)) {
    throw new Error('not a string key');
  }

  return p.type === 'Identifier'
    ? p.name
    : p.value;
}

export function toArrowFunctionExpression(fn: n.FunctionExpression | n.ArrowFunctionExpression) {
  if (fn.type === 'ArrowFunctionExpression') {
    return fn;
  }

  const expr = b.arrowFunctionExpression(
    fn.params,
    fn.body,
    fn.expression,
  );

  expr.async = fn.async;
  expr.returnType = fn.returnType;
  expr.typeParameters = fn.typeParameters;
  expr.comments = fn.comments;

  return expr;
}

export const CompoundWatcherRegex = /^\w+\.\w+/;

export function isPattern(v: n.Property['value']) {
  return v.type === 'TSTypeAssertion'
    || v.type === 'RestElement'
    || v.type === 'SpreadElementPattern'
    || v.type === 'PropertyPattern'
    || v.type === 'ObjectPattern'
    || v.type === 'ArrayPattern'
    || v.type === 'AssignmentPattern'
    || v.type === 'SpreadPropertyPattern'
    || v.type === 'TSParameterProperty';
}

export function isThisDotRefs(node: Kinds.ExpressionKind) {
  let nn = node;

  if (nn.type === 'TSAsExpression') {
    nn = nn.expression;
  }

  if (nn.type === 'MemberExpression'
    && nn.object.type === 'ThisExpression'
    && nn.property.type === 'Identifier'
    && nn.property.name === '$refs'
  ) {
    return true;
  }

  return false;
}
