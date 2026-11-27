import type { RawDriveFile } from '../data/driveFiles';
import { resolvePublicAsset } from './assets';

export type BookSeries = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
export type SchoolLevel = 'SD' | 'SMP' | 'SMA' | 'SMK' | 'SLB' | 'Lainnya';
export type SortOption =
  | 'default'
  | 'code-asc'
  | 'code-desc'
  | 'school-asc'
  | 'school-desc'
  | 'title-asc';

export const TITLE_SIMFONI = 'Simfoni Sunyi di Bawah Langit Persahabatan';
export const TITLE_SATU_BAIT = 'Satu Bait, Satu Cahaya untuk Negeri';
export const SUBTITLE_PUISI = 'Sekumpulan Puisi Bertema Rukun dengan Teman';

export interface BookRecord {
  no: number;
  kodeBuku: string;
  seri: BookSeries;
  nomorUrut: number;
  namaSekolah: string;
  judulBuku: string;
  subjudulBuku: string;
  jenjang: SchoolLevel;
  fileName: string;
  driveId: string;
  driveUrl: string;
  thumbnailUrl: string;
  previewUrl: string;
  localCoverUrl: string;
}

export interface CatalogFilterOptions {
  query?: string;
  judul?: string;
  jenjang?: 'all' | SchoolLevel;
  seri?: 'all' | BookSeries;
  sortBy?: SortOption;
}

export interface CatalogStats {
  totalBooks: number;
  uniqueSchools: number;
  simfoniCount: number;
  satuBaitCount: number;
  jenjangCounts: Record<SchoolLevel, number>;
  seriesCounts: Record<BookSeries, number>;
}

const SERIES_ORDER: Record<BookSeries, number> = {
  A: 1,
  B: 2,
  C: 3,
  D: 4,
  E: 5,
  F: 6,
};

export function getBookTitleForSeries(seri: BookSeries): string {
  // Series A, C, E -> Simfoni Sunyi di Bawah Langit Persahabatan
  // Series B, D, F -> Satu Bait, Satu Cahaya untuk Negeri
  if (seri === 'B' || seri === 'D' || seri === 'F') {
    return TITLE_SATU_BAIT;
  }
  return TITLE_SIMFONI;
}

export function detectSchoolLevel(schoolName: string): SchoolLevel {
  const normalized = schoolName.trim().toUpperCase();
  if (/^(SD|SDN|SDIT|SDGSMA|SDI)\b/.test(normalized) || /^SD\s/.test(normalized)) {
    return 'SD';
  }
  if (/^(SMP|SMPN)\b/.test(normalized)) {
    return 'SMP';
  }
  if (/^(SMA|SMAN|SMAS)\b/.test(normalized)) {
    return 'SMA';
  }
  if (/^(SMK|SMKS)\b/.test(normalized)) {
    return 'SMK';
  }
  if (/^SLB\b/.test(normalized)) {
    return 'SLB';
  }
  return 'Lainnya';
}

export function cleanSchoolName(raw: string): string {
  return raw.replace(/\s+/g, ' ').trim();
}

export function parseDriveFile(file: RawDriveFile, index: number): BookRecord {
  const withoutExt = file.name.replace(/\.(png|jpe?g|webp)$/i, '').trim();
  const match = withoutExt.match(/^j[il]{2}id\s+(SI-([A-F])(\d+))\s*[_-]\s*(.+)$/i);

  const seri = (match ? match[2].toUpperCase() : 'A') as BookSeries;
  const nomorUrut = match ? parseInt(match[3], 10) : index + 1;
  const kodeBuku = match ? match[1].toUpperCase() : `SI-A${index + 1}`;
  const namaSekolah = cleanSchoolName(match ? match[4] : withoutExt);
  const judulBuku = getBookTitleForSeries(seri);
  const jenjang = detectSchoolLevel(namaSekolah);

  return {
    no: index + 1,
    kodeBuku,
    seri,
    nomorUrut,
    namaSekolah,
    judulBuku,
    subjudulBuku: SUBTITLE_PUISI,
    jenjang,
    fileName: file.name,
    driveId: file.id,
    driveUrl: `https://drive.google.com/file/d/${file.id}/view`,
    thumbnailUrl: `https://drive.google.com/thumbnail?id=${file.id}&sz=w600`,
    previewUrl: `https://drive.google.com/thumbnail?id=${file.id}&sz=w1600`,
    localCoverUrl: resolvePublicAsset(`covers/${index}.jpg`),
  };
}

