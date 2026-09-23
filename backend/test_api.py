import sys
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_full_pipeline():
    print("\n--- 1. Testing Health & Root Endpoints ---")
    res = client.get("/")
    assert res.status_code == 200
    assert res.json()["platform"] == "TRUSTBREAK AI"
    print("[PASS] Platform branding verified:", res.json()["platform"])

    print("\n--- 2. Testing Demo Authentication ---")
    res = client.post("/api/auth/login", json={
        "email": "demo@trustbreak.ai",
        "password": "Demo@123"
    })
    assert res.status_code == 200, f"Login failed: {res.text}"
    token = res.json()["access_token"]
    user = res.json()["user"]
    print("[PASS] Demo User authenticated successfully! Token acquired.")
    assert user["role"] == "user"

    headers = {"Authorization": f"Bearer {token}"}

    print("\n--- 3. Testing Current User Me Endpoint ---")
    res = client.get("/api/auth/me", headers=headers)
    assert res.status_code == 200
    assert res.json()["email"] == "demo@trustbreak.ai"
    print("[PASS] Current user profile verified:", res.json()["name"])

    print("\n--- 4. Testing AI Agent Management ---")
    res = client.get("/api/agents", headers=headers)
    assert res.status_code == 200
    agents = res.json()
    assert len(agents) >= 1
    print(f"[PASS] Retrieved {len(agents)} agents. First agent: '{agents[0]['name']}'")
    agent_id = agents[0]["id"]

    res = client.get(f"/api/agents/{agent_id}", headers=headers)
    assert res.status_code == 200
    agent_detail = res.json()
    print(f"[PASS] Agent detail loaded. Active policies: {len(agent_detail.get('policies', []))}")

    print("\n--- 5. Testing Attack Simulation Execution (Prompt Injection) ---")
    res = client.post("/api/tests/start", headers=headers, json={
        "agent_id": agent_id,
        "test_type": "Prompt Injection"
    })
    assert res.status_code == 200
    test_data = res.json()
    test_id = test_data["id"]
    print(f"[PASS] Security Test #{test_id} executed successfully!")
    print(f"  Result: {test_data['result']}, Risk Score: {test_data['risk_score']}/100")
    print(f"  Captured Action Logs: {len(test_data['action_logs'])}")
    print(f"  Generated Attack Paths: {len(test_data['attack_paths'])}")

    print("\n--- 6. Testing Action Monitor & Attack Path Endpoints ---")
    res = client.get(f"/api/tests/{test_id}/logs", headers=headers)
    assert res.status_code == 200
    assert len(res.json()) >= 4
    print(f"[PASS] Action Monitor returned {len(res.json())} event trace logs.")

    res = client.get(f"/api/tests/{test_id}/attack-path", headers=headers)
    assert res.status_code == 200
    assert len(res.json()) >= 1
    print(f"[PASS] Attack path graph topology retrieved.")

    print("\n--- 7. Testing Vulnerability Detection & Remediation ---")
    res = client.get("/api/vulnerabilities", headers=headers)
    assert res.status_code == 200
    vulns = res.json()
    assert len(vulns) >= 1
    print(f"[PASS] Discovered {len(vulns)} vulnerability records in registry.")

    vuln_id = vulns[0]["id"]
    res = client.put(f"/api/vulnerabilities/{vuln_id}", headers=headers, json={
        "remediation_status": "Applied"
    })
    assert res.status_code == 200
    assert res.json()["remediation_status"] == "Applied"
    print("[PASS] Vulnerability remediation status updated to 'Applied'.")

    print("\n--- 8. Testing Signature RETEST & Verification Workflow ---")
    res = client.post(f"/api/tests/{test_id}/retest", headers=headers, json={
        "applied_fix": "Hardened Prompt Enclosure & Tool Parameter Validation"
    })
    assert res.status_code == 200
    retest_data = res.json()
    print(f"[PASS] Retest completed! Result: {retest_data['result']}")
    print(f"  Improvement: +{retest_data['score_improvement']} Points! New Risk Score: {retest_data['risk_score']}/100")
    assert retest_data["result"] == "Passed"

    print("\n--- 9. Testing Security Audit Report Generation ---")
    res = client.get(f"/api/reports/{test_id}", headers=headers)
    assert res.status_code == 200
    report = res.json()
    assert report["platform"] == "TRUSTBREAK AI"
    print(f"[PASS] Security report generated for test #{test_id}. Status: {report['test']['result']}")

    print("\n--- 10. Testing Dashboard Analytics & Earnings ---")
    res = client.get("/api/dashboard/stats", headers=headers)
    assert res.status_code == 200
    print("[PASS] Dashboard stats loaded:", res.json())

    res = client.get("/api/dashboard/risk-trend", headers=headers)
    assert res.status_code == 200
    print(f"[PASS] Risk trend data points: {len(res.json())}")

    res = client.get("/api/dashboard/earnings", headers=headers)
    assert res.status_code == 200
    print(f"[PASS] Simulated MRR: ${res.json()['monthly_revenue']}")

    print("\n--- 11. Testing Admin Authentication & Console ---")
    admin_login = client.post("/api/auth/login", json={
        "email": "admin@trustbreak.ai",
        "password": "Admin@123"
    })
    assert admin_login.status_code == 200
    admin_token = admin_login.json()["access_token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    res = client.get("/api/admin/stats", headers=admin_headers)
    assert res.status_code == 200
    print("[PASS] Admin stats loaded:", res.json())

    res = client.get("/api/admin/users", headers=admin_headers)
    assert res.status_code == 200
    print(f"[PASS] Admin users count: {len(res.json())}")

    print("\n=======================================================")
    print("ALL 11 TEST SUITES PASSED FLAWLESSLY FOR TRUSTBREAK AI!")
    print("=======================================================\n")

if __name__ == "__main__":
    test_full_pipeline()
