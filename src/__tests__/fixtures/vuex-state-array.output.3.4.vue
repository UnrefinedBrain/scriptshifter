<template>
  <div></div>
</template>

<script setup>
import { computed } from 'vue';

import { useStore } from 'vuex';

const store = useStore();

/**
 * accesses a vuex state 
 */
const getVuexState = (obj, namespace, path = namespace.split('/')) => {
  if (path.length === 1) {
    return obj[path[0]];
  }

  return getVuexState(obj[path.splice(0, 1)[0]], namespace, path);
};

const item = computed(() => getVuexState(store.state, 'Foo/Bar')['item']);

const foo = computed(() => {
  return item.value * 5;
});
</script>
