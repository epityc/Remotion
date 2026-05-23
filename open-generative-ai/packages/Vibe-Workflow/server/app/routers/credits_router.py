from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import UserCredits

router = APIRouter()

PLAN_CREDITS = {
    "free": 50,
    "pro": 1000,
    "enterprise": 5000,
}

PACK_CREDITS = {
    "starter": 200,
    "growth": 750,
    "pro_pack": 2500,
}

@router.get("/credits")
def get_credits(user_id: str, db: Session = Depends(get_db)):
    row = db.query(UserCredits).filter(UserCredits.user_id == user_id).first()
    if not row:
        row = UserCredits(user_id=user_id)
        db.add(row)
        db.commit()
        db.refresh(row)
    return row.to_dict()

@router.post("/credits/deduct")
def deduct_credits(user_id: str, amount: int = 1, db: Session = Depends(get_db)):
    row = db.query(UserCredits).filter(UserCredits.user_id == user_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="User not found")
    if row.credits_remaining < amount:
        raise HTTPException(status_code=402, detail="Insufficient credits")
    row.credits_remaining -= amount
    row.updated_at = datetime.utcnow()
    db.commit()
    return {"credits_remaining": row.credits_remaining}

@router.post("/credits/topup")
def topup_credits(user_id: str, plan: str = None, pack: str = None, db: Session = Depends(get_db)):
    row = db.query(UserCredits).filter(UserCredits.user_id == user_id).first()
    if not row:
        row = UserCredits(user_id=user_id)
        db.add(row)

    if plan and plan in PLAN_CREDITS:
        row.plan = plan
        row.credits_total = PLAN_CREDITS[plan]
        row.credits_remaining = PLAN_CREDITS[plan]
        row.reset_date = datetime.utcnow() + timedelta(days=30)
    elif pack and pack in PACK_CREDITS:
        row.credits_remaining += PACK_CREDITS[pack]
        row.credits_total += PACK_CREDITS[pack]
    else:
        raise HTTPException(status_code=400, detail="Invalid plan or pack")

    row.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(row)
    return row.to_dict()
