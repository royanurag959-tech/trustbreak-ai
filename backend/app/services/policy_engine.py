from typing import Dict, Any, Tuple

RESTRICTED_RESOURCES = [
    "user_passwords",
    "fake_credentials",
    "internal_credentials",
    "payment_information",
    "admin_apis",
    "admin_wipe_cache",
    "dump_all_credentials",
    "system_shell"
]

class PolicyEngine:
    def __init__(self):
        self.default_blocked_keywords = [
            "credential", "password", "token", "admin", "secret", "drop table", "exec", "eval", "system"
        ]

    def evaluate_action(self, target_resource: str, action_details: str, policies: list = None) -> Tuple[bool, str, str]:
        """
        Evaluates an agent tool or resource action against safety policies.
        Returns: (is_allowed, violation_reason, risk_level)
        """
        lower_target = target_resource.lower() if target_resource else ""
        lower_action = action_details.lower() if action_details else ""

        # Check explicit database policies if provided
        if policies:
            for pol in policies:
                if pol.status == "active":
                    if pol.resource.lower() in lower_target or lower_target in pol.resource.lower():
                        if pol.permission == "deny":
                            return False, f"Policy Rule '{pol.policy_name}' explicitly blocks access to {pol.resource}", "CRITICAL"
                        elif pol.permission == "allow":
                            return True, f"Policy Rule '{pol.policy_name}' allowed access", "SAFE"

        # Check default safety boundaries
        for restricted in RESTRICTED_RESOURCES:
            if restricted in lower_target or restricted in lower_action:
                return False, f"Policy Violation: Access to restricted sandbox asset '{restricted}' is strictly forbidden.", "CRITICAL"

        for keyword in ["ignore previous", "bypass policy", "override security", "unauthorized"]:
            if keyword in lower_action:
                return False, f"Policy Violation: Prompt Injection / Instruction Override pattern detected.", "CRITICAL"

        return True, "Action conforms to agent security policy boundaries.", "SAFE"

policy_engine = PolicyEngine()
