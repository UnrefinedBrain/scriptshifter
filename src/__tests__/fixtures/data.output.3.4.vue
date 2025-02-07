<template>
  <div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const baz = 5;

const props = defineProps({
  prop1: String,
});

/**
 * hello
 */
const foo = ref(0);

const bar = ref(1);
const quz = ref(props.prop1);

const qux = ref(config({
  show: props.prop1,
}));

const logFoo = () => {
  console.log(foo.value);
};

const mutateBar = (): number => {
  bar.value++;

  console.log(bar.value);

  return bar.value + baz;
};
</script>
