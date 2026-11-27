import test from 'node:test';
import assert from 'node:assert/strict';
import { DRIVE_FILES } from '../data/driveFiles';
import {
  buildSyncedCatalog,
  decodeHtmlEntities,
  isValidDriveFileId,
  parseEmbeddedFolderHtml,
} from './driveSync';

test('isValidDriveFileId accepts valid Drive IDs and blocks traversal/SSRF inputs', () => {
  assert.equal(isValidDriveFileId('1UdsoMIleNn1ImogA9YpjR3fEVxh9rsN5'), true);
  assert.equal(isValidDriveFileId('1-ha-jSL4wN2ImdL55izYS74PXd04zuy4'), true);
  assert.equal(isValidDriveFileId('../../etc/passwd'), false);
  assert.equal(isValidDriveFileId('http://127.0.0.1/test'), false);
  assert.equal(isValidDriveFileId('short'), false);
  assert.equal(isValidDriveFileId(''), false);
});

test('decodeHtmlEntities decodes named and numeric entities safely', () => {
  assert.equal(
    decodeHtmlEntities('Jilid SI-A999_SDN &amp; MI &#39;Harapan&#39;.png'),
    "Jilid SI-A999_SDN & MI 'Harapan'.png"
  );
  assert.equal(decodeHtmlEntities('A&#x20;B'), 'A B');
});

test('parseEmbeddedFolderHtml extracts files and ignores subfolders', () => {
  const sampleHtml = `
    <div class="flip-entries">
      <div class="flip-entry" id="entry-folder1234567890" tabindex="0">
        <div class="flip-entry-info">
          <a href="https://drive.google.com/drive/folders/folder1234567890">
            <div class="flip-entry-title">Subfolder Arsip</div>
          </a>
        </div>
      </div>
      <div class="flip-entry" id="entry-1UdsoMIleNn1ImogA9YpjR3fEVxh9rsN5" tabindex="0">
        <div class="flip-entry-info">
          <a href="https://drive.google.com/file/d/1UdsoMIleNn1ImogA9YpjR3fEVxh9rsN5/view?usp=drive_web">
            <div class="flip-entry-title">Jilid SI-A1_SDN Prambon 1.png</div>
          </a>
        </div>
      </div>
      <div class="flip-entry" id="entry-1NewUploadFileId999999999" tabindex="0">
        <div class="flip-entry-info">
          <a href="https://drive.google.com/file/d/1NewUploadFileId999999999/view?usp=drive_web">
            <div class="flip-entry-title">Jilid SI-B999_SDN Baru &amp; Jaya.jpg</div>
          </a>
        </div>
      </div>
    </div>
  `;

  const parsed = parseEmbeddedFolderHtml(sampleHtml);
  assert.equal(parsed.length, 2);
  assert.deepEqual(parsed[0], {
    id: '1UdsoMIleNn1ImogA9YpjR3fEVxh9rsN5',
    name: 'Jilid SI-A1_SDN Prambon 1.png',
  });
  assert.deepEqual(parsed[1], {
    id: '1NewUploadFileId999999999',
    name: 'Jilid SI-B999_SDN Baru & Jaya.jpg',
  });
});

test('buildSyncedCatalog preserves bundled local covers and proxies newly uploaded Drive files', () => {
  const bundled = DRIVE_FILES.slice(0, 2);
  const live = [
    bundled[1], // reversed order from Drive alphabetical sort
    bundled[0],
    { id: '1NewUploadFileId999999999', name: 'Jilid SI-B999_SDN Baru Jaya.jpg' },
  ];

  const synced = buildSyncedCatalog(live, bundled, '/');
  assert.equal(synced.length, 3);
  assert.equal(synced[0].kodeBuku, 'SI-A1');
  assert.equal(synced[0].localCoverUrl, 'https://drive.google.com/thumbnail?id=1UdsoMIleNn1ImogA9YpjR3fEVxh9rsN5&sz=w1600');
  assert.equal(synced[1].kodeBuku, 'SI-A2');
  assert.equal(synced[1].localCoverUrl, 'https://drive.google.com/thumbnail?id=1j7cUV7pVbTuniNgsnpdVg1p0KaVYluSx&sz=w1600');
  assert.equal(synced[2].no, 3);
  assert.equal(synced[2].kodeBuku, 'SI-B999');
  assert.equal(synced[2].namaSekolah, 'SDN Baru Jaya');
  assert.equal(synced[2].localCoverUrl, 'https://drive.google.com/thumbnail?id=1NewUploadFileId999999999&sz=w1600');
});
