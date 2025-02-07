<template>
  <div>
    <slot name="button" v-if="!shouldShowButton" />
    <button v-else>Hello</button>
  </div>
</template>

<script>
export default {
  computed: {
    shouldShowButton() {
      return !!this.$slots.button;
    }
  }
}
</script>
