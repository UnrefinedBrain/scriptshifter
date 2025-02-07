<template>
  <div></div>
</template>

<script>
// this module uses a this.foo that wasn't defined anywhere

export default {
  created() {
    this.foo();
  }
}
</script>
