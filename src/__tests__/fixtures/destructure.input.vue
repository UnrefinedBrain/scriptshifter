<template>
  <div></div>
</template>

<script lang="ts">

export default {
  computed: {
    foo() {
      return 5;
    }
  },
  methods: {
    log() {
      const { button } = this.$refs as any;
      console.log(button);

      const { foo } = this;

      console.log(foo);

      if (true) {
        button.click();
      }
    }
  }
}
</script>
