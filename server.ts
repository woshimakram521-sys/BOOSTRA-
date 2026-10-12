import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createApiApp } from './server/app';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = createApiApp();
const PORT = process.env.PORT || 3000;

// Serve static frontend files from 'dist' in production
const distPath = path.resolve(__dirname, 'dist');
app.use(express.static(distPath));

// For SPA routing, fallback to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`BOOSTARA production server running on port ${PORT}`);
});
