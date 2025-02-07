<template>
  <div></div>
</template>

<script lang="ts" setup>
import { computed, getCurrentInstance } from 'vue';

const SomeModuleName = 'SomeModuleName';

const store = getCurrentInstance()!.proxy.$store;
const localNameB = computed(() => store.getters[SomeModuleName + '/getterB']);
const getterA = computed(() => store.getters['MyModule/getterA']);

const derivedFromGetters = computed(() => {
  return getterA.value + localNameB.value;
});

/**
 * An action that does A
 */
const actionA = (payload: unknown) => store.dispatch(SomeModuleName + '/actionA', payload);

const localAction = (payload: unknown) => store.dispatch('MyModule/actionB', payload);

// this is a mutation
const mutation1 = (payload: unknown) => {
  store.commit('OtherModule/mutation1', payload);
};

const mutation2 = (payload: unknown) => {
  store.commit(SomeModuleName + '/mutation2', payload);
};

const local = (payload: unknown) => {
  store.commit('MyModule/mutation3', payload);
};
</script>
