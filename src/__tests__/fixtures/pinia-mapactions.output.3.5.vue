<template>
  <div></div>
</template>

<script setup>
import { useCartStore } from '@/stores/cart';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const cartStore = useCartStore();

const foo = () => {
  cartStore.checkout();
  userStore.logout();
};
</script>
