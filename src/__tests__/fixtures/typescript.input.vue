<template>
  <div></div>
</template>

<script lang="ts">
export default {
  data: () => ({
    foo: 5
  }),
  computed: {
    bar() {
      return this.foo + 5;
    }
  },
  methods: {
    log() {
      console.log((this as any).bar);
    }
  }
}
</script>
