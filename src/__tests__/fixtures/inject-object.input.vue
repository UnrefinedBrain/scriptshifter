<template>
  <div></div>
</template>

<script>
export default {
  inject: {
    foo: {
      default: 5,
      from: 'bar'
    },

    baz: qux,

    qaz: {
      default: 19
    }
  }
}

</script>
