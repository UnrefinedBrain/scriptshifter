<template>
  <div></div>
</template>

<script>
import Api from 'path/to/api';
export default {
  Api,

  ...Api,

  methods: {
    callApi() {
      return this.$options.Api.callApi();
    }
  }
}
</script>
