<template>
  <div></div>
</template>

<script>
const computedKey = Symbol();

export default {
  provide: {
    foo: 5,
    'bar': 6,
    [computedKey]: 7
  }
}

</script>
