<template>
  <div></div>
</template>

<script setup>
import { computed } from 'vue';

import { useStore } from 'vuex';

const store = useStore();
const myGetter = computed(() => store.getters['MyModule/myGetter']);

/**
 * some comment
 */
const anotherGetter = computed(() => store.getters['MyModule/anotherGetter']);
</script>

<script>
export default {
  name: 'GetterTest',
};
</script>
