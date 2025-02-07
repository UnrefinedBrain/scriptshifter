<template>
  <div>
  </div>
</template>

<script lang="ts">
const baz = 5;

export default {
  props: {
    prop1: String,
  },

  data() {
    return {
      /**
       * hello
       */
      foo: 0,
      bar: 1,
      baz,
      quz: this.prop1,
      qux: config({
        show: this.prop1,
      })
    }
  },

  methods: {
    logFoo() {
      console.log(this.foo);
    },

    mutateBar(): number {
      this.bar++;

      console.log(this['bar']);

      return this.bar + this.baz;
    }
  },
};
</script>
