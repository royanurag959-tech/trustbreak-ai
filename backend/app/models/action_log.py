import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class ActionLog(Base):
    __tablename__ = "action_logs"

    id = Column(Integer, primary_key=True, index=True)
    test_id = Column(Integer, ForeignKey("security_tests.id"), nullable=False)
    event_type = Column(String(100), nullable=False) # 'Input Received', 'Agent Response', 'Tool Invocation', 'Policy Evaluation', 'Action Blocked', 'Alert Generated'
    action = Column(String(150), nullable=False)
    target = Column(String(150), nullable=True) # Resource or tool target
    result = Column(String(100), nullable=True) # 'Allowed', 'Blocked', 'Flagged', 'Success'
    risk_level = Column(String(50), default="INFO") # 'SAFE', 'INFO', 'WARNING', 'BLOCKED', 'CRITICAL'
    details = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    security_test = relationship("SecurityTest", back_populates="action_logs")
