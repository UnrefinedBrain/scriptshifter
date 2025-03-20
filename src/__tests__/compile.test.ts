import { expect, it } from 'vitest';
import { EOL } from 'os';
import { transform } from 'vue-metamorph';
import { scriptshifter } from '../compile';

export function normalizeLinebreaks(code: string) {
  return EOL === '\n' ? code : code.replaceAll(EOL, '\n');
}

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

  expect(normalizeLinebreaks(result.code)).toBe(source);
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

  expect(normalizeLinebreaks(result.code)).toBe(source);
});
