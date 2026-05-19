from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from pathlib import Path
from uuid import uuid4
import traceback

from sqlmodel import Session

from app.db import init_db, get_session
from app import crud
from app.inference import predict_from_bytes, predict_top3_from_bytes
from app.models import Prediction

from app.routes_auth import router as auth_router
from app.routes_dashboard import router as dash_router


# --- setup ---
ROOT = Path(__file__).resolve().parent.parent
UPLOADS_DIR = ROOT / "uploads"
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)

app = FastAPI(title="Dental Cavity Classifier", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    try:
        init_db()
    except Exception:
        traceback.print_exc()


# --- Health ---
@app.get("/health")
def health():
    return {"status": "ok"}


# --- Helpers ---
async def _save_upload_file(upload: UploadFile, data_bytes: Optional[bytes] = None) -> str:
    ext = Path(upload.filename).suffix or ".jpg"
    dest_name = f"{uuid4().hex}{ext}"
    dest_path = UPLOADS_DIR / dest_name

    contents = data_bytes if data_bytes else await upload.read()

    with open(dest_path, "wb") as f:
        f.write(contents)

    return str(dest_path.relative_to(ROOT).as_posix())

def generate_dental_report(label: str, confidence: float):
    confidence_percent = round(confidence * 100, 2)

    if label == "caries":
        if confidence > 0.9:
            severity = "High"
            recommendation = "Immediate dental treatment required"
            follow_up = "Visit dentist within 1 week"
        elif confidence > 0.7:
            severity = "Moderate"
            recommendation = "Dental checkup and possible filling"
            follow_up = "Visit dentist within 1 month"
        else:
            severity = "Low"
            recommendation = "Maintain oral hygiene"
            follow_up = "Routine checkup"

        return {
            "condition": "Dental Caries",
            "confidence": confidence_percent,
            "severity": severity,
            "recommendation": recommendation,
            "advice": "Brush twice daily, avoid sugary foods",
            "follow_up": follow_up
        }

    return {
        "condition": label,
        "confidence": confidence_percent,
        "severity": "Unknown",
        "recommendation": "Consult dentist",
        "advice": "",
        "follow_up": ""
    }



# FIXED PREDICT ENDPOINT
@app.post("/predict")
async def predict(
    file: UploadFile = File(...),
    patient_id: Optional[str] = None
):
    try:
        data = await file.read()

        preds = predict_from_bytes(data)

        print("RAW MODEL OUTPUT:", preds)  # 🔥 DEBUG

        label = None
        confidence = None

       
       # Normalize preds into (label, confidence)

        if isinstance(preds, tuple) and len(preds) == 2:
    # Correct case: (label, confidence)
          label, confidence = preds[0], float(preds[1])
          report = generate_dental_report(label, confidence)

        elif isinstance(preds, list) and len(preds) > 0:
          first = preds[0]
    
          if isinstance(first, (list, tuple)) and len(first) >= 2:
           label, confidence = first[0], float(first[1])
          else:
           label = str(first)
           confidence = 1.0

        else:
          label = str(preds)
          confidence = 1.0

        # 🔥 FORCE SAFE VALUES
        if confidence is None:
            confidence = 0.0

        try:
            confidence = float(confidence)
        except:
            confidence = 0.0

        # clamp between 0 and 1
        confidence = max(0.0, min(confidence, 1.0))
        confidence = max(0.0, min(confidence, 1.0))
        confidence = round(confidence, 4)

        label = str(label)

        print("FINAL OUTPUT:", label, confidence)  # 🔥 DEBUG

        # save file
        saved_rel_path = await _save_upload_file(file, data_bytes=data)

        saved = crud.save_prediction(
            predicted_label=label,
            confidence=confidence,
            patient_id=patient_id,
            filename=saved_rel_path
        )

        return {
       "class": label,
       "confidence": confidence,
       "report": report,
       "saved_id": saved.id,
       "file": saved_rel_path
}

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Inference failed: {e}")


# --- TOP 3 ---
@app.post("/predict_top3")
async def predict_top3(file: UploadFile = File(...), patient_id: Optional[str] = None):
    try:
        data = await file.read()

        preds = predict_top3_from_bytes(data)

        saved_rel_path = await _save_upload_file(file, data_bytes=data)

        top_label, top_conf = preds[0]

        saved = crud.save_prediction(
            predicted_label=top_label,
            confidence=float(top_conf),
            patient_id=patient_id,
            filename=saved_rel_path
        )

        return {
            "predictions": [
                {"label": p[0], "confidence": float(p[1])} for p in preds
            ],
            "saved_id": saved.id,
            "file": saved_rel_path
        }

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Inference failed: {e}")


# --- LIST ---
@app.get("/predictions")
def list_predictions(limit: int = 50, session: Session = Depends(get_session)):
    rows = session.query(Prediction).order_by(Prediction.timestamp.desc()).limit(limit).all()

    return [
        {
            "id": r.id,
            "filename": r.filename,
            "predicted_class": r.predicted_class,
            "confidence": float(r.confidence),
            "timestamp": r.timestamp.isoformat()
        }
        for r in rows
    ]


# --- STATS ---
@app.get("/stats")
def stats(session: Session = Depends(get_session)):
    rows = session.query(Prediction.predicted_class).all()

    counts = {}
    for (label,) in rows:
        counts[label] = counts.get(label, 0) + 1

    return counts


app.include_router(auth_router)
app.include_router(dash_router)