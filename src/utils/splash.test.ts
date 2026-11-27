import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SPLASH_DURATION_MS,
  SPLASH_REDUCED_DURATION_MS,
  getSplashDurationMs,
  shouldShowSplash,
} from './splash';

test('shouldShowSplash shows reveal automatically on normal open', () => {
  assert.equal(shouldShowSplash(''), true);
  assert.equal(shouldShowSplash('?page=katalog'), true);
});

test('shouldShowSplash skips only when autostart=1 or skipIntro=1 is explicitly passed', () => {
  assert.equal(shouldShowSplash('?autostart=1'), false);
  assert.equal(shouldShowSplash('?skipIntro=1'), false);
});

test('getSplashDurationMs respects reduced motion preference', () => {
  assert.equal(getSplashDurationMs(false), SPLASH_DURATION_MS);
  assert.equal(getSplashDurationMs(true), SPLASH_REDUCED_DURATION_MS);
});
