# PythonQuest 🐍

An interactive Python learning game with cloud-saved progress.

## Deploy to Render

### 1. Push to GitHub
- Create a new repo on github.com (name it `python-quest`)
- Upload all these files to it

### 2. Create a Render Web Service
- Go to render.com → New → Web Service
- Connect your GitHub repo
- Use these settings:
  - **Name:** python-quest (or whatever you like)
  - **Runtime:** Node
  - **Build Command:** `npm install`
  - **Start Command:** `node server.js`
- Click **Create Web Service**

### 3. Play!
- Render gives you a URL like `https://python-quest-xxxx.onrender.com`
- Bookmark that on your iPhone
- Enter your name on first visit — use the same name every time to keep your progress

## How progress saving works
- Progress is saved by name (lowercased, spaces → underscores)
- Stored in `data/progress.json` on the server
- Always use the same name to retrieve your progress
