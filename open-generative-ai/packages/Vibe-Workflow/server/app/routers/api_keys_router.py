import os
import secrets
import hashlib
from datetime import datetime
from fastapi import APIRouter, HTTPException, Header, Depends
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

# In-memory store (replace with DB in production)
_api_keys: dict[str, dict] = {}

def _hash_key(key: str) -> str:
    return hashlib.sha256(key.encode()).hexdigest()

def _get_key_data(api_key: str = Header(..., alias="X-API-Key")) -> dict:
    hashed = _hash_key(api_key)
    data = _api_keys.get(hashed)
    if not data:
        raise HTTPException(status_code=401, detail="Invalid API key")
    if data["credits"] <= 0:
        raise HTTPException(status_code=402, detail="Insufficient credits")
    return data

class CreateKeyRequest(BaseModel):
    name: str
    user_id: str

class KeyResponse(BaseModel):
    key_id: str
    name: str
    user_id: str
    credits: int
    created_at: str
    key_prefix: str

@router.post("/keys", response_model=dict)
async def create_api_key(body: CreateKeyRequest):
    raw_key = "kv_" + secrets.token_urlsafe(32)
    hashed = _hash_key(raw_key)
    key_id = secrets.token_hex(8)
    _api_keys[hashed] = {
        "key_id": key_id,
        "name": body.name,
        "user_id": body.user_id,
        "credits": 50,  # Free tier default
        "created_at": datetime.utcnow().isoformat(),
        "key_prefix": raw_key[:8],
    }
    return {
        "key_id": key_id,
        "api_key": raw_key,  # Only returned once
        "name": body.name,
        "credits": 50,
        "message": "Store this key securely — it will not be shown again.",
    }

@router.get("/keys", response_model=list)
async def list_api_keys(user_id: str):
    return [
        {**v, "key_id": v["key_id"]}
        for v in _api_keys.values()
        if v["user_id"] == user_id
    ]

@router.delete("/keys/{key_id}")
async def delete_api_key(key_id: str):
    to_delete = [h for h, v in _api_keys.items() if v["key_id"] == key_id]
    if not to_delete:
        raise HTTPException(status_code=404, detail="Key not found")
    for h in to_delete:
        del _api_keys[h]
    return {"deleted": True}

@router.get("/keys/balance")
async def get_balance(key_data: dict = Depends(_get_key_data)):
    return {
        "credits": key_data["credits"],
        "key_id": key_data["key_id"],
        "name": key_data["name"],
    }

@router.post("/keys/deduct")
async def deduct_credits(amount: int = 1, key_data: dict = Depends(_get_key_data)):
    hashed = _hash_key  # Can't reverse — update by scanning
    for h, v in _api_keys.items():
        if v["key_id"] == key_data["key_id"]:
            if v["credits"] < amount:
                raise HTTPException(status_code=402, detail="Insufficient credits")
            v["credits"] -= amount
            return {"credits_remaining": v["credits"]}
    raise HTTPException(status_code=404, detail="Key not found")
