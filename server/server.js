import express from 'express';
import cors from 'cors';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from React build
app.use(express.static(join(__dirname, '../client/dist')));

// API Routes
app.get('/api/camps', (req, res) => {
  try {
    const campsData = JSON.parse(
      readFileSync(join(__dirname, '../camps-data.json'), 'utf8')
    );
    res.json(campsData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load camps data' });
  }
});

app.get('/api/school-districts', (req, res) => {
  try {
    const districtData = JSON.parse(
      readFileSync(join(__dirname, '../school-district-camps.json'), 'utf8')
    );
    res.json(districtData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load school district data' });
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
