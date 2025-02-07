<template>
  <div></div>
</template>

<script>
import { mapStores } from 'pinia';
import { useCartStore } from '@/stores/cart';
import { useUserStore } from '@/stores/user';

export default {
  computed: {
    ...mapStores(useCartStore, useUserStore),
  },

  methods: {
    log() {
      console.log(this.cartStore.itemsInCart, this.userStore.username);
    }
  }
}
</script>
