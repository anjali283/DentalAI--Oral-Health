# app/routes_dashboard.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select
from typing import List, Optional
from app.db import get_session
from app.models import Prediction
from app.routes_auth import get_current_user, require_doctor
from app.models import User

router = APIRouter(prefix="", tags=["dashboard"])

# patient: list own predictions
@router.get("/patient/predictions")
def patient_predictions(limit: int = 50, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    stmt = select(Prediction).where(Prediction.user_id == current_user.id).order_by(Prediction.timestamp.desc()).limit(limit)
    rows = session.exec(stmt).all()
    return rows

# doctor: list all predictions with pagination & optional class filter
@router.get("/doctor/predictions")
def doctor_predictions(
    class_name: Optional[str] = Query(None),
    limit: int = 50,
    offset: int = 0,
    session: Session = Depends(get_session),
    _doctor = Depends(require_doctor)
):
    stmt = select(Prediction)
    if class_name:
        stmt = stmt.where(Prediction.predicted_class == class_name)
    stmt = stmt.order_by(Prediction.timestamp.desc()).offset(offset).limit(limit)
    rows = session.exec(stmt).all()
    return rows

# doctor: stats (counts per class)
@router.get("/doctor/stats")
def doctor_stats(session: Session = Depends(get_session), _doctor = Depends(require_doctor)):
    stmt = select(Prediction.predicted_class)
    rows = session.exec(stmt).all()
    counts = {}
    for (label,) in rows:
        counts[label] = counts.get(label, 0) + 1
    return counts
