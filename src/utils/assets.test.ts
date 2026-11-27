import test from 'node:test';
import assert from 'node:assert/strict';
import { KYM_LOGO_PATH, resolvePublicAsset } from './assets';

test('resolvePublicAsset resolves paths cleanly for root and subpath bases', () => {
  assert.equal(resolvePublicAsset('covers/0.jpg', '/'), '/covers/0.jpg');
  assert.equal(resolvePublicAsset('/covers/0.jpg', '/'), '/covers/0.jpg');
  assert.equal(
    resolvePublicAsset('covers/0.jpg', '/Cover-Buku-KYM-Sidoarjo/'),
    '/Cover-Buku-KYM-Sidoarjo/covers/0.jpg'
  );
  assert.equal(
    resolvePublicAsset(KYM_LOGO_PATH, '/Cover-Buku-KYM-Sidoarjo'),
    '/Cover-Buku-KYM-Sidoarjo/assets/aistudio/IMG_8414_ecf9e34e.JPG'
  );
  assert.equal(resolvePublicAsset('covers/12.jpg', './'), './covers/12.jpg');
});
