<template>
  <div></div>
</template>

<script setup>
import { getCurrentInstance } from 'vue';
import { useCartStore } from '@/stores/cart';

const $store = getCurrentInstance().proxy.$store;
const vuexAction = (payload) => $store.dispatch('User/vuexAction', payload);
const cartStore = useCartStore();

const log = () => {
  cartStore.piniaAction();
  vuexAction('bar');
};
</script>
