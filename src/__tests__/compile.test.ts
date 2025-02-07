import { expect, it } from 'vitest';
import { transform } from 'vue-metamorph';
import { scriptshifter } from '../compile';

it.each([
  'js',
  'ts',
])('should do nothing when the input is a %s file', (fileType) => {
  const source = `export default {
  computed: {
    two() {
      return 2;
    }
  }
}
`;

  const result = transform(source, `file.${fileType}`, [scriptshifter]);

  expect(result.code).toBe(source);
});

it('should do nothing if the component is already a <script setup> component', () => {
  const source = `<template>
  <div>{{ count }}</div>
</template>

<script setup>
const count = 2;
</script>
`;

  const result = transform(source, 'file.vue', [scriptshifter]);

  expect(result.code).toBe(source);
});
