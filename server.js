const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'progress.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'));
}
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({}));
}

function readData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return {};
  }
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// GET /progress/:userId — load progress
app.get('/progress/:userId', (req, res) => {
  const data = readData();
  const userId = req.params.userId;
  res.json(data[userId] || { xp: 0, completed: [] });
});

// POST /progress/:userId — save progress
app.post('/progress/:userId', (req, res) => {
  const data = readData();
  const userId = req.params.userId;
  data[userId] = req.body;
  writeData(data);
  res.json({ ok: true });
});

app.listen(PORT, () => console.log(`Python Quest running on port ${PORT}`));
