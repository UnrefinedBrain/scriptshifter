<template>
  <div></div>
</template>

<script setup>
const props = defineProps({
  foo: String,
});

(() => {
  console.log(props.foo)
})();
</script>
