const express = require(‘express’);
const fs = require(‘fs’);
const path = require(‘path’);

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, ‘data’);
const DATA_FILE = path.join(DATA_DIR, ‘progress.json’);

app.use(express.json());
app.use(express.static(path.join(__dirname, ‘public’)));

if (!fs.existsSync(DATA_DIR)) {
fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(DATA_FILE)) {
fs.writeFileSync(DATA_FILE, JSON.stringify({}));
}

function readData() {
try {
return JSON.parse(fs.readFileSync(DATA_FILE, ‘utf8’));
} catch (e) {
return {};
}
}

function writeData(data) {
fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

app.get(’/progress/:userId’, function(req, res) {
var data = readData();
var userId = req.params.userId;
res.json(data[userId] || { xp: 0, completed: [] });
});

app.post(’/progress/:userId’, function(req, res) {
var data = readData();
var userId = req.params.userId;
data[userId] = req.body;
writeData(data);
res.json({ ok: true });
});

app.get(’*’, function(req, res) {
res.sendFile(path.join(__dirname, ‘public’, ‘index.html’));
});

app.listen(PORT, function() {
console.log(’Python Quest running on port ’ + PORT);
});