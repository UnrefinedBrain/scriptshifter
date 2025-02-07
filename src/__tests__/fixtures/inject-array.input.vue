<template>
  <div></div>
</template>

<script>
export default {
  inject: ['$foo', '$bar'],

  methods: {
    logFoo() {
      console.log(this.$foo);
    }
  }
}
</script>
