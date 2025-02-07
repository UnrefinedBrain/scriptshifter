<template>
  <div></div>
</template>

<script>
export default {
  computed: {
    classes() {
      return [
        this.$style.foo,
        this.$style.bar,
      ]
    }
  }
}
</script>
