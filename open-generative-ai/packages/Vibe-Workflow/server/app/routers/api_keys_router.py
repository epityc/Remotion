import secrets
import hashlib
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database import get_db
from app.models import ApiKey

router = APIRouter()

def _hash_key(key: str) -> str:
    return hashlib.sha256(key.encode()).hexdigest()

def _get_key_record(x_api_key: str = Header(...), db: Session = Depends(get_db)) -> ApiKey:
    hashed = _hash_key(x_api_key)
    record = db.query(ApiKey).filter(ApiKey.hashed_key == hashed, ApiKey.is_active == True).first()
    if not record:
        raise HTTPException(status_code=401, detail="Invalid or inactive API key")
    if record.credits <= 0:
        raise HTTPException(status_code=402, detail="Insufficient credits on this API key")
    return record

class CreateKeyRequest(BaseModel):
    name: str
    user_id: str

@router.post("/keys")
def create_api_key(body: CreateKeyRequest, db: Session = Depends(get_db)):
    raw_key = "kv_" + secrets.token_urlsafe(32)
    hashed = _hash_key(raw_key)
    key_id = secrets.token_hex(8)
    record = ApiKey(
        id=key_id,
        hashed_key=hashed,
        user_id=body.user_id,
        name=body.name,
        credits=50,
        key_prefix=raw_key[:8],
    )
    db.add(record)
    db.commit()
    return {
        "key_id": key_id,
        "api_key": raw_key,
        "name": body.name,
        "credits": 50,
        "message": "Store this key securely — it will not be shown again.",
    }

@router.get("/keys")
def list_api_keys(user_id: str, db: Session = Depends(get_db)):
    records = db.query(ApiKey).filter(ApiKey.user_id == user_id).all()
    return [r.to_dict() for r in records]

@router.delete("/keys/{key_id}")
def delete_api_key(key_id: str, db: Session = Depends(get_db)):
    record = db.query(ApiKey).filter(ApiKey.id == key_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Key not found")
    record.is_active = False
    db.commit()
    return {"deleted": True}

@router.get("/keys/balance")
def get_balance(record: ApiKey = Depends(_get_key_record)):
    return {"credits": record.credits, "key_id": record.id, "name": record.name}

@router.post("/keys/deduct")
def deduct_key_credits(amount: int = 1, record: ApiKey = Depends(_get_key_record), db: Session = Depends(get_db)):
    if record.credits < amount:
        raise HTTPException(status_code=402, detail="Insufficient credits")
    record.credits -= amount
    db.commit()
    return {"credits_remaining": record.credits}
