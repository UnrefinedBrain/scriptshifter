<template>
  <div></div>
</template>

<script setup>
const props = defineProps({
  foo: String,
});

const { foo } = toRefs(props);
</script>
