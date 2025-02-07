<template>
  <div></div>
</template>

<script>
export default {
  methods: {
    trigger() {
      this.$emit('click');
    }
  },

  emits: [
    'click',
  ],
};
</script>
