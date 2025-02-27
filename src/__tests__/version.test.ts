import { describe, it, expect } from 'vitest';
import { isVersionGtEq, isVersionLtEq } from '../version';

describe('isVersionGreaterThanOrEqualTo', () => {
  it.each([
    [true, '2.7', '2.7'],
    [false, '2.7', '3.4'],
    [true, '3.4', '2.7'],
  ] as const)('should return %s when comparing %s against %s', (expected, first, second) => {
    expect(isVersionGtEq(first, second)).toBe(expected);
  });
});

describe('isVersionLessThanOrEqualTo', () => {
  it.each([
    [true, '2.7', '2.7'],
    [true, '2.7', '3.4'],
    [false, '3.4', '2.7'],
  ] as const)('should return %s when comparing %s against %s', (expected, first, second) => {
    expect(isVersionLtEq(first, second)).toBe(expected);
  });
});
