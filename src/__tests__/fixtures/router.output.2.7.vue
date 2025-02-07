<template>
  <div></div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router/composables';
const $router = useRouter();
const $route = useRoute();

const a = () => {
  $router.push('/a')
  $route.name;
};

const b = () => {
  $router.push('/b')
  $route.name;
};
</script>
