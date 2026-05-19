# app/models.py
from typing import Optional, List
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True, nullable=False, unique=True)
    email: Optional[str] = None
    full_name: Optional[str] = None
    hashed_password: str
    is_doctor: bool = False
    age: Optional[int] = None
    gender: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    reset_token: Optional[str] = None
    reset_token_expiry: Optional[datetime] = None

    # backref relationship (optional)
    predictions: List["Prediction"] = Relationship(back_populates="user")

class Prediction(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    patient_id: Optional[str] = Field(default=None, index=True)
    filename: Optional[str] = Field(default=None)   # relative path to uploaded image (optional)
    predicted_label: str
    confidence: float
    created_at: datetime = Field(default_factory=datetime.utcnow, index=True)
    # optional link to user
    user_id: Optional[int] = Field(default=None, foreign_key="user.id")
    user: Optional[User] = Relationship(back_populates="predictions")