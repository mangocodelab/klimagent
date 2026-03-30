import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const app = express();

// Serve the static files from the React app
app.use(express.static('dist'));

// Catch all requests that don't match the above and return the index.html file
app.get('*', (req, res) => {
  res.sendFile(join(dirname(fileURLToPath(import.meta.url)), 'dist', 'index.html'));
});

export default app;