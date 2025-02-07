<template>
  <div></div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';

const foo = computed(() => {
  return 5;
});

const button$ = ref<HTMLElement | null>(null);

const log = () => {
  console.log(button$.value);

  console.log(foo.value);

  if (true) {
    button$.value.click();
  }
};
</script>
