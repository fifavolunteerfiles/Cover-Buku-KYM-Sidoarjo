export interface ParsedDriveEntry {
  id: string;
  name: string;
}

export const DRIVE_FOLDER_ID = '1_cN5ryki8gT_gVBEDvHwn6udw4s7PgJu';
export const DRIVE_EMBEDDED_LIST_URL = `https://drive.google.com/embeddedfolderview?id=${DRIVE_FOLDER_ID}#list`;

const DRIVE_FILE_ID_REGEX = /^[A-Za-z0-9_-]{10,80}$/;

export function isValidDriveFileId(id: string): boolean {
  return DRIVE_FILE_ID_REGEX.test(id);
}

const NAMED_HTML_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
};

export function decodeHtmlEntities(input: string): string {
  return input.replace(/&(#x[0-9a-fA-F]+|#\d+|[a-zA-Z]+);/g, (full, entity: string) => {
    if (entity.startsWith('#x') || entity.startsWith('#X')) {
      const code = parseInt(entity.slice(2), 16);
      return Number.isFinite(code) && code > 0 ? String.fromCodePoint(code) : full;
    }
    if (entity.startsWith('#')) {
      const code = parseInt(entity.slice(1), 10);
      return Number.isFinite(code) && code > 0 ? String.fromCodePoint(code) : full;
    }
    return NAMED_HTML_ENTITIES[entity] ?? full;
  });
}

export function parseEmbeddedFolderHtml(html: string): ParsedDriveEntry[] {
  const results: ParsedDriveEntry[] = [];
  const seen = new Set<string>();

  const entryPattern =
    /<div class="flip-entry" id="entry-([A-Za-z0-9_-]+)"[\s\S]*?<a href="([^"]+)"[\s\S]*?<div class="flip-entry-title">([^<]+)<\/div>/g;

  for (const match of html.matchAll(entryPattern)) {
    const id = match[1];
    const href = match[2];
    const rawTitle = match[3];

    // Skip subfolders (only include actual uploaded files)
    if (!isValidDriveFileId(id) || href.includes('/drive/folders/')) {
      continue;
    }
    if (seen.has(id)) {
      continue;
    }
    seen.add(id);

    const name = decodeHtmlEntities(rawTitle).replace(/\s+/g, ' ').trim();
    if (!name) continue;

    results.push({ id, name });
  }

  return results;
}
