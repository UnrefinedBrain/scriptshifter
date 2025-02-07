<template>
  <div>
    <button @click="emit('plusOne');">+1</button>
  </div>
</template>

<script setup>
const emit = defineEmits(['foo', 'plusOne']);

const click = () => {
  emit('foo');
};
</script>
