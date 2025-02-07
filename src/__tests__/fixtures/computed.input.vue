<template>
  <div></div>
</template>

<script lang="ts">
export default {
  props: {
    scalar: 10,
  },

  data: () => ({
    num: 4
  }),

  computed: {
    /**
     * Numbers multiplied together
     */
    multiplied(): number {
      return this.num * this.scalar;
    },

    settableMultiplied: {
      get() {
        return this.multiplied;
      },

      set(val) {
        this.num = val / this.scalar;
      }
    }
  }
};
</script>
