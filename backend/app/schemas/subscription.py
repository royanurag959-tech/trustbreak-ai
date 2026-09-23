import datetime
from typing import Optional
from pydantic import BaseModel

class SubscriptionResponse(BaseModel):
    id: int
    user_id: int
    plan: str
    status: str
    price_monthly: float
    start_date: datetime.datetime
    end_date: Optional[datetime.datetime] = None

    class Config:
        from_attributes = True

class SubscriptionUpgrade(BaseModel):
    plan: str # 'pro', 'business', 'enterprise'

class NotificationResponse(BaseModel):
    id: int
    user_id: int
    title: str
    message: str
    read: bool
    type: str
    created_at: datetime.datetime

    class Config:
        from_attributes = True
