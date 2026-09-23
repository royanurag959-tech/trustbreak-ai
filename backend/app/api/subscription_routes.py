import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.subscription import Subscription
from app.schemas.subscription import SubscriptionResponse, SubscriptionUpgrade
from app.security.auth import get_current_user

router = APIRouter(prefix="/api/subscription", tags=["Subscription"])

PRICE_MAP = {
    "free": 0.0,
    "pro": 49.0,
    "business": 149.0,
    "enterprise": 499.0
}

@router.get("", response_model=SubscriptionResponse)
def get_user_subscription(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    sub = db.query(Subscription).filter(Subscription.user_id == current_user.id).order_by(Subscription.id.desc()).first()
    if not sub:
        sub = Subscription(
            user_id=current_user.id,
            plan="free",
            status="active",
            price_monthly=0.0
        )
        db.add(sub)
        db.commit()
        db.refresh(sub)
    return sub

@router.post("/upgrade", response_model=SubscriptionResponse)
def upgrade_subscription(
    upgrade: SubscriptionUpgrade,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    plan_name = upgrade.plan.lower()
    if plan_name not in PRICE_MAP:
        raise HTTPException(status_code=400, detail="Invalid subscription tier")
    
    sub = db.query(Subscription).filter(Subscription.user_id == current_user.id).order_by(Subscription.id.desc()).first()
    if not sub:
        sub = Subscription(user_id=current_user.id)
        db.add(sub)
    
    sub.plan = plan_name
    sub.price_monthly = PRICE_MAP[plan_name]
    sub.status = "active"
    sub.start_date = datetime.datetime.utcnow()
    db.commit()
    db.refresh(sub)
    return sub
