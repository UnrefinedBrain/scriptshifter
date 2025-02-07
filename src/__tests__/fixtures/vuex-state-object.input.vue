<template>
  <div></div>
</template>

<script lang="ts">
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState('Foo/Bar', {
      foo: 'item',
      upperFoo: (state) => state.item.toUpperCase(),
      snakeFoo: (state) => {
        return state.item.toSnakeCase();
      },
      kebabFoo(state) {
        return state.item.toKebabCase();
      },
    }),


    bar() {
      return this.foo * this.upperFoo;
    }
  }
}
</script>
