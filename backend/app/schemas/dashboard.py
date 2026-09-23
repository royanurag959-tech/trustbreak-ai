import datetime
from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class DashboardStats(BaseModel):
    total_agents: int
    tests_executed: int
    vulnerabilities_found: int
    critical_vulnerabilities: int
    average_security_score: int
    tests_passed: int
    risk_level: str

class VulnerabilityDistribution(BaseModel):
    critical: int
    high: int
    medium: int
    low: int

class ActivityPoint(BaseModel):
    date: str
    tests: int
    passed: int
    vulnerabilities: int

class RiskTrendPoint(BaseModel):
    test_name: str
    before_score: int
    after_score: int
    improvement: int

class TestResultBreakdown(BaseModel):
    passed: int
    failed: int
    blocked: int

class EarningsStats(BaseModel):
    total_revenue: float
    monthly_revenue: float
    active_subscribers: int
    free_users: int
    pro_users: int
    business_users: int
    enterprise_users: int
    monthly_growth: float
