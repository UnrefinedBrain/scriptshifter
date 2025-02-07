<template>
  <div></div>
</template>

<script>
export default {
  props: {
    foo: String
  },
  setup(props) {
    const { foo } = toRefs(props);

    return {};
  }
}
</script>
