<template>
  <div></div>
</template>

<script setup>
import { getCurrentInstance } from 'vue';
const $store = getCurrentInstance().proxy.$store;

const trigger = () => {
  $store.dispatch('foo', 5);
};
</script>
