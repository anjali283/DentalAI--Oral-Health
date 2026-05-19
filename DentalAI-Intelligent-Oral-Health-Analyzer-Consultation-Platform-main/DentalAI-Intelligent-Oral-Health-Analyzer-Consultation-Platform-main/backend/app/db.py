# app/db.py
from sqlmodel import SQLModel, create_engine, Session
import os
from pathlib import Path
from dotenv import load_dotenv
from sqlmodel import SQLModel, Field, create_engine, Session
from datetime import datetime
from app.models import Prediction

ROOT = Path(__file__).resolve().parent.parent
dotenv_path = ROOT / ".env"
if dotenv_path.exists():
    load_dotenv(dotenv_path)

# Read DB credentials from env (with safe defaults for dev)
DB_USER = os.getenv("DB_USER")
DB_PASS = os.getenv("DB_PASS")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME")

DATABASE_URL = "postgresql+psycopg2://dental_user:Singh007@localhost:5432/dental_ai"


# SQLModel engine
engine = create_engine(DATABASE_URL, echo=False)

# class Prediction(SQLModel, table=True):
#     id: int = Field(default=None, primary_key=True)
#     filename: str
#     predicted_class: str
#     confidence: float
#     timestamp: datetime = Field(default_factory=datetime.utcnow)

def init_db():
    # IMPORTANT: import models so SQLModel knows them
    from app import models  
    SQLModel.metadata.create_all(engine)

def get_session():
    """
    Use this to get a session: with get_session() as session: ...
    """
    return Session(engine)
