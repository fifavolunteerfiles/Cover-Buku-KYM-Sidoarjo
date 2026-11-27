import type { IncomingMessage, ServerResponse } from 'node:http';
import { getLiveDriveCatalog } from './_drive.ts';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method && req.method !== 'GET' && req.method !== 'HEAD') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  try {
    const reqUrl = new URL(req.url || '/api/catalog', 'http://localhost');
    const forceRefresh = reqUrl.searchParams.get('refresh') === '1';
    const result = await getLiveDriveCatalog(forceRefresh);

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'public, max-age=30, s-maxage=45, stale-while-revalidate=120');
    res.end(
      JSON.stringify({
        files: result.files,
        count: result.files.length,
        updatedAt: result.updatedAt,
      })
    );
  } catch {
    res.statusCode = 503;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.end(JSON.stringify({ error: 'Unable to sync catalog from Google Drive right now' }));
  }
}
