import {
  DRIVE_EMBEDDED_LIST_URL,
  type ParsedDriveEntry,
  isValidDriveFileId,
  parseEmbeddedFolderHtml,
} from '../src/utils/driveFolderParser.ts';

const CATALOG_CACHE_TTL_MS = 45_000;
const MAX_COVER_BYTES = 10 * 1024 * 1024;

interface CatalogCacheEntry {
  files: ParsedDriveEntry[];
  updatedAt: string;
  fetchedAt: number;
}

let catalogCache: CatalogCacheEntry | null = null;

export async function getLiveDriveCatalog(forceRefresh = false): Promise<CatalogCacheEntry> {
  const now = Date.now();
  if (!forceRefresh && catalogCache && now - catalogCache.fetchedAt < CATALOG_CACHE_TTL_MS) {
    return catalogCache;
  }

  try {
    const response = await fetch(DRIVE_EMBEDDED_LIST_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; CoverSidoarjoSync/1.0)',
        Accept: 'text/html,application/xhtml+xml',
      },
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      throw new Error(`Drive folder fetch failed with status ${response.status}`);
    }

    const html = await response.text();
    const files = parseEmbeddedFolderHtml(html);

    if (files.length === 0) {
      throw new Error('Parsed zero files from Google Drive folder response');
    }

    catalogCache = {
      files,
      updatedAt: new Date().toISOString(),
      fetchedAt: now,
    };

    return catalogCache;
  } catch (err) {
    if (catalogCache) {
      return catalogCache;
    }
    throw err;
  }
}

export async function fetchDriveCoverBuffer(
  fileId: string
): Promise<{ buffer: Buffer; contentType: string } | { error: string; status: number }> {
  if (!isValidDriveFileId(fileId)) {
    return { error: 'Invalid file id', status: 400 };
  }

  const targetUrl = `https://drive.google.com/thumbnail?id=${encodeURIComponent(fileId)}&sz=w800`;

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; CoverSidoarjoSync/1.0)',
        Accept: 'image/*',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(12_000),
    });

    if (!response.ok) {
      return { error: 'Cover image unavailable', status: response.status === 404 ? 404 : 502 };
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.toLowerCase().startsWith('image/')) {
      return { error: 'Upstream response is not an image', status: 502 };
    }

    const contentLength = Number(response.headers.get('content-length') || '0');
    if (contentLength > MAX_COVER_BYTES) {
      return { error: 'Image exceeds size limit', status: 413 };
    }

    const arrayBuffer = await response.arrayBuffer();
    if (arrayBuffer.byteLength > MAX_COVER_BYTES) {
      return { error: 'Image exceeds size limit', status: 413 };
    }

    return {
      buffer: Buffer.from(arrayBuffer),
      contentType,
    };
  } catch {
    return { error: 'Failed to fetch cover image', status: 502 };
  }
}
