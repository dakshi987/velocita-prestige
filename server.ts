import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { apiRouter } from './server/api.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use('/api', apiRouter);

// Serve static assets from build
const distPath = path.resolve(__dirname, 'dist');
const publicImagesPath = path.resolve(__dirname, 'public/images');
const srcImagesPath = path.resolve(__dirname, 'src/assets/images');

// Static routes for direct and legacy image requests
app.use('/images', express.static(publicImagesPath));
app.use('/src/assets/images', express.static(srcImagesPath));
app.use('/src/assets/images', express.static(publicImagesPath));
app.use(express.static(distPath));

// Fallback to index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Velocita Server running on port ${PORT}`);
});
