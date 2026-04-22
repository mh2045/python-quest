# PythonQuest 🐍

An interactive Python learning game with 14 lessons, cloud-saved progress, and a mobile-friendly UI.

## Lessons

### 🐣 Beginner — Foundations

|#|Topic         |XP|
|-|--------------|--|
|1|Print & Output|60|
|2|Variables     |60|
|3|Data Types    |70|
|4|User Input    |70|
|5|Conditionals  |80|
|6|Loops         |80|
|7|Lists         |80|
|8|Functions     |90|

### 🐍 Intermediate — Core Python

|# |Topic         |XP |
|--|--------------|---|
|9 |Dictionaries  |90 |
|10|String Methods|90 |
|11|Error Handling|100|

### 🚀 Advanced — Pythonic Code

|# |Topic              |XP |
|--|-------------------|---|
|12|List Comprehensions|100|
|13|Modules & Imports  |100|
|14|Classes & OOP      |120|

**Total XP: 1,170**

-----

## Project Structure

```
python-quest/
├── server.js          ← Express backend (progress save/load)
├── package.json
├── README.md
├── .gitignore
└── public/
    ├── index.html     ← App shell and styles
    ├── lessons.js     ← All 14 lessons
    └── app.js         ← Game logic
```

-----

## Deploy to Render

### 1. Push to GitHub

- Create a new repo on github.com (name it `python-quest`)
- Upload all files, keeping the folder structure intact

### 2. Create a Render Web Service

- Go to render.com → New → Web Service
- Connect your GitHub repo
- Use these settings:

|Setting              |Value           |
|---------------------|----------------|
|Runtime              |Node            |
|Build Command        |`npm install`   |
|Start Command        |`node server.js`|
|Environment Variables|None needed     |

- Click **Create Web Service** — deploys in ~60 seconds

### 3. Play

- Render gives you a URL like `https://python-quest.onrender.com`
- Open it in Safari on your iPhone and bookmark it
- Enter your name on first visit — **use the same name every time** to load saved progress

-----

## How Progress Saving Works

- Progress is saved by username (lowercased, spaces converted to underscores)
- Stored server-side in `data/progress.json`
- Works on any device or browser as long as you use the same name
- The `data/` folder is excluded from Git via `.gitignore`

-----

## iPhone Tips

- Turn off **Smart Punctuation** (Settings → General → Keyboard) to avoid curly quote issues when typing code challenges
- Bookmark the Render URL in Safari for quick access
