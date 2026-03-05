<template>
  <div></div>
</template>

<script>
import { ref } from 'vue';

export default {
  computed: {
    isFoo5() {
      return this.foo === 5;
    }
  },

  setup() {
    const foo = ref(4);
    const bar = useBar();
    const five = 5;

    return {
      foo,
      baz: 5,
      five,
      ...bar
    }
  }
}
</script>
