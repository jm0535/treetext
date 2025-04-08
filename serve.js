// Simple Express server to serve the built application with proper MIME types
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createServer } from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 5000;

// Serve static files from the dist directory
app.use(express.static(join(__dirname, 'dist'), {
  setHeaders: (res, filePath) => {
    // Set proper MIME types for JavaScript modules
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

// Handle all routes by serving index.html (for client-side routing)
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

const server = createServer(app);

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
