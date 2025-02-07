<template>
  <div></div>
</template>

<script>
export default {
  created() {
    console.log('created');
  },

  mounted() {
    console.log('mounted');
  },

  beforeDestroy() {
    console.log('beforeDestroy');
  },

  destroyed() {
    console.log('destroyed');
  },

  beforeUpdate() {
    console.log('beforeUpdate');
  },

  updated() {
    console.log('updated');
  }
}
</script>
