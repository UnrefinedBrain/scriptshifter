<template>
  <div></div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  data: Object,
});

const user = ref({
  firstName: 'John',
  middleName: 'Jacob',
  lastName: 'Jingleheimerschmidt',
});

/**
 * log the user if it changes
 */
watch(user, () => {
  console.log('user');
});

watch(() => props.data, () => {
  console.log('data');
});

watch(() => props.data.bar, () => {
  console.log('data.bar');
}, {
  deep: true,
});

watch(() => props.data.foo, () => {
  console.log('data.foo');
});

watch(() => user.value.middleName, () => {
  console.log('user.middleName');
});

watch(() => user.value.address, () => {
  console.log('address changed');
});

watch(() => user.value.lastName, () => {
  console.log('user.lastName');
}, {
  immediate: true,
});
</script>
