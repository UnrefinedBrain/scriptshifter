<template>
  <div></div>
</template>

<script lang="ts">
export default {
  emits: {
    increment: (newVal: boolean) => true,
  },

  methods: {
    increment() {
      this.$emit('increment', 5);
    }
  }
}
</script>
