<template>
  <div></div>
</template>

<script setup>
import { ref, computed } from 'vue';

const foo = ref(4);
const bar = useBar();

// ⚠️ scriptshifter: Could not analyze which variables were created from spreading 'bar' in the setup() return statement
const FIX_ME_SPREAD_bar = bar;

const isFoo5 = computed(() => {
  return foo === 5;
});
</script>
