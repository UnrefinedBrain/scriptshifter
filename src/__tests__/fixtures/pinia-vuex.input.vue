<template>
  <div></div>
</template>

<script>
import { mapActions as abcd } from 'vuex';
import { mapActions as efgh } from 'pinia';
import { useCartStore } from '@/stores/cart';

export default {
  methods: {
    log() {
      this.foo();
      this.vuexAction('bar');
    },

    ...efgh(useCartStore, {
      foo: 'piniaAction',
    }),
    ...abcd('User', ['vuexAction'])
  }
}

</script>
