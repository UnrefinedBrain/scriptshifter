<template>
  <div></div>
</template>

<script lang="ts" setup>
const emit = defineEmits({
  increment: (newVal: boolean) => true,
});

const increment = () => {
  emit('increment', 5);
};
</script>
