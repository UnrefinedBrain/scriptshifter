<template>
  <div v-my-directive></div>
</template>

<script lang="ts">
import 'library';
import type { SomeType } from 'some-library';
import { myDirective } from 'my-library';
import { directive as onClickaway } from 'somewhere';
import defaultDirective from 'directive-library';
import * as namespaceDirective from 'another-directive-library';


export default {
  directives: {
    myDirective,
    onClickaway,
    defaultDirective,
    namespaceDirective,

    logMounted: {
      mounted() {
        console.log('mount');
      }
    },
  }
}
</script>
