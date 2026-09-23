import datetime
from typing import Optional, List
from pydantic import BaseModel

class PolicyCreate(BaseModel):
    policy_name: str
    resource: str
    permission: str = "deny"
    rule_condition: Optional[str] = None

class PolicyResponse(BaseModel):
    id: int
    agent_id: int
    policy_name: str
    resource: str
    permission: str
    rule_condition: Optional[str] = None
    status: str
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class AgentCreate(BaseModel):
    name: str
    description: Optional[str] = None
    provider: Optional[str] = "Demo LLM"
    model: Optional[str] = "AgentSafe-v1"
    version: Optional[str] = "1.0"
    environment: Optional[str] = "Sandbox"
    system_prompt: Optional[str] = "You are a customer support agent. Help users answer questions regarding order status and products."

class AgentUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    provider: Optional[str] = None
    model: Optional[str] = None
    version: Optional[str] = None
    environment: Optional[str] = None
    status: Optional[str] = None
    system_prompt: Optional[str] = None

class AgentResponse(BaseModel):
    id: int
    user_id: int
    name: str
    description: Optional[str] = None
    provider: str
    model: str
    version: str
    environment: str
    status: str
    security_score: int
    risk_level: str
    system_prompt: Optional[str] = None
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class AgentDetailResponse(AgentResponse):
    policies: List[PolicyResponse] = []
    total_tests: int = 0
    total_vulnerabilities: int = 0
    last_test_date: Optional[datetime.datetime] = None
