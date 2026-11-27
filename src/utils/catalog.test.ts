import test from 'node:test';
import assert from 'node:assert/strict';
import { DRIVE_FILES } from '../data/driveFiles';
import {
  TITLE_SATU_BAIT,
  TITLE_SIMFONI,
  buildCatalog,
  computeCatalogStats,
  detectSchoolLevel,
  filterAndSortCatalog,
  generateCatalogCsv,
  parseDriveFile,
} from './catalog';

test('parses all 382 real Google Drive entries without errors', () => {
  const catalog = buildCatalog(DRIVE_FILES);
  assert.equal(catalog.length, 382);
  assert.equal(catalog[0].no, 1);
  assert.equal(catalog[0].kodeBuku, 'SI-A1');
  assert.equal(catalog[0].namaSekolah, 'SDN Prambon 1');
  assert.equal(catalog[0].judulBuku, TITLE_SIMFONI);

  assert.equal(catalog[381].no, 382);
  assert.equal(catalog[381].kodeBuku, 'SI-F324');
  assert.equal(catalog[381].namaSekolah, 'SMK Krian 2 SDA');
  assert.equal(catalog[381].judulBuku, TITLE_SATU_BAIT);
});

test('assigns correct book titles across alternating series A-F', () => {
  const a = parseDriveFile({ id: '1', name: 'Jilid SI-A1_SDN Prambon 1.png' }, 0);
  const b = parseDriveFile({ id: '2', name: 'Jilid SI-B2_SDN Sidokare 3.png' }, 1);
  const c = parseDriveFile({ id: '3', name: 'Jilid SI-C164_SDN Suko 2.jpeg' }, 2);
  const d = parseDriveFile({ id: '4', name: 'Jilid SI-D164_SDN Suko 2.jpeg' }, 3);
  const e = parseDriveFile({ id: '5', name: 'Jilid SI-E267_SMKS Krian 2 SDA.jpeg' }, 4);
  const f = parseDriveFile({ id: '6', name: 'Jilid SI-F267_SMKS Krian 2 SDA.jpeg' }, 5);

  assert.equal(a.judulBuku, TITLE_SIMFONI);
  assert.equal(b.judulBuku, TITLE_SATU_BAIT);
  assert.equal(c.judulBuku, TITLE_SIMFONI);
  assert.equal(d.judulBuku, TITLE_SATU_BAIT);
  assert.equal(e.judulBuku, TITLE_SIMFONI);
  assert.equal(f.judulBuku, TITLE_SATU_BAIT);
});

test('handles case-insensitive JIlid prefix and trailing whitespace in filenames', () => {
  const parsed = parseDriveFile({ id: 'x', name: 'JIlid SI-A134_SDN Bluru Kidul 2.png' }, 133);
  assert.equal(parsed.kodeBuku, 'SI-A134');
  assert.equal(parsed.namaSekolah, 'SDN Bluru Kidul 2');

  const trimmed = parseDriveFile({ id: 'y', name: 'Jilid SI-B38_SD Negeri Kebonagung 1 .jpg' }, 331);
  assert.equal(trimmed.kodeBuku, 'SI-B38');
  assert.equal(trimmed.namaSekolah, 'SD Negeri Kebonagung 1');
});

test('detects all school levels accurately across the entire dataset', () => {
  const catalog = buildCatalog(DRIVE_FILES);
  const stats = computeCatalogStats(catalog);

  assert.equal(stats.jenjangCounts.Lainnya, 0);
  assert.equal(
    stats.jenjangCounts.SD +
      stats.jenjangCounts.SMP +
      stats.jenjangCounts.SMA +
      stats.jenjangCounts.SMK +
      stats.jenjangCounts.SLB,
    382
  );
  assert.equal(detectSchoolLevel('SDGSMA Darussalamah Krian'), 'SD');
  assert.equal(detectSchoolLevel('SMKS Krian 2 SDA'), 'SMK');
  assert.equal(detectSchoolLevel('SLB Autis Mutiara Hati'), 'SLB');
});

test('filters by query, jenjang, and title, and sorts numerically by code', () => {
  const catalog = buildCatalog(DRIVE_FILES);

  const krianBooks = filterAndSortCatalog(catalog, { query: 'krian' });
  assert.ok(krianBooks.length > 10);
  assert.ok(krianBooks.every((b) => b.namaSekolah.toLowerCase().includes('krian')));

  const satuBaitOnly = filterAndSortCatalog(catalog, { judul: TITLE_SATU_BAIT });
  assert.equal(satuBaitOnly.length, 39 + 5 + 3); // B(39) + D(5) + F(3) = 47

  const smkOnly = filterAndSortCatalog(catalog, { jenjang: 'SMK', sortBy: 'code-asc' });
  assert.equal(smkOnly.length, 23);
  assert.equal(smkOnly[0].seri, 'A');
});

test('generates valid UTF-8 BOM CSV output with proper escaping', () => {
  const catalog = buildCatalog(DRIVE_FILES).slice(0, 2);
  const csv = generateCatalogCsv(catalog);
  assert.ok(csv.startsWith('\uFEFFNo.,Kode Buku,Nama Sekolah,Judul Buku'));
  assert.ok(csv.includes('SI-A1,SDN Prambon 1,Simfoni Sunyi di Bawah Langit Persahabatan'));
  assert.ok(csv.includes('https://drive.google.com/file/d/1UdsoMIleNn1ImogA9YpjR3fEVxh9rsN5/view'));
});
