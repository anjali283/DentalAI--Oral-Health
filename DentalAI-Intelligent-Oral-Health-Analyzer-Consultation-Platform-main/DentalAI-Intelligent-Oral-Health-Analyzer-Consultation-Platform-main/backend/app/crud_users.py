# app/crud_users.py
from sqlmodel import Session, select
from app.models import User
from app.auth import hash_password, verify_password
from typing import Optional

def create_user(session: Session, username: str, password: str, email: Optional[str]=None, full_name: Optional[str]=None, is_doctor: bool=False, age=None, gender=None, phone=None, address=None):
    hashed = hash_password(password)
    user = User(username=username, hashed_password=hashed, email=email, full_name=full_name, is_doctor=is_doctor, age=age, gender=gender, phone=phone, address=address)
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

def get_user_by_username(session: Session, username: str) -> Optional[User]:
    stmt = select(User).where(User.username == username)
    res = session.exec(stmt).first()
    return res

def authenticate_user(session: Session, username: str, password: str) -> Optional[User]:
    user = get_user_by_username(session, username)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user
