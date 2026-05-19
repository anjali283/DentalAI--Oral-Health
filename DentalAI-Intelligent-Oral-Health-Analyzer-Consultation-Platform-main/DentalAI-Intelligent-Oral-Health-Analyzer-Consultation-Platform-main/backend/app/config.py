from pathlib import Path
import torch

BASE_DIR = Path(__file__).resolve().parent.parent
DATASET_DIR = BASE_DIR.parent / "dataset"

MODEL_DIR = BASE_DIR / "models"
MODEL_DIR.mkdir(exist_ok=True, parents=True)

MODEL_PATH = MODEL_DIR / "dental_cavity_model.pt"

CLASS_NAMES = ["calculus", "caries", "gingivitis", "mouth_ulcer"]

IMAGE_SIZE = (224, 224)

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
