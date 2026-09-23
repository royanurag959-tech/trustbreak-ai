import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Policy(Base):
    __tablename__ = "policies"

    id = Column(Integer, primary_key=True, index=True)
    agent_id = Column(Integer, ForeignKey("agents.id"), nullable=False)
    policy_name = Column(String(150), nullable=False)
    resource = Column(String(150), nullable=False)
    permission = Column(String(50), default="deny") # 'allow' or 'deny'
    rule_condition = Column(String(255), nullable=True)
    status = Column(String(50), default="active") # 'active' or 'inactive'
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    agent = relationship("Agent", back_populates="policies")
