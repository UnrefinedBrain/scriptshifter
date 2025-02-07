<template>
  <div>
    <slot name="button" v-if="!shouldShowButton" />
    <button v-else>Hello</button>
  </div>
</template>

<script setup>
import { useSlots, computed } from 'vue';
const $slots = useSlots();

const shouldShowButton = computed(() => {
  return !!$slots.button;
});
</script>
