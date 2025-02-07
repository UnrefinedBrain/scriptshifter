<template>
  <div>{{ foo }}</div>
</template>

<script>
export default {
  props: {
    foo: String,
  },

  setup(props) {
    return {
      foo: bar.props,
    }
  }
};
</script>