export function buildCatalog(files: RawDriveFile[]): BookRecord[] {
  return files.map((file, index) => parseDriveFile(file, index));
}

export function compareBookCode(a: BookRecord, b: BookRecord): number {
  const seriesDiff = SERIES_ORDER[a.seri] - SERIES_ORDER[b.seri];
  if (seriesDiff !== 0) return seriesDiff;
  return a.nomorUrut - b.nomorUrut;
}

export function filterAndSortCatalog(
  records: BookRecord[],
  options: CatalogFilterOptions = {}
): BookRecord[] {
  const query = (options.query ?? '').trim().toLowerCase();
  const judul = options.judul ?? 'all';
  const jenjang = options.jenjang ?? 'all';
  const seri = options.seri ?? 'all';
  const sortBy = options.sortBy ?? 'default';

  const filtered = records.filter((item) => {
    if (judul !== 'all' && item.judulBuku !== judul) return false;
    if (jenjang !== 'all' && item.jenjang !== jenjang) return false;
    if (seri !== 'all' && item.seri !== seri) return false;
    if (query.length > 0) {
      const noStr = String(item.no);
      const matchQuery =
        noStr.includes(query) ||
        item.kodeBuku.toLowerCase().includes(query) ||
        item.namaSekolah.toLowerCase().includes(query) ||
        item.judulBuku.toLowerCase().includes(query) ||
        item.jenjang.toLowerCase().includes(query);
      if (!matchQuery) return false;
    }
    return true;
  });

  if (sortBy === 'default') {
    return filtered;
  }

  return [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'code-asc':
        return compareBookCode(a, b);
      case 'code-desc':
        return compareBookCode(b, a);
      case 'school-asc':
        return a.namaSekolah.localeCompare(b.namaSekolah, 'id', { sensitivity: 'base' });
      case 'school-desc':
        return b.namaSekolah.localeCompare(a.namaSekolah, 'id', { sensitivity: 'base' });
      case 'title-asc': {
        const t = a.judulBuku.localeCompare(b.judulBuku, 'id', { sensitivity: 'base' });
        return t !== 0 ? t : compareBookCode(a, b);
      }
      default:
        return a.no - b.no;
    }
  });
}

export function computeCatalogStats(records: BookRecord[]): CatalogStats {
  const uniqueSchoolKeys = new Set<string>();
  let simfoniCount = 0;
  let satuBaitCount = 0;

  const jenjangCounts: Record<SchoolLevel, number> = {
    SD: 0,
    SMP: 0,
    SMA: 0,
    SMK: 0,
    SLB: 0,
    Lainnya: 0,
  };

  const seriesCounts: Record<BookSeries, number> = {
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    E: 0,
    F: 0,
  };

  for (const item of records) {
    uniqueSchoolKeys.add(item.namaSekolah.toLowerCase());
    if (item.judulBuku === TITLE_SIMFONI) {
      simfoniCount++;
    } else {
      satuBaitCount++;
    }
    jenjangCounts[item.jenjang]++;
    seriesCounts[item.seri]++;
  }

  return {
    totalBooks: records.length,
    uniqueSchools: uniqueSchoolKeys.size,
    simfoniCount,
    satuBaitCount,
    jenjangCounts,
    seriesCounts,
  };
}

function escapeCsvCell(value: string | number): string {
  const str = String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function generateCatalogCsv(records: BookRecord[]): string {
  const header = ['No.', 'Kode Buku', 'Nama Sekolah', 'Judul Buku', 'Jenjang', 'Seri', 'Link Google Drive'];
  const rows = records.map((item) =>
    [
      item.no,
      item.kodeBuku,
      item.namaSekolah,
      item.judulBuku,
      item.jenjang,
      `Seri ${item.seri}`,
      item.driveUrl,
    ]
      .map(escapeCsvCell)
      .join(',')
  );
  return '\uFEFF' + [header.join(','), ...rows].join('\r\n');
}
