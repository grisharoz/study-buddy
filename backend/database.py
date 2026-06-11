import sqlite3

def init_db():
    conn = sqlite3.connect('study_buddy.db')
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS exams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    module TEXT NOT NULL,
    date DATETIME NOT NULL,
    diff TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
    ) """)

    # Migration: add username column if missing
    cursor.execute("PRAGMA table_info(exams)")
    columns = [col[1] for col in cursor.fetchall()]
    if 'username' not in columns:
        cursor.execute("ALTER TABLE exams ADD COLUMN username TEXT NOT NULL DEFAULT 'Legacy'")
    # Migration: assign old NULL/empty usernames to 'Legacy'
    cursor.execute("UPDATE exams SET username = 'Legacy' WHERE username IS NULL OR username = ''")
    conn.commit()
    conn.close()

def get_all_exams(username):
    conn = sqlite3.connect('study_buddy.db')
    conn.row_factory=sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("""
    SELECT * FROM exams WHERE username = ? ORDER BY date""", (username,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

def create_exam(username, module, date, diff):
    conn = sqlite3.connect('study_buddy.db')
    cursor = conn.cursor()
    cursor.execute(
    "INSERT INTO exams (username, module, date, diff) VALUES (?, ?, ?, ?)",(username, module, date, diff))
    conn.commit()
    conn.close()

def delete_exam(exam_id, username):
    conn = sqlite3.connect('study_buddy.db')
    cursor = conn.cursor()
    cursor.execute("DELETE FROM exams WHERE id = ? AND username = ?", (exam_id, username))
    conn.commit()
    conn.close()

def update_exam(exam_id, username, module, date, diff):
    conn = sqlite3.connect('study_buddy.db')
    cursor = conn.cursor()
    cursor.execute(
    "UPDATE exams SET module = ?, date = ?, diff = ? WHERE id = ? AND username = ?", (module, date, diff, exam_id, username))
    conn.commit()
    conn.close()


