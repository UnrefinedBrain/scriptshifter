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

    return {
      foo,
      ...bar
    }
  }
}
</script>
