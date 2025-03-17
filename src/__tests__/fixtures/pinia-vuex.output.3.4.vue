<template>
  <div></div>
</template>

<script setup>
import { useStore } from 'vuex';
import { useCartStore } from '@/stores/cart';

const $store = useStore();
const vuexAction = (payload) => $store.dispatch('User/vuexAction', payload);
const cartStore = useCartStore();

const log = () => {
  cartStore.piniaAction();
  vuexAction('bar');
};
</script>
