/* v8 ignore start */
export const vueVersions = [
  '2.7',
  '3.4',
  '3.5',
] as const satisfies string[];

export type VueVersion = typeof vueVersions[number];
