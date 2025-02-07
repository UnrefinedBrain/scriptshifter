<template>
  <div></div>
</template>

<script setup>
import { useUserStore } from '@/stores/user';
import { useCartStore } from '@/stores/cart';

const cartStore = useCartStore();
const selectedItemCount = computed(() => cartStore.items.filter(item => item.selected).length);
const userStore = useUserStore();

const log = () => {
  console.log('is logged in', userStore.isLoggedIn);
  console.log('selected items: ', selectedItemCount.value);
  console.log('items: ', cartStore.items);
};

const foo = computed(() => {
  if (userStore.isLoggedIn) {
    return cartStore.items;
  }

  return [];
});
</script>
