<template>
  <div></div>
</template>

<script lang="ts">
export default {
  name: 'Hello',
  props: {
    foo: String,
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
  },

  beforeCreate() {
    // does this work?
    console.log('foo');
  },

  mixins: [FooMixin],
}
</script>

<style>
.foo {
  color: #ff00ff;
}
</style>
