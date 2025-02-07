<template>
  <div></div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';

const props = defineProps({
  scalar: 10,
});

const num = ref(4);

/**
 * Numbers multiplied together
 */
const multiplied = computed((): number => {
  return num.value * props.scalar;
});

const settableMultiplied = computed({
  get() {
    return multiplied.value;
  },

  set(val) {
    num.value = val / props.scalar;
  }
});
</script>
