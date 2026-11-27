import type { IncomingMessage, ServerResponse } from 'node:http';
import { fetchDriveCoverBuffer } from './_drive.ts';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method && req.method !== 'GET' && req.method !== 'HEAD') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  const reqUrl = new URL(req.url || '/api/cover', 'http://localhost');
  const fileId = reqUrl.searchParams.get('id') || '';
  const result = await fetchDriveCoverBuffer(fileId);

  if ('error' in result) {
    res.statusCode = result.status;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.end(JSON.stringify({ error: result.error }));
    return;
  }

  res.statusCode = 200;
  res.setHeader('Content-Type', result.contentType);
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400');
  res.end(result.buffer);
}
