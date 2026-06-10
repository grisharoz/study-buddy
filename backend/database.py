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

    conn.commit()
    conn.close()

def get_all_exams():
    conn = sqlite3.connect('study_buddy.db')
    conn.row_factory=sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("""
    SELECT * FROM exams order by date""")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]


def create_exam(module, date,diff):
    conn = sqlite3.connect('study_buddy.db')
    cursor = conn.cursor()
    cursor.execute(
    "INSERT INTO exams (module, date, diff) VALUES (?, ?, ?)",(module, date, diff))
    conn.commit()
    conn.close()

def delete_exam(exam_id):
    conn = sqlite3.connect('study_buddy.db')
    cursor = conn.cursor()
    cursor.execute("DELETE FROM exams WHERE id = ?", (exam_id,))
    conn.commit()
    conn.close()

def update_exam(exam_id, module, date, diff):
    conn = sqlite3.connect('study_buddy.db')
    cursor = conn.cursor()
    cursor.execute(
    "UPDATE exams SET module = ?, date = ?, diff = ? WHERE id = ?", (module, date, diff, exam_id))
    conn.commit()
    conn.close()
