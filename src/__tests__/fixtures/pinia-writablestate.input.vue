<template>
  <div></div>
</template>

<script>
import { useCartStore } from '@/stores/cart';
import { useUserStore } from '@/stores/user';
import { mapWritableState } from 'pinia';

export default {
  computed: {
    ...mapWritableState(useCartStore, ['clicks']),
    ...mapWritableState(useUserStore, {
      isAdmin: 'admin'
    })
  },

  methods: {
    onClick() {
      this.clicks++;
    },
    makeUserAdmin() {
      this.isAdmin = true;
    }
  }
}

</script>
