from datetime import datetime, timedelta
from sqlalchemy import Column, String, Integer, DateTime, Boolean
from app.database import Base

class UserCredits(Base):
    __tablename__ = "user_credits"

    user_id = Column(String, primary_key=True, index=True)
    plan = Column(String, default="free")
    credits_remaining = Column(Integer, default=50)
    credits_total = Column(Integer, default=50)
    reset_date = Column(DateTime, default=lambda: datetime.utcnow() + timedelta(days=30))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "user_id": self.user_id,
            "plan": self.plan,
            "credits_remaining": self.credits_remaining,
            "credits_total": self.credits_total,
            "reset_date": self.reset_date.isoformat() if self.reset_date else None,
        }


class ApiKey(Base):
    __tablename__ = "api_keys"

    id = Column(String, primary_key=True, index=True)
    hashed_key = Column(String, unique=True, index=True)
    user_id = Column(String, index=True)
    name = Column(String)
    credits = Column(Integer, default=50)
    key_prefix = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "key_id": self.id,
            "name": self.name,
            "user_id": self.user_id,
            "credits": self.credits,
            "key_prefix": self.key_prefix,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
