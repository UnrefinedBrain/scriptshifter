<template>
  <div></div>
</template>

<script>
export default {
  methods: {
    trigger() {
      this.$store.dispatch('foo', 5);
    }
  }
}
</script>
