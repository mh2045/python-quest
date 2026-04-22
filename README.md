# PythonQuest 🐍

An interactive Python learning game with 14 lessons, cloud-saved progress via Supabase, hosted on GitHub Pages.

## Lessons

### 🐣 Beginner — Foundations
| # | Topic | XP |
|---|-------|----|
| 1 | Print & Output | 60 |
| 2 | Variables | 60 |
| 3 | Data Types | 70 |
| 4 | User Input | 70 |
| 5 | Conditionals | 80 |
| 6 | Loops | 80 |
| 7 | Lists | 80 |
| 8 | Functions | 90 |

### 🐍 Intermediate — Core Python
| # | Topic | XP |
|---|-------|----|
| 9 | Dictionaries | 90 |
| 10 | String Methods | 90 |
| 11 | Error Handling | 100 |

### 🚀 Advanced — Pythonic Code
| # | Topic | XP |
|---|-------|----|
| 12 | List Comprehensions | 100 |
| 13 | Modules & Imports | 100 |
| 14 | Classes & OOP | 120 |

**Total XP: 1,170**

---

## Project Structure

```
python-quest/
├── index.html     ← App shell and styles
├── lessons.js     ← All 14 lessons
├── app.js         ← Game logic + Supabase integration
└── README.md
```

No server required. This is a fully static site hosted on GitHub Pages.

---

## Deploy to GitHub Pages

### 1. Push files to GitHub
All three files (index.html, lessons.js, app.js) must be in the root of the repo.

### 2. Enable GitHub Pages
- Go to your repo → Settings → Pages
- Under Source, select Deploy from a branch
- Set branch to main and folder to / (root)
- Click Save

### 3. Access your game
GitHub gives you a URL like https://yourusername.github.io/python-quest

Open it in Safari on your iPhone and bookmark it.

---

## Progress Saving (Supabase)

Progress saves to Supabase by username and works across all devices and browsers.

### Setup — create the table
In Supabase dashboard → SQL Editor, run:

```sql
create table progress (
  username text primary key,
  xp integer default 0,
  completed integer[] default '{}'
);
```

The Supabase URL and anon key are already configured in app.js.

### How it works
- Progress is saved by username (lowercased, spaces become underscores)
- Use the same name on every device to load your saved progress
- No account required beyond entering your name in the game

---

## iPhone Tips

- Turn off Smart Punctuation in Settings → General → Keyboard to avoid curly quote issues when typing code challenges
- Bookmark the GitHub Pages URL in Safari for quick access
