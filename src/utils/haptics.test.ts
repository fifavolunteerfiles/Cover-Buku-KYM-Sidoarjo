import test from 'node:test';
import assert from 'node:assert/strict';
import { HAPTIC_PATTERNS, getHapticPattern, triggerHaptic } from './haptics';

test('returns expected subtle vibration patterns for each haptic style', () => {
  assert.equal(getHapticPattern('light'), HAPTIC_PATTERNS.light);
  assert.equal(getHapticPattern('medium'), HAPTIC_PATTERNS.medium);
  assert.deepEqual(getHapticPattern('select'), [6, 20, 8]);
  assert.deepEqual(getHapticPattern('reset'), [10, 24, 10]);
});

test('triggers navigator.vibrate when supported and reduced motion is off', () => {
  let receivedPattern: number | number[] | null = null;
  const ok = triggerHaptic('medium', {
    navigator: {
      vibrate: (pattern) => {
        receivedPattern = pattern;
        return true;
      },
    },
    window: {
      matchMedia: () => ({ matches: false }),
    },
  });

  assert.equal(ok, true);
  assert.equal(receivedPattern, 12);
});

test('skips vibration when prefers-reduced-motion is enabled', () => {
  let called = false;
  const ok = triggerHaptic('select', {
    navigator: {
      vibrate: () => {
        called = true;
        return true;
      },
    },
    window: {
      matchMedia: () => ({ matches: true }),
    },
  });

  assert.equal(ok, false);
  assert.equal(called, false);
});

test('handles missing navigator.vibrate gracefully without throwing', () => {
  const ok = triggerHaptic('light', {
    navigator: {},
    window: { matchMedia: () => ({ matches: false }) },
  });
  assert.equal(ok, false);
});
