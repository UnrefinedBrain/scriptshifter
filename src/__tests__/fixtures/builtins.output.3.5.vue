<template>
  <div></div>
</template>

<script setup>
import { nextTick, set, del, ref } from 'vue';
const obj = ref({});

const useTheBuiltins = async () => {
  await nextTick();
  set(obj.value, 'foo', 0);
  del(obj.value, 'foo');
};
</script>
