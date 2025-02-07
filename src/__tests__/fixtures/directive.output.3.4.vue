<template>
  <div v-my-directive></div>
</template>

<script lang="ts" setup>
import 'library';
import type { SomeType } from 'some-library';
import { myDirective as vMyDirective } from 'my-library';
import { directive as vOnClickaway } from 'somewhere';
import vDefaultDirective from 'directive-library';
import * as vNamespaceDirective from 'another-directive-library';


const vLogMounted = {
  mounted() {
    console.log('mount');
  }
};
</script>
