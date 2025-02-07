<template>
  <div></div>
</template>

<script setup>
import { useAttrs } from 'vue';
const $attrs = useAttrs();

const logFoo = () => {
  console.log($attrs.foo);
};

const logBar = () => {
  const { bar } = $attrs;
  console.log(bar);
};
</script>
