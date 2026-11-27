import type { RawDriveFile } from '../data/driveFiles';
import { resolvePublicAsset } from './assets';
import { BookRecord, buildCatalog, compareBookCode, parseDriveFile } from './catalog';
import {
  DRIVE_EMBEDDED_LIST_URL,
  DRIVE_FOLDER_ID,
  decodeHtmlEntities,
  isValidDriveFileId,
  parseEmbeddedFolderHtml,
} from './driveFolderParser';

export {
  DRIVE_EMBEDDED_LIST_URL,
  DRIVE_FOLDER_ID,
  decodeHtmlEntities,
  isValidDriveFileId,
  parseEmbeddedFolderHtml,
};

export function buildSyncedCatalog(
  liveFiles: RawDriveFile[] | null | undefined,
  bundledFiles: RawDriveFile[],
  baseUrl?: string
): BookRecord[] {
  if (!liveFiles || liveFiles.length === 0) {
    return bundledFiles.map((file, index) => {
      const record = parseDriveFile(file, index);
      return {
        ...record,
        localCoverUrl: resolvePublicAsset(`covers/${index}.jpg`, baseUrl),
      };
    });
  }

  const knownIndexById = new Map<string, number>();
  bundledFiles.forEach((file, index) => {
    knownIndexById.set(file.id, index);
  });

  const knownEntries: Array<{ file: RawDriveFile; bundledIndex: number }> = [];
  const newEntries: RawDriveFile[] = [];

  for (const liveFile of liveFiles) {
    const knownIndex = knownIndexById.get(liveFile.id);
    if (knownIndex !== undefined) {
      knownEntries.push({ file: liveFile, bundledIndex: knownIndex });
    } else {
      newEntries.push(liveFile);
    }
  }

  // Keep existing entries in canonical catalog order with fast local cover paths
  knownEntries.sort((a, b) => a.bundledIndex - b.bundledIndex);

  const knownRecords: BookRecord[] = knownEntries.map(({ file }, pos) => {
    const parsed = parseDriveFile(file, pos);
    return {
      ...parsed,
      no: pos + 1,
      localCoverUrl: `https://drive.google.com/thumbnail?id=${file.id}&sz=w1600`,
    };
  });

  // Parse and sort newly uploaded Drive files deterministically
  const parsedNewRecords = newEntries
    .map((file, idx) => {
      const parsed = parseDriveFile(file, knownRecords.length + idx);
      return {
        ...parsed,
        localCoverUrl: `https://drive.google.com/thumbnail?id=${file.id}&sz=w1600`,
      };
    })
    .sort((a, b) => {
      const codeCmp = compareBookCode(a, b);
      if (codeCmp !== 0) return codeCmp;
      return a.namaSekolah.localeCompare(b.namaSekolah, 'id', { sensitivity: 'base' });
    })
    .map((record, idx) => ({
      ...record,
      no: knownRecords.length + idx + 1,
    }));

  if (knownRecords.length === 0 && parsedNewRecords.length === 0) {
    return buildCatalog(bundledFiles);
  }

  return [...knownRecords, ...parsedNewRecords];
}
