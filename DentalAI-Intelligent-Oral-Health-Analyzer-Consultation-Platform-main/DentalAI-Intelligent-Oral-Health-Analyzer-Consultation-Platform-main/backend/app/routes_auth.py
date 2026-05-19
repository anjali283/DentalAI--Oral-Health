from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlmodel import Session, select
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timedelta
import secrets

from app.db import get_session
from app.crud_users import create_user, authenticate_user, get_user_by_username
from app.auth import create_access_token, decode_access_token, hash_password
from app.models import User

router = APIRouter(prefix="/auth", tags=["auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")

# ===================== SCHEMAS =====================

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class RegisterIn(BaseModel):
    username: str
    password: str
    email: Optional[str] = None
    full_name: Optional[str] = None
    is_doctor: bool = False
    age: Optional[int] = None
    gender: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

# ===================== REGISTER =====================

@router.post("/register", response_model=dict)
def register(data: RegisterIn, session: Session = Depends(get_session)):

    if len(data.password) > 72:
        raise HTTPException(status_code=400, detail="Password too long")

    if get_user_by_username(session, data.username):
        raise HTTPException(status_code=400, detail="Username already taken")

    user = create_user(
        session,
        data.username,
        data.password,
        data.email,
        data.full_name,
        data.is_doctor
    )

    return {"id": user.id, "username": user.username}

# ===================== LOGIN =====================

@router.post("/token", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):

    user = authenticate_user(session, form_data.username, form_data.password)

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({
        "sub": str(user.id),
        "username": user.username,
        "is_doctor": user.is_doctor
    })

    return {"access_token": token, "token_type": "bearer"}

# ===================== CURRENT USER =====================

def get_current_user(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)) -> User:

    payload = decode_access_token(token)

    if not payload:
        raise HTTPException(status_code=401, detail="Invalid authentication")

    user_id = int(payload.get("sub"))
    user = session.get(User, user_id)

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user

def require_doctor(current_user: User = Depends(get_current_user)):
    if not current_user.is_doctor:
        raise HTTPException(status_code=403, detail="Doctor access required")
    return current_user

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "is_doctor": current_user.is_doctor
    }

# ===================== FORGOT PASSWORD =====================

@router.post("/forgot-password")
def forgot_password(email: str, session: Session = Depends(get_session)):

    print("EMAIL RECEIVED:", email)

    user = session.exec(select(User).where(User.email == email)).first()

    if not user:
        return {"message": "If email exists, reset link sent"}

    token = secrets.token_urlsafe(32)

    user.reset_token = token
    user.reset_token_expiry = datetime.utcnow() + timedelta(minutes=15)

    session.add(user)
    session.commit()

    print(f"RESET LINK: http://localhost:3000/reset-password?token={token}")

    return {"message": "Reset link generated"}

# ===================== RESET PASSWORD =====================

@router.post("/reset-password")
def reset_password(data: ResetPasswordRequest, session: Session = Depends(get_session)):

    user = session.exec(
        select(User).where(User.reset_token == data.token)
    ).first()

    if not user:
        raise HTTPException(status_code=400, detail="Invalid token")

    if not user.reset_token_expiry or user.reset_token_expiry < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Token expired")

    user.password_hash = hash_password(data.new_password)

    user.reset_token = None
    user.reset_token_expiry = None

    session.add(user)
    session.commit()

    return {"message": "Password updated"}