<template>
  <div></div>
</template>

<script setup>
import { inject } from 'vue';
const $foo = inject('$foo');
const $bar = inject('$bar');

const logFoo = () => {
  console.log($foo);
};
</script>
