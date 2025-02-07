<template>
  <div></div>
</template>

<script setup>
import { ref } from 'vue';
const a = ref(1);
const b = ref(2);

const foo = debounce(function() {
  a.value++;
}, 400);

const bar = () => {
  b.value = 5;

  foo();
};

const baz = /* a comment */ () => {
  foo();
};
</script>
