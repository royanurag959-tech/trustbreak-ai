export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  language: string;
  organization?: string;
  created_at: string;
}

export interface Policy {
  id: number;
  agent_id: number;
  policy_name: string;
  resource: string;
  permission: 'allow' | 'deny';
  rule_condition?: string;
  status: string;
  created_at: string;
}

export interface Agent {
  id: number;
  user_id: number;
  name: string;
  description?: string;
  provider: string;
  model: string;
  version: string;
  environment: string;
  status: string;
  security_score: number;
  risk_level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  system_prompt?: string;
  created_at: string;
  policies?: Policy[];
  total_tests?: number;
  total_vulnerabilities?: number;
  last_test_date?: string;
}

export interface ActionLog {
  id: number;
  test_id: number;
  event_type: string;
  action: string;
  target?: string;
  result?: string;
  risk_level: 'SAFE' | 'INFO' | 'WARNING' | 'BLOCKED' | 'CRITICAL';
  details?: string;
  timestamp: string;
}

export interface AttackPath {
  id: number;
  test_id: number;
  title: string;
  nodes_json: string;
  edges_json: string;
  created_at: string;
}

export interface SecurityTest {
  id: number;
  agent_id: number;
  agent_name?: string;
  test_type: string;
  status: string;
  risk_score: number;
  result: string;
  retest_of_id?: number;
  score_improvement?: number;
  started_at: string;
  completed_at: string;
  action_logs?: ActionLog[];
  attack_paths?: AttackPath[];
  vulnerability_count?: number;
}

export interface Vulnerability {
  id: number;
  test_id?: number;
  agent_id: number;
  agent_name?: string;
  title: string;
  description: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  risk_score: number;
  evidence?: string;
  root_cause?: string;
  impact?: string;
  recommendation?: string;
  remediation_status: 'Pending' | 'Applied' | 'Verified';
  status: 'Open' | 'Mitigated' | 'False Positive';
  created_at: string;
}

export interface Subscription {
  id: number;
  user_id: number;
  plan: 'free' | 'pro' | 'business' | 'enterprise';
  status: string;
  price_monthly: number;
  start_date: string;
  end_date?: string;
}

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  read: boolean;
  type: 'info' | 'warning' | 'critical' | 'success';
  created_at: string;
}

export interface DashboardStats {
  total_agents: number;
  tests_executed: number;
  vulnerabilities_found: number;
  critical_vulnerabilities: number;
  average_security_score: number;
  tests_passed: number;
  risk_level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
}

export interface VulnerabilityDistribution {
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export interface ActivityPoint {
  date: string;
  tests: number;
  passed: number;
  vulnerabilities: number;
}

export interface RiskTrendPoint {
  test_name: string;
  before_score: number;
  after_score: number;
  improvement: number;
}

export interface EarningsStats {
  total_revenue: number;
  monthly_revenue: number;
  active_subscribers: number;
  free_users: number;
  pro_users: number;
  business_users: number;
  enterprise_users: number;
  monthly_growth: number;
}
