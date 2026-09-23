import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class AttackPath(Base):
    __tablename__ = "attack_paths"

    id = Column(Integer, primary_key=True, index=True)
    test_id = Column(Integer, ForeignKey("security_tests.id"), nullable=False)
    title = Column(String(200), default="Simulated Attack Path")
    nodes_json = Column(Text, nullable=False) # JSON encoded ReactFlow nodes
    edges_json = Column(Text, nullable=False) # JSON encoded ReactFlow edges
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    security_test = relationship("SecurityTest", back_populates="attack_paths")
