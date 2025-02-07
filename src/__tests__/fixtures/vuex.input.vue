<template>
  <div></div>
</template>

<script lang="ts">
import { mapGetters, mapActions as abcd, mapMutations } from 'vuex';

const SomeModuleName = 'SomeModuleName';

export default {
  computed: {
    ...mapGetters('MyModule', ['getterA']),
    ...mapGetters(SomeModuleName, {
      localNameB: 'getterB'
    }),

    derivedFromGetters() {
      return this.getterA + this.localNameB;
    },
  },

  methods: {
    ...abcd(SomeModuleName, [
      /**
       * An action that does A
       */
      'actionA'
    ]),


    ...abcd('MyModule', {
      localAction: 'actionB',
    }),

    ...mapMutations('OtherModule', [
      // this is a mutation
      'mutation1'
    ]),

    ...mapMutations(SomeModuleName, [
      'mutation2'
    ]),

    ...mapMutations('MyModule', {
      local: 'mutation3',
    })
  }
}
</script>
