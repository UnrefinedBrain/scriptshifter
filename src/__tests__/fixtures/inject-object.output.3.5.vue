<template>
  <div></div>
</template>

<script setup>
import { inject } from 'vue';
const foo = inject('bar', 5);
const baz = inject(qux);
const qaz = inject('qaz', 19);
</script>
