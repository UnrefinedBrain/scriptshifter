<template>
  <div></div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState('Foo/Bar', [
      'item',
    ]),

    foo() {
      return this.item * 5;
    }
  }
}

</script>
