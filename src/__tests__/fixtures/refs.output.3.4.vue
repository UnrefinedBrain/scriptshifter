<template>
  <button ref="button$"></button>
</template>

<script setup>
import { ref, onMounted } from 'vue';
const button$ = ref(null);

onMounted(() => {
  console.log(button$.value);
});

const click = () => {
  button$.value?.click();
};
</script>
