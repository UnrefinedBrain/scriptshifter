<template>
  <div></div>
</template>

<script setup>
import { useStore } from 'vuex';
const store = useStore();

const trigger = () => {
  store.dispatch('foo', 5);
};
</script>
