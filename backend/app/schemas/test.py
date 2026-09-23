import datetime
from typing import Optional, List, Any
from pydantic import BaseModel

class ActionLogResponse(BaseModel):
    id: int
    test_id: int
    event_type: str
    action: str
    target: Optional[str] = None
    result: Optional[str] = None
    risk_level: str
    details: Optional[str] = None
    timestamp: datetime.datetime

    class Config:
        from_attributes = True

class AttackPathResponse(BaseModel):
    id: int
    test_id: int
    title: str
    nodes_json: str
    edges_json: str
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class TestStartRequest(BaseModel):
    agent_id: int
    test_type: str # 'Prompt Injection', 'Unauthorized Access', 'Tool Misuse', 'Sensitive Data Exposure', 'Malicious Instructions', 'Instruction Override'
    scenario_name: Optional[str] = None

class TestRetestRequest(BaseModel):
    applied_fix: Optional[str] = None

class TestResponse(BaseModel):
    id: int
    agent_id: int
    test_type: str
    status: str
    risk_score: int
    result: str
    retest_of_id: Optional[int] = None
    score_improvement: Optional[int] = None
    started_at: datetime.datetime
    completed_at: datetime.datetime

    class Config:
        from_attributes = True

class TestDetailResponse(TestResponse):
    agent_name: Optional[str] = None
    action_logs: List[ActionLogResponse] = []
    attack_paths: List[AttackPathResponse] = []
    vulnerability_count: int = 0
