<template>
  <div></div>
</template>

<script>
export default {
  methods: {
    logFoo() {
      console.log(this.$attrs.foo);
    },
    logBar() {
      const { bar } = this.$attrs;
      console.log(bar);
    }
  }
}
</script>
