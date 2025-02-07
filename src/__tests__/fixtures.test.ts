import * as fs from 'fs';
import * as path from 'path';
import {
  it,
  expect,
  describe,
} from 'vitest';
import { transform } from 'vue-metamorph';
import { scriptshifter } from '../compile';
import { vueVersions } from '../options';

const fixtures = fs
  .readdirSync(path.resolve(__dirname, 'fixtures'))
  .filter((file) => file.endsWith('.input.vue'))
  .map((file) => path.join('fixtures', file));

describe.each(vueVersions)('Vue %s mode', (mode) => {
  it.each(fixtures)('snapshot %s', async (filename) => {
    const code = fs.readFileSync(path.resolve(__dirname, filename), { encoding: 'utf-8' });
    await expect(
      transform(code, filename, [scriptshifter], { vue: mode }).code,
    ).toMatchFileSnapshot(path.resolve(__dirname, filename.replace('.input.vue', `.output.${mode}.vue`)));
  });
});
