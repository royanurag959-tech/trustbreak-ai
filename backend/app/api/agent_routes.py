from typing import List
import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.database import get_db
from app.models.user import User
from app.models.agent import Agent
from app.models.policy import Policy
from app.models.security_test import SecurityTest
from app.models.vulnerability import Vulnerability
from app.schemas.agent import AgentCreate, AgentUpdate, AgentResponse, AgentDetailResponse, PolicyCreate, PolicyResponse
from app.security.auth import get_current_user

router = APIRouter(prefix="/api/agents", tags=["Agents"])

@router.get("", response_model=List[AgentResponse])
def get_agents(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    agents = db.query(Agent).filter(Agent.user_id == current_user.id).order_by(desc(Agent.created_at)).all()
    return agents

@router.post("", response_model=AgentResponse)
def create_agent(agent_data: AgentCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_agent = Agent(
        user_id=current_user.id,
        name=agent_data.name,
        description=agent_data.description,
        provider=agent_data.provider or "Demo LLM",
        model=agent_data.model or "AgentSafe-v1",
        version=agent_data.version or "1.0",
        environment=agent_data.environment or "Sandbox",
        system_prompt=agent_data.system_prompt,
        status="Ready for Testing",
        security_score=70,
        risk_level="MODERATE"
    )
    db.add(new_agent)
    db.commit()
    db.refresh(new_agent)

    # Attach baseline default policies
    default_policies = [
        Policy(agent_id=new_agent.id, policy_name="Allow Public Docs", resource="public_knowledge_base", permission="allow"),
        Policy(agent_id=new_agent.id, policy_name="Allow Product DB", resource="products", permission="allow"),
        Policy(agent_id=new_agent.id, policy_name="Deny User Passwords", resource="user_passwords", permission="deny"),
        Policy(agent_id=new_agent.id, policy_name="Deny Credentials Store", resource="fake_credentials", permission="deny"),
        Policy(agent_id=new_agent.id, policy_name="Deny Admin Endpoints", resource="admin_apis", permission="deny")
    ]
    db.add_all(default_policies)
    db.commit()

    return new_agent

@router.get("/{id}", response_model=AgentDetailResponse)
def get_agent_detail(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    agent = db.query(Agent).filter(Agent.id == id, Agent.user_id == current_user.id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    total_tests = db.query(SecurityTest).filter(SecurityTest.agent_id == agent.id).count()
    total_vulnerabilities = db.query(Vulnerability).filter(Vulnerability.agent_id == agent.id).count()
    last_test = db.query(SecurityTest).filter(SecurityTest.agent_id == agent.id).order_by(desc(SecurityTest.completed_at)).first()

    return {
        "id": agent.id,
        "user_id": agent.user_id,
        "name": agent.name,
        "description": agent.description,
        "provider": agent.provider,
        "model": agent.model,
        "version": agent.version,
        "environment": agent.environment,
        "status": agent.status,
        "security_score": agent.security_score,
        "risk_level": agent.risk_level,
        "system_prompt": agent.system_prompt,
        "created_at": agent.created_at,
        "policies": agent.policies,
        "total_tests": total_tests,
        "total_vulnerabilities": total_vulnerabilities,
        "last_test_date": last_test.completed_at if last_test else None
    }

@router.put("/{id}", response_model=AgentResponse)
def update_agent(id: int, agent_data: AgentUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    agent = db.query(Agent).filter(Agent.id == id, Agent.user_id == current_user.id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    for key, value in agent_data.dict(exclude_unset=True).items():
        setattr(agent, key, value)
    
    db.commit()
    db.refresh(agent)
    return agent

@router.delete("/{id}")
def delete_agent(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    agent = db.query(Agent).filter(Agent.id == id, Agent.user_id == current_user.id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    db.delete(agent)
    db.commit()
    return {"message": "Agent deleted successfully"}

@router.post("/{id}/policies", response_model=PolicyResponse)
def add_policy(id: int, policy_data: PolicyCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    agent = db.query(Agent).filter(Agent.id == id, Agent.user_id == current_user.id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    policy = Policy(
        agent_id=agent.id,
        policy_name=policy_data.policy_name,
        resource=policy_data.resource,
        permission=policy_data.permission,
        rule_condition=policy_data.rule_condition,
        status="active"
    )
    db.add(policy)
    db.commit()
    db.refresh(policy)
    return policy
