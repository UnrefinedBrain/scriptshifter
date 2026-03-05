<template>
  <div></div>
</template>

<script setup>
import { ref, computed } from 'vue';

const foo = ref(4);
const bar = useBar();
const five = 5;

const baz = 5;
const refLike = computed(() => foo.value);

// ⚠️ scriptshifter: Could not analyze which variables were created from spreading 'bar' in the setup() return statement
const FIX_ME_SPREAD_bar = bar;

const isFoo5 = computed(() => {
  return foo.value === 5;
});

const doesComputedTransform = computed(() => {
  return refLike.value === foo.value;
});
</script>
