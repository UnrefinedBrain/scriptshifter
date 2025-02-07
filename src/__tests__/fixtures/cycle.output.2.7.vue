<template>
  <div></div>
</template>

<script setup>
import { ref } from 'vue';
const flag = ref(false);

const d = () => {
  c();
};

const c = () => {
  if (flag) {
    a();
  } else {
    d();
  }
};

const b = () => {
  c();
};

const a = () => {
  b();
};
</script>
