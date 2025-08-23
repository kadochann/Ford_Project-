import test from 'node:test';
import assert from 'node:assert';
import { computeTimerColor } from './timer.js';

test('yellow at 108 seconds', () => {
  assert.strictEqual(computeTimerColor(108, 135), 'text-yellow-600');
});

test('yellow at 134 seconds', () => {
  assert.strictEqual(computeTimerColor(134, 135), 'text-yellow-600');
});

test('red at 135 seconds', () => {
  assert.strictEqual(computeTimerColor(135, 135), 'text-red-600');
});
