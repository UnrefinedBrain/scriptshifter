<template>
  <div></div>
</template>

<script setup>
import { provide } from 'vue';

const computedKey = Symbol();

provide('foo', 5);
provide('bar', 6);
provide(computedKey, 7);
</script>
