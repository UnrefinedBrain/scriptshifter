import { defineConfig } from 'vite';
import { builtinModules } from 'module';
import pkg from './package.json';

export default defineConfig({
  build: {
    target: 'esnext',
    minify: false,

    rollupOptions: {
      input: 'src/main.ts',
      output: {
        banner: '#!/usr/bin/env node',
        format: 'esm',
        entryFileNames: 'cli.js',
      },
      external: [
        ...builtinModules,
        ...builtinModules.map((x) => `node:${x}`),
        ...Object.keys(pkg.dependencies),
      ],
    },
  },
});
