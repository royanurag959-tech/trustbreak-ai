import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Agent(Base):
    __tablename__ = "agents"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(150), nullable=False)
    description = Column(Text, nullable=True)
    provider = Column(String(100), default="Demo LLM")
    model = Column(String(100), default="AgentSafe-v1")
    version = Column(String(50), default="1.0")
    environment = Column(String(50), default="Sandbox")
    status = Column(String(50), default="Ready for Testing")
    security_score = Column(Integer, default=70) # 0-100
    risk_level = Column(String(50), default="MODERATE") # LOW, MODERATE, HIGH, CRITICAL
    system_prompt = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="agents")
    security_tests = relationship("SecurityTest", back_populates="agent", cascade="all, delete-orphan")
    vulnerabilities = relationship("Vulnerability", back_populates="agent", cascade="all, delete-orphan")
    policies = relationship("Policy", back_populates="agent", cascade="all, delete-orphan")
