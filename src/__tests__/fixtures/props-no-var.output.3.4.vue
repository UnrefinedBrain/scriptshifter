<template>
  <div>{{ foo }}</div>
</template>

<script setup>
defineProps({
  foo: String,
});

const foo = bar.props;
</script>
