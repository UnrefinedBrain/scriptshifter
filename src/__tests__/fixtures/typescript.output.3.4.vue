<template>
  <div></div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
const foo = ref(5);

const bar = computed(() => {
  return foo.value + 5;
});

const log = () => {
  console.log(bar.value);
};
</script>
