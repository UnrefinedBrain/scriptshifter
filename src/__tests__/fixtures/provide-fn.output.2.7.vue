<template>
  <div></div>
</template>

<script setup>
import { provide } from 'vue';

const props = defineProps({
  foo: String,
});

provide('bar', props.foo);
</script>
