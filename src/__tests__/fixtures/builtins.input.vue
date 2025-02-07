<template>
  <div></div>
</template>

<script>
export default {
  data: () => ({
    obj: {},
  }),
  methods: {
    async useTheBuiltins() {
      await this.$nextTick();
      this.$set(this.obj, 'foo', 0);
      this.$delete(this.obj, 'foo');
    }
  }
};
</script>
