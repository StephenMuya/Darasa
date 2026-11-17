"""
Root wrapper for ingestion/seed_db.py.
Forwards execution to backend/ingestion/seed_db.py.
"""
from pathlib import Path
import sys

_backend_dir = Path(__file__).resolve().parent.parent / "backend"
if str(_backend_dir) not in sys.path:
    sys.path.insert(0, str(_backend_dir))

from ingestion.seed_db import main, seed_database_from_json

if __name__ == "__main__":
    main()
