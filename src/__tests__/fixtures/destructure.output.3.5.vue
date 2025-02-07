<template>
  <div></div>
</template>

<script lang="ts" setup>
import { useTemplateRef, computed } from 'vue';

const foo = computed(() => {
  return 5;
});

const button$ = useTemplateRef('button$');

const log = () => {
  console.log(button$.value);

  console.log(foo.value);

  if (true) {
    button$.value.click();
  }
};
</script>
