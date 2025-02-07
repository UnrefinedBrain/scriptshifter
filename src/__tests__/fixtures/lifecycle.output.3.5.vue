<template>
  <div></div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, onUnmounted, onBeforeUpdate, onUpdated } from 'vue';

onMounted(() => {
  console.log('mounted');
});

onBeforeUnmount(() => {
  console.log('beforeDestroy');
});

onUnmounted(() => {
  console.log('destroyed');
});

onBeforeUpdate(() => {
  console.log('beforeUpdate');
});

onUpdated(() => {
  console.log('updated');
});

(() => {
  console.log('created');
})();
</script>
