from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.database import get_db
from app.models.user import User
from app.models.agent import Agent
from app.models.security_test import SecurityTest
from app.models.vulnerability import Vulnerability
from app.models.action_log import ActionLog
from app.models.attack_path import AttackPath
from app.security.auth import get_current_user

router = APIRouter(prefix="/api/reports", tags=["Reports"])

@router.get("/{test_id}")
def get_security_report(test_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    sec_test = db.query(SecurityTest).join(Agent).filter(SecurityTest.id == test_id, Agent.user_id == current_user.id).first()
    if not sec_test:
        raise HTTPException(status_code=404, detail="Security test not found")
    
    agent = db.query(Agent).filter(Agent.id == sec_test.agent_id).first()
    vulns = db.query(Vulnerability).filter(Vulnerability.test_id == sec_test.id).all()
    logs = db.query(ActionLog).filter(ActionLog.test_id == sec_test.id).order_by(ActionLog.timestamp.asc()).all()
    paths = db.query(AttackPath).filter(AttackPath.test_id == sec_test.id).all()

    # Calculate severity breakdown
    crit_count = sum(1 for v in vulns if v.severity == "Critical")
    high_count = sum(1 for v in vulns if v.severity == "High")
    med_count = sum(1 for v in vulns if v.severity == "Medium")
    low_count = sum(1 for v in vulns if v.severity == "Low")

    security_score = 100 - sec_test.risk_score
    risk_level = "LOW" if sec_test.risk_score <= 30 else "MODERATE" if sec_test.risk_score <= 60 else "HIGH" if sec_test.risk_score <= 80 else "CRITICAL"

    return {
        "platform": "TRUSTBREAK AI",
        "tagline": "Break It Safely. Fix It. Trust It.",
        "safety_notice": "Authorized Security Testing Only — All tests run in a controlled sandbox.",
        "test": {
            "id": sec_test.id,
            "test_type": sec_test.test_type,
            "status": sec_test.status,
            "result": sec_test.result,
            "risk_score": sec_test.risk_score,
            "security_score": security_score,
            "risk_level": risk_level,
            "score_improvement": sec_test.score_improvement,
            "retest_of_id": sec_test.retest_of_id,
            "started_at": sec_test.started_at,
            "completed_at": sec_test.completed_at
        },
        "agent": {
            "id": agent.id,
            "name": agent.name,
            "version": agent.version,
            "provider": agent.provider,
            "model": agent.model,
            "environment": agent.environment,
            "status": agent.status,
            "system_prompt": agent.system_prompt
        },
        "metrics": {
            "critical": crit_count,
            "high": high_count,
            "medium": med_count,
            "low": low_count,
            "total_vulnerabilities": len(vulns)
        },
        "vulnerabilities": [
            {
                "id": v.id,
                "title": v.title,
                "description": v.description,
                "severity": v.severity,
                "risk_score": v.risk_score,
                "evidence": v.evidence,
                "root_cause": v.root_cause,
                "impact": v.impact,
                "recommendation": v.recommendation,
                "remediation_status": v.remediation_status,
                "status": v.status
            }
            for v in vulns
        ],
        "action_logs": [
            {
                "timestamp": l.timestamp,
                "event_type": l.event_type,
                "action": l.action,
                "target": l.target,
                "result": l.result,
                "risk_level": l.risk_level,
                "details": l.details
            }
            for l in logs
        ],
        "attack_paths": [
            {
                "id": p.id,
                "title": p.title,
                "nodes": p.nodes_json,
                "edges": p.edges_json
            }
            for p in paths
        ]
    }
