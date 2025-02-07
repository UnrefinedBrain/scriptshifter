<template>
  <div></div>
</template>

<script>
export default {
  data: () => ({
    a: 1,
    b: 2,
  }),
  methods: {
    foo: debounce(function() {
      this.a++;
    }, 400),


    bar() {
      this.b = 5;

      this.foo();
    },

    baz: /* a comment */ function() {
      this.foo();
    }
  }
}

</script>
