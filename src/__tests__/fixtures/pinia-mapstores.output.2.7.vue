<template>
  <div></div>
</template>

<script setup>
import { useCartStore } from '@/stores/cart';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const cartStore = useCartStore();

const log = () => {
  console.log(cartStore.itemsInCart, userStore.username);
};
</script>
