<template>
  <div></div>
</template>

<script setup>
import { useCartStore } from '@/stores/cart';
import { useUserStore } from '@/stores/user';
import { mapWritableState } from 'pinia';

const cartStore = useCartStore();

const onClick = () => {
  cartStore.clicks++;
};

const userStore = useUserStore();

const makeUserAdmin = () => {
  userStore.admin = true;
};
</script>
