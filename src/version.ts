import { VueVersion } from './options';

const splitVersion = (version: string) => version.split('.').map(Number);

export function isVersionGtEq(version: VueVersion, compare: VueVersion) {
  if (version === compare) {
    return true;
  }

  const versionParts = splitVersion(version);
  const compareParts = splitVersion(compare);

  for (let i = 0; i < versionParts.length; i++) {
    const a = versionParts[i]!;
    const b = compareParts[i]!;
    if (a < b) {
      return false;
    }

    if (a > b) {
      return true;
    }
  }

  return false;
}

export function isVersionLtEq(version: VueVersion, compare: VueVersion) {
  return isVersionGtEq(compare, version);
}
