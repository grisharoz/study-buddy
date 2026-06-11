# Study Buddy

Exam preparation tracker with progress visualization and panic mode alerts.

## Stack

- **Backend**: FastAPI (Python 3.11) + SQLite
- **Frontend**: Vanilla HTML, CSS, JS
- **Deployment**: Railway (API), GitHub Pages (frontend)

## Features

- Multi-user support (username-based sessions stored in localStorage)
- CRUD for exams (module, date, difficulty)
- Preparation progress bar with color coding (green → amber → red)
- Panic mode — exam cards glow red when time is low (easy: 3d, medium: 5d, hard: 7d)
- Stats overview: total exams, panic count, completed
- Animated onboarding tutorial

## API

All endpoints require a `?user=` query parameter.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/exams?user={name}` | List exams for user |
| POST | `/exams?user={name}` | Create exam (JSON: `module`, `date`, `diff`) |
| PUT | `/exams/{id}?user={name}` | Update exam |
| DELETE | `/exams/{id}?user={name}` | Delete exam |

## Quick Start

```zsh
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Open `docs/index.html` in a browser or serve via:

```zsh
python3 -m http.server 5500 --directory docs
```

## Environment

- `DB_PATH` — path to SQLite file (default: `study_buddy.db`)
