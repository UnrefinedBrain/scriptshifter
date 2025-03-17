<template>
  <div></div>
</template>

<script setup>
import { computed, getCurrentInstance } from 'vue';
const $store = getCurrentInstance().proxy.$store;
const myGetter = computed(() => $store.getters['MyModule/myGetter']);

/**
 * some comment
 */
const anotherGetter = computed(() => $store.getters['MyModule/anotherGetter']);
</script>

<script>
export default {
  name: 'GetterTest',
};
</script>
