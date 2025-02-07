<template>
  <div></div>
</template>

<script setup>
import Api from 'path/to/api';

const $options = {
  Api,
  ...Api,
};

const callApi = () => {
  return $options.Api.callApi();
};
</script>
