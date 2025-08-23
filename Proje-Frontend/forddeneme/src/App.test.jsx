import { describe, expect, test } from 'vitest';
import { computeTimerColor } from './timer';

describe('computeTimerColor', () => {
  const optimalTime = 135;

  test('yellow at 108 seconds', () => {
    expect(computeTimerColor(108, optimalTime)).toBe('text-yellow-600');
  });

  test('yellow at 134 seconds', () => {
    expect(computeTimerColor(134, optimalTime)).toBe('text-yellow-600');
  });

  test('red at 135 seconds', () => {
    expect(computeTimerColor(135, optimalTime)).toBe('text-red-600');
  });
});
