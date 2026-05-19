# scripts/init_db.py
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).resolve().parent.parent))


from app.db import init_db

if __name__ == "__main__":
    init_db()
    print("DB initialized (Postgres)")
