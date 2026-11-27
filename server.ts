import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fetchDriveCoverBuffer, getLiveDriveCatalog } from './api/_drive.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

async function startServer() {
  const app = express();
  app.disable('x-powered-by');

  app.get('/api/catalog', async (req, res) => {
    try {
      const forceRefresh = req.query.refresh === '1';
      const result = await getLiveDriveCatalog(forceRefresh);
      res
        .status(200)
        .set({
          'Content-Type': 'application/json; charset=utf-8',
          'X-Content-Type-Options': 'nosniff',
          'Cache-Control': 'public, max-age=30, s-maxage=45, stale-while-revalidate=120',
        })
        .json({
          files: result.files,
          count: result.files.length,
          updatedAt: result.updatedAt,
        });
    } catch {
      res
        .status(503)
        .set('X-Content-Type-Options', 'nosniff')
        .json({ error: 'Unable to sync catalog from Google Drive right now' });
    }
  });

  app.get('/api/cover', async (req, res) => {
    const fileId = typeof req.query.id === 'string' ? req.query.id : '';
    const result = await fetchDriveCoverBuffer(fileId);

    if ('error' in result) {
      res
        .status(result.status)
        .set('X-Content-Type-Options', 'nosniff')
        .json({ error: result.error });
      return;
    }

    res
      .status(200)
      .set({
        'Content-Type': result.contentType,
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400',
      })
      .send(result.buffer);
  });

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      const indexPath = path.join(distDir, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send('Build output not found');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
