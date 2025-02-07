<template>
  <div></div>
</template>

<script>
export default {
  methods: {
    a() {
      this.$router.push('/a')
      this.$route.name;
    },

    b() {
      this.$router.push('/b')
      this.$route.name;
    }
  },
}
</script>
