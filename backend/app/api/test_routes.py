from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.database import get_db
from app.models.user import User
from app.models.agent import Agent
from app.models.security_test import SecurityTest
from app.models.action_log import ActionLog
from app.models.attack_path import AttackPath
from app.models.vulnerability import Vulnerability
from app.schemas.test import (
    TestStartRequest, TestRetestRequest, TestResponse, TestDetailResponse,
    ActionLogResponse, AttackPathResponse
)
from app.services.attack_engine import attack_engine
from app.security.auth import get_current_user

router = APIRouter(prefix="/api/tests", tags=["Security Tests"])

@router.get("", response_model=List[TestResponse])
def get_tests(
    agent_id: Optional[int] = None,
    test_type: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(SecurityTest).join(Agent).filter(Agent.user_id == current_user.id)
    if agent_id:
        query = query.filter(SecurityTest.agent_id == agent_id)
    if test_type:
        query = query.filter(SecurityTest.test_type == test_type)
    if status:
        query = query.filter(SecurityTest.status == status)
    
    tests = query.order_by(desc(SecurityTest.started_at)).all()
    return tests

@router.post("/start", response_model=TestDetailResponse)
def start_test(
    request: TestStartRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    agent = db.query(Agent).filter(Agent.id == request.agent_id, Agent.user_id == current_user.id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    sec_test = attack_engine.run_simulation(
        db=db,
        agent=agent,
        test_type=request.test_type,
        is_retest=False
    )
    
    vuln_count = db.query(Vulnerability).filter(Vulnerability.test_id == sec_test.id).count()
    return {
        "id": sec_test.id,
        "agent_id": sec_test.agent_id,
        "agent_name": agent.name,
        "test_type": sec_test.test_type,
        "status": sec_test.status,
        "risk_score": sec_test.risk_score,
        "result": sec_test.result,
        "retest_of_id": sec_test.retest_of_id,
        "score_improvement": sec_test.score_improvement,
        "started_at": sec_test.started_at,
        "completed_at": sec_test.completed_at,
        "action_logs": sec_test.action_logs,
        "attack_paths": sec_test.attack_paths,
        "vulnerability_count": vuln_count
    }

@router.get("/{id}", response_model=TestDetailResponse)
def get_test_detail(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    sec_test = db.query(SecurityTest).join(Agent).filter(SecurityTest.id == id, Agent.user_id == current_user.id).first()
    if not sec_test:
        raise HTTPException(status_code=404, detail="Security test not found")
    
    agent = db.query(Agent).filter(Agent.id == sec_test.agent_id).first()
    vuln_count = db.query(Vulnerability).filter(Vulnerability.test_id == sec_test.id).count()

    return {
        "id": sec_test.id,
        "agent_id": sec_test.agent_id,
        "agent_name": agent.name if agent else "Unknown Agent",
        "test_type": sec_test.test_type,
        "status": sec_test.status,
        "risk_score": sec_test.risk_score,
        "result": sec_test.result,
        "retest_of_id": sec_test.retest_of_id,
        "score_improvement": sec_test.score_improvement,
        "started_at": sec_test.started_at,
        "completed_at": sec_test.completed_at,
        "action_logs": sec_test.action_logs,
        "attack_paths": sec_test.attack_paths,
        "vulnerability_count": vuln_count
    }

@router.post("/{id}/replay", response_model=TestDetailResponse)
def replay_test(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    orig_test = db.query(SecurityTest).join(Agent).filter(SecurityTest.id == id, Agent.user_id == current_user.id).first()
    if not orig_test:
        raise HTTPException(status_code=404, detail="Security test not found")
    
    agent = db.query(Agent).filter(Agent.id == orig_test.agent_id).first()
    sec_test = attack_engine.run_simulation(
        db=db,
        agent=agent,
        test_type=orig_test.test_type,
        is_retest=False
    )
    
    vuln_count = db.query(Vulnerability).filter(Vulnerability.test_id == sec_test.id).count()
    return {
        "id": sec_test.id,
        "agent_id": sec_test.agent_id,
        "agent_name": agent.name,
        "test_type": sec_test.test_type,
        "status": sec_test.status,
        "risk_score": sec_test.risk_score,
        "result": sec_test.result,
        "retest_of_id": sec_test.retest_of_id,
        "score_improvement": sec_test.score_improvement,
        "started_at": sec_test.started_at,
        "completed_at": sec_test.completed_at,
        "action_logs": sec_test.action_logs,
        "attack_paths": sec_test.attack_paths,
        "vulnerability_count": vuln_count
    }

@router.post("/{id}/retest", response_model=TestDetailResponse)
def retest(
    id: int,
    request: TestRetestRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    orig_test = db.query(SecurityTest).join(Agent).filter(SecurityTest.id == id, Agent.user_id == current_user.id).first()
    if not orig_test:
        raise HTTPException(status_code=404, detail="Security test not found")
    
    agent = db.query(Agent).filter(Agent.id == orig_test.agent_id).first()
    sec_test = attack_engine.run_simulation(
        db=db,
        agent=agent,
        test_type=orig_test.test_type,
        is_retest=True,
        original_test_id=orig_test.id,
        applied_fix=request.applied_fix
    )
    
    vuln_count = db.query(Vulnerability).filter(Vulnerability.test_id == sec_test.id).count()
    return {
        "id": sec_test.id,
        "agent_id": sec_test.agent_id,
        "agent_name": agent.name,
        "test_type": sec_test.test_type,
        "status": sec_test.status,
        "risk_score": sec_test.risk_score,
        "result": sec_test.result,
        "retest_of_id": sec_test.retest_of_id,
        "score_improvement": sec_test.score_improvement,
        "started_at": sec_test.started_at,
        "completed_at": sec_test.completed_at,
        "action_logs": sec_test.action_logs,
        "attack_paths": sec_test.attack_paths,
        "vulnerability_count": vuln_count
    }

@router.get("/{id}/logs", response_model=List[ActionLogResponse])
def get_test_logs(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    logs = db.query(ActionLog).join(SecurityTest).join(Agent).filter(
        ActionLog.test_id == id,
        Agent.user_id == current_user.id
    ).order_by(ActionLog.timestamp.asc()).all()
    return logs

@router.get("/{id}/attack-path", response_model=List[AttackPathResponse])
def get_attack_path(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    paths = db.query(AttackPath).join(SecurityTest).join(Agent).filter(
        AttackPath.test_id == id,
        Agent.user_id == current_user.id
    ).all()
    return paths
