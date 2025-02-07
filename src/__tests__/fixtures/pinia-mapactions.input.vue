<template>
  <div></div>
</template>

<script>
import { mapActions } from 'pinia';
import { useCartStore } from '@/stores/cart';
import { useUserStore } from '@/stores/user';

export default {
  methods: {
    ...mapActions(useCartStore, [
      'checkout'
    ]),

    ...mapActions(useUserStore, {
      localLogout: 'logout',
    }),

    foo() {
      this.checkout();
      this.localLogout();
    }
  }
}
</script>
