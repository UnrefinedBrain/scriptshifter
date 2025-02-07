<template>
  <div></div>
</template>

<script lang="ts">
export default {
  props: {
    foo: String,
    /**
     * The bar prop
     */
    bar: {
      // this comment should be preserved
      type: Number as PropType<0 | 5>,
      default: 0
    }
  },

  methods: {
    logFoo() {
      console.log(this.foo);
    }
  }
}
</script>
