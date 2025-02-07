<template>
  <div>
    <button @click="$emit('plusOne')">+1</button>
  </div>
</template>

<script>
export default {
  methods: {
    click() {
      this.$emit('foo');
    }
  }
}
</script>
