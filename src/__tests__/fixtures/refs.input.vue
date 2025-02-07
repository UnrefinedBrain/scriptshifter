<template>
  <button ref="button"></button>
</template>

<script>
export default {
  mounted() {
    console.log(this.$refs.button);
  },

  methods: {
    click() {
      this.$refs.button?.click();
    }
  }
}
</script>
