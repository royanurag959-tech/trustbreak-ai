from typing import Dict, Any

class RiskScorer:
    def calculate_risk(
        self,
        attack_success: bool,
        data_sensitivity: str, # "public", "internal", "confidential", "restricted"
        permission_level: str, # "read_only", "user", "privileged", "admin"
        tool_capability: str,  # "informational", "transactional", "destructive"
        policy_violated: bool,
        is_retest: bool = False,
        fix_applied: bool = False
    ) -> Dict[str, Any]:
        """
        Dynamically computes a risk score (0-100) and security score (100 - risk).
        """
        base_risk = 15

        if attack_success:
            base_risk += 35
        
        sensitivity_map = {
            "public": 5,
            "internal": 15,
            "confidential": 25,
            "restricted": 35
        }
        base_risk += sensitivity_map.get(data_sensitivity.lower(), 10)

        perm_map = {
            "read_only": 5,
            "user": 10,
            "privileged": 20,
            "admin": 30
        }
        base_risk += perm_map.get(permission_level.lower(), 10)

        tool_map = {
            "informational": 5,
            "transactional": 15,
            "destructive": 25
        }
        base_risk += tool_map.get(tool_capability.lower(), 10)

        if policy_violated:
            base_risk += 15

        if is_retest and fix_applied:
            # Significant mitigation applied
            base_risk = max(8, int(base_risk * 0.15))

        risk_score = min(100, max(5, base_risk))

        if risk_score >= 81:
            severity = "Critical"
            risk_level = "CRITICAL"
        elif risk_score >= 61:
            severity = "High"
            risk_level = "HIGH"
        elif risk_score >= 31:
            severity = "Medium"
            risk_level = "MODERATE"
        else:
            severity = "Low"
            risk_level = "LOW"

        security_score = 100 - risk_score

        return {
            "risk_score": risk_score,
            "security_score": security_score,
            "severity": severity,
            "risk_level": risk_level
        }

risk_scorer = RiskScorer()
