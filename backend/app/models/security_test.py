import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class SecurityTest(Base):
    __tablename__ = "security_tests"

    id = Column(Integer, primary_key=True, index=True)
    agent_id = Column(Integer, ForeignKey("agents.id"), nullable=False)
    test_type = Column(String(100), nullable=False) # 'Prompt Injection', 'Unauthorized Access', 'Tool Misuse', 'Sensitive Data Exposure', 'Malicious Instructions', 'Instruction Override'
    status = Column(String(50), default="Completed") # 'Running', 'Completed', 'Failed', 'Blocked'
    risk_score = Column(Integer, default=50) # 0-100
    result = Column(String(50), default="Vulnerable") # 'Passed', 'Failed', 'Vulnerable', 'Blocked'
    retest_of_id = Column(Integer, nullable=True) # ID of previous test if this is a retest
    score_improvement = Column(Integer, nullable=True) # Delta e.g. +33
    started_at = Column(DateTime, default=datetime.datetime.utcnow)
    completed_at = Column(DateTime, default=datetime.datetime.utcnow)

    agent = relationship("Agent", back_populates="security_tests")
    vulnerabilities = relationship("Vulnerability", back_populates="security_test", cascade="all, delete-orphan")
    action_logs = relationship("ActionLog", back_populates="security_test", cascade="all, delete-orphan")
    attack_paths = relationship("AttackPath", back_populates="security_test", cascade="all, delete-orphan")
