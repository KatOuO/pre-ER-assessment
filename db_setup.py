import sqlite3
import os
import json
from datetime import datetime

os.makedirs("data", exist_ok=True)

conn = sqlite3.connect("data/triage_submissions.db")
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT,
    age INTEGER,
    symptoms TEXT,
    followup TEXT,
    prediction INTEGER,
    meaning TEXT,
    confidence REAL,
    override_reason TEXT
)
""")

conn.commit()
conn.close()
