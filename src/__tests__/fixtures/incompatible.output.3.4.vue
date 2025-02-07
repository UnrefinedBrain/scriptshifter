<template>
  <div></div>
</template>

<script lang="ts" setup>
const props = defineProps({
  foo: String,

  bar: {
    // this comment should be preserved
    type: Number as PropType<0 | 5>,
    default: 0
  },
});

const logFoo = () => {
  console.log(props.foo);
};
</script>

<script lang="ts">
export default {
  name: 'Hello',

  beforeCreate() {
    // does this work?
    console.log('foo');
  },

  mixins: [FooMixin],
};
</script>

<style>
.foo {
  color: #ff00ff;
}
</style>
