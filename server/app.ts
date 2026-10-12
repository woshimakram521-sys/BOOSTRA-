import 'dotenv/config';
import express from 'express';
import { createApiRouter } from './api';
import path from 'path';
import fs from 'fs';

export function createApiApp(): express.Express {
  const app = express();
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Mount API router
  app.use('/api', createApiRouter());

  // Static robots.txt & sitemap.xml fallback
  app.get('/robots.txt', (req, res) => {
    const robotsPath = path.resolve(process.cwd(), 'public', 'robots.txt');
    if (fs.existsSync(robotsPath)) {
      res.type('text/plain').sendFile(robotsPath);
    } else {
      res.type('text/plain').send('User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\n');
    }
  });

  app.get('/sitemap.xml', (req, res) => {
    const sitemapPath = path.resolve(process.cwd(), 'public', 'sitemap.xml');
    if (fs.existsSync(sitemapPath)) {
      res.type('application/xml').sendFile(sitemapPath);
    } else {
      res.status(404).send('Not Found');
    }
  });

  return app;
}
