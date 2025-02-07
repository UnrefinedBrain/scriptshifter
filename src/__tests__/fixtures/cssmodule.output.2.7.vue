<template>
  <div></div>
</template>

<script setup>
import { useCssModule, computed } from 'vue';
const $style = useCssModule();

const classes = computed(() => {
  return [
    $style.foo,
    $style.bar,
  ];
});
</script>
