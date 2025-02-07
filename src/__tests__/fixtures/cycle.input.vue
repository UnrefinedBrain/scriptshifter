<template>
  <div></div>
</template>

<script>
export default {
  data: () => ({
    flag: false,
  }),
  methods: {
    a() {
      this.b();
    },

    b() {
      this.c();
    },

    c() {
      if (flag) {
        this.a();
      } else {
        this.d();
      }
    },

    d() {
      this.c();
    }
  }
}
</script>
