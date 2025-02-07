<template>
  <div></div>
</template>

<script>
export default {
  props: {
    data: Object,
  },

  data: () => ({
    user: {
      firstName: 'John',
      middleName: 'Jacob',
      lastName: 'Jingleheimerschmidt',
    }
  }),

  watch: {
    /**
     * log the user if it changes
     */
    user() {
      console.log('user');
    },

    data() {
      console.log('data');
    },

    'data.bar': {
      handler() {
        console.log('data.bar');
      },
      deep: true,
    },

    'data.foo'() {
      console.log('data.foo');
    },

    'user.middleName'() {
      console.log('user.middleName');
    },

    'user.address': {
      handler: () => {
        console.log('address changed');
      }
    },

    'user.lastName': {
      immediate: true,
      handler() {
        console.log('user.lastName');
      }
    }
  }
};
</script>
