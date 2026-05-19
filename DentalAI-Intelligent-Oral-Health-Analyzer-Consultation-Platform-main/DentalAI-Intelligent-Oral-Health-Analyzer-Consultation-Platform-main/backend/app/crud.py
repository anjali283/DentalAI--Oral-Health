# app/crud.py
from typing import List, Dict
from sqlmodel import select
from .models import Prediction
from .db import get_session

def save_prediction(predicted_label: str, confidence: float, patient_id: str = None, filename: str = None) -> Prediction:
    with get_session() as session:
        p = Prediction(patient_id=patient_id, filename=filename, predicted_label=predicted_label, confidence=confidence)
        session.add(p)
        session.commit()
        session.refresh(p)
        return p

def get_recent(limit: int = 20) -> List[Prediction]:
    with get_session() as session:
        statement = select(Prediction).order_by(Prediction.created_at.desc()).limit(limit)
        results = session.exec(statement).all()
        return results

def get_stats() -> Dict[str, int]:
    with get_session() as session:
        statement = select(Prediction.predicted_label)
        labels = [r[0] for r in session.exec(statement).all()]
    stats = {}
    for l in labels:
        stats[l] = stats.get(l, 0) + 1
    return stats
