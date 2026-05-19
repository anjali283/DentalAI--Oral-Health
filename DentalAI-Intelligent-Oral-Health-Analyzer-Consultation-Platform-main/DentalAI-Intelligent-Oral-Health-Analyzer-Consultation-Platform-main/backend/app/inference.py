# app/inference.py
from typing import List, Tuple
from io import BytesIO
from pathlib import Path
import torch
import torchvision.transforms as T
from PIL import Image
import traceback

# Try to import config values if present
try:
    from app.config import IMAGE_SIZE, CLASS_NAMES, DEVICE, MODEL_PATH
except Exception:
    # sensible defaults if you don't have config.py
    IMAGE_SIZE = 224
    CLASS_NAMES = ["calculus", "caries", "gingivitis", "mouth_ulcer"]
    DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
    MODEL_PATH = Path(__file__).resolve().parent.parent / "models" / "dental_cavity_model.pt"

MODEL_PATH = Path(MODEL_PATH)

# ImageNet normalization (common)
IMAGENET_MEAN = [0.485, 0.456, 0.406]
IMAGENET_STD  = [0.229, 0.224, 0.225]

# Build transforms used at inference (must match training eval transforms)
_eval_transforms = T.Compose([
    T.Resize((int(IMAGE_SIZE[0]) if isinstance(IMAGE_SIZE, (list,tuple)) else int(IMAGE_SIZE),
          int(IMAGE_SIZE[1]) if isinstance(IMAGE_SIZE, (list,tuple)) else int(IMAGE_SIZE))),

    T.ToTensor(),
    T.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD),
])

_model = None

def _load_model():
    global _model
    if _model is not None:
        return _model

    device = torch.device(DEVICE)
    # create a ResNet34 backbone (common in examples). Adapt if you used different arch.
    try:
        import torchvision.models as models
        model = models.resnet34(pretrained=False)
        num_ftrs = model.fc.in_features
        model.fc = torch.nn.Linear(num_ftrs, len(CLASS_NAMES))
        # try load state_dict
        state = torch.load(MODEL_PATH, map_location=device)
        if isinstance(state, dict) and "state_dict" in state:
            # some checkpoint wrappers store under 'state_dict'
            state = state["state_dict"]
        try:
            model.load_state_dict(state)
        except Exception:
            # if direct load fails, try that the file is a complete model object
            try:
                model = torch.load(MODEL_PATH, map_location=device)
            except Exception as e2:
                raise RuntimeError(f"Failed to load model state: {e2}") from e2
        model.to(device)
        model.eval()
        _model = model
        return _model
    except Exception as e:
        traceback.print_exc()
        raise RuntimeError("Failed to load model. Check MODEL_PATH and model format.") from e

def _prepare_image(data: bytes) -> torch.Tensor:
    img = Image.open(BytesIO(data)).convert("RGB")
    x = _eval_transforms(img)
    return x.unsqueeze(0)  # add batch dim

def predict_from_bytes(data: bytes) -> Tuple[str, float]:
    """
    Returns (label, confidence)
    """
    model = _load_model()
    device = next(model.parameters()).device
    x = _prepare_image(data).to(device)

    with torch.no_grad():
        out = model(x)                               # shape: (1, num_classes) typically
        probs = torch.nn.functional.softmax(out, dim=1)

        # --- Make probs explicitly 1-D vector of class probabilities ---
        # e.g. convert from shape (1, C) -> (C,)
        probs = probs.squeeze(0)

        # get predicted index and confidence as plain Python types
        idx = int(probs.argmax().item())
        conf = float(probs[idx].item())

        label = CLASS_NAMES[idx]
        return label, conf


def predict_top3_from_bytes(data: bytes) -> List[Tuple[str, float]]:
    """
    Returns list of (label, confidence) sorted desc (top 3)
    """
    model = _load_model()
    device = next(model.parameters()).device
    x = _prepare_image(data).to(device)
    with torch.no_grad():
        out = model(x)
        probs = torch.nn.functional.softmax(out, dim=1).squeeze(0)
        topk = torch.topk(probs, k=min(3, probs.shape[0]))
        labels = [CLASS_NAMES[int(i.item())] for i in topk.indices]
        confidences = [float(v.item()) for v in topk.values]
        return list(zip(labels, confidences))



