<template>
  <div></div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import { useStore } from 'vuex';

const store = useStore();

/**
 * accesses a vuex state 
 */
const getVuexState = (obj: Record<string, any>, namespace: string, path = namespace.split('/')) => {
  if (path.length === 1) {
    return obj[path[0]!];
  }

  return getVuexState(obj[path.splice(0, 1)[0]!], namespace, path);
};

const upperFoo = computed(() => {
  const state = getVuexState(store.state, 'Foo/Bar');
  return state.item.toUpperCase();
});

const foo = computed(() => getVuexState(store.state, 'Foo/Bar')['item']);

const bar = computed(() => {
  return foo.value * upperFoo.value;
});

const snakeFoo = computed(() => {
  const state = getVuexState(store.state, 'Foo/Bar');
  return state.item.toSnakeCase();
});

const kebabFoo = computed(() => {
  const state = getVuexState(store.state, 'Foo/Bar');
  return state.item.toKebabCase();
});
</script>
