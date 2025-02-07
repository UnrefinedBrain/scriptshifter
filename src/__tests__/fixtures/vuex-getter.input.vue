<template>
  <div></div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'GetterTest',
  computed: {
    ...mapGetters('MyModule', [
      'myGetter',

      /**
       * some comment
       */
      'anotherGetter',
    ])
  }
}
</script>
