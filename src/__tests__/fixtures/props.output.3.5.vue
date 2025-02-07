<template>
  <div></div>
</template>

<script lang="ts" setup>
const props = defineProps({
  foo: String,

  /**
   * The bar prop
   */
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
