<template>
  <div></div>
</template>

<script setup>
const emit = defineEmits([
  'click',
]);

const trigger = () => {
  emit('click');
};
</script>
