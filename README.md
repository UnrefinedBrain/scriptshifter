# ScriptShifter


[![NPM Version](https://img.shields.io/npm/v/scriptshifter)](https://npmjs.com/package/scriptshifter) [![NPM License](https://img.shields.io/npm/l/scriptshifter)](https://github.com/UnrefinedBrain/vue-scriptshifter/blob/master/LICENSE) [![GitHub Repo stars](https://img.shields.io/github/stars/UnrefinedBrain/vue-scriptshifter)](https://github.com/UnrefinedBrain/vue-scriptshifter) [![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/UnrefinedBrain/vue-scriptshifter/ci.yml)](https://github.com/UnrefinedBrain/vue-scriptshifter/actions)

Vue ScriptShifter is a tool that converts Vue components from Options API to `<script setup>` with Composition API.

- [ScriptShifter](#scriptshifter)
  - [How to Use](#how-to-use)
    - [Command-line Arguments](#command-line-arguments)
    - [Vue 2.7](#vue-27)
    - [Vue 3.4](#vue-34)
    - [Vue 3.5](#vue-35)
  - [Code Formatting](#code-formatting)
  - [About Perfection](#about-perfection)
  - [Feature Support](#feature-support)
  - [Error Handling](#error-handling)
  - [Example](#example)
  - [License](#license)

## How to Use

To run Vue ScriptShifter against your code, use the following command. The output might vary slightly depending on the Vue version your components are written against.

### Command-line Arguments

| Argument | Description | Default |
| - | - | - |
| `--files <glob>` | Pattern of files to transform | `'**/src/**/*'` |
| `--vue <2.7 \| 3.4 \| 3.5>` | Vue version to transform SFCs to. Output may vary slightly depending on the Vue version | `'2.7'` |

### Vue 2.7

```sh
npx scriptshifter --files 'src/**/*' --vue 2.7
```

### Vue 3.4

```sh
npx scriptshifter --files 'src/**/*' --vue 3.4
```

### Vue 3.5

```sh
npx scriptshifter --files 'src/**/*' --vue 3.5
```

## Code Formatting

This tool can ruin the formatting of your SFC. Use your favorite code formatting tool like eslint or prettier to fix the ruined formatting according to your project's code style.

## About Perfection

The goal of this tool is not to achieve a perfect conversion, but instead to get you 98% of the way there. Ideally, there should be very few things to fix manually, if any. However, there may be some edge cases that cause it to emit output that is semantically incorrect. Please [file a GitHub issue](https://github.com/UnrefinedBrain/vue-scriptshifter/issues/new) with a minimal repro and the output you expected if you encounter such an edge case.

## Feature Support

Vue ScriptShifter aims to cover as much of the Options API surface as possible. This includes `data`, `computed`, `methods`, `props`, `watch`, lifecycle hooks, `provide`, `inject`, `emits`, Vuex, and Pinia.

Some features cannot be automatically transformed and may result in incomplete transformation, such as:
- `mixins`
- Modifying a component's options in a `beforeCreate` hook.

## Error Handling

If Vue ScriptShifter encounters usage of `this.myVariable` in a SFC but cannot determine how/where `myVariable` was declared (e.g. from a mixin), it will flag it for manual resolution

```ts
// ⚠️ scriptshifter: Could not determine how/where the "myVariable" variable was defined in this file
const myVariable = FIX_ME;
```

## Example

Input:

```vue
<script>
export default {
  data: () {
    return { count: 0 };
  },
  methods: {
    increment() {
      this.count++;
    },
  },
}
</script>
```

Output:
```vue
<script setup>
import { ref } from 'vue';

const count = ref(0);
const increment = () => {
  count.value++;
}
</script>
```

## License

ScriptShifter is released under the MIT license. See the [LICENSE](./LICENSE) file for the full license.
