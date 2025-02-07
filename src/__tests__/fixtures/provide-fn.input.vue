<template>
  <div></div>
</template>

<script>
export default {
  props: {
    foo: String,
  },

  provide() {
    return {
      bar: this.foo
    }
  }
}
</script>
