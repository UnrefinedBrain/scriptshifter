<template>
  <button ref="button$"></button>
</template>

<script setup>
import { useTemplateRef, onMounted } from 'vue';
const button$ = useTemplateRef('button$');

onMounted(() => {
  console.log(button$.value);
});

const click = () => {
  button$.value?.click();
};
</script>
