<template>
  <div></div>
</template>

<script>
import { mapState } from 'pinia';
import { useUserStore } from '@/stores/user';
import { useCartStore } from '@/stores/cart';

export default {
  computed: {
    ...mapState(useUserStore, ['isLoggedIn']),

    ...mapState(useCartStore, {
      selectedItemCount: (state) => state.items.filter(item => item.selected).length,
      myItems: 'items',

      foo(state) {
        if (this.isLoggedIn) {
          return this.myItems;
        }

        return [];
      }
    })
  },

  methods: {
    log() {
      console.log('is logged in', this.isLoggedIn);
      console.log('selected items: ', this.selectedItemCount);
      console.log('items: ', this.myItems);
    }
  }
}
</script>
