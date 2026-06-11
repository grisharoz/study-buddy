# Study Buddy

Study Buddy is a simple time management and exam preparation tracking tool.

The repository contains a FastAPI backend and a static frontend (HTML/CSS/JS) located in the `docs/` directory.

Key files
- `backend/main.py` — FastAPI API (CRUD operations for exams)
- `backend/database.py` — SQLite helper
- `backend/requirements.txt` — Backend dependencies
- `docs/` — Frontend (index.html, app.js, styles.css)



Quick start (local)

1) Navigate to the backend folder and create a virtual environment:

```zsh
cd /Users/macbookair/Desktop/study-buddy/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

2) Start the server:

```zsh
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

3) Open the frontend:
- Simple method: Open `docs/index.html` in your browser (if the frontend uses relative API paths, ensure the API address matches).
- Recommended method: Serve static files using a simple server, for example:

```zsh
# from the project root
python3 -m http.server 5500 --directory docs
# then open http://127.0.0.1:5500
```

Environment variables
- `DB_PATH` — Path to the SQLite file (default: `study_buddy.db`). Removing `.idea/` from the repository (if already committed)

```zsh
# add .idea/ to .gitignore (already done)
git rm -r --cached .idea
git commit -m "Remove .idea from repository"
git push
```

API (main endpoints)
- GET /exams — list of exams
- POST /exams — create (JSON: module, date(YYYY-MM-DD), diff)
- PUT /exams/{id} — update
- DELETE /exams/{id} — delete