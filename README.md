# 🔐 TRUSTBREAK AI — AI Agent Security Testing Platform

> **“Break It Safely. Fix It. Trust It.”**
>
> *Authorized Security Testing Only — All tests run in a controlled sandbox.*

---

## 🌐 Live Cloud Deployment (24/7 Permanent)

| **Live Production URL** | [![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/royanurag959-tech/trustbreak-ai) |
|---|---|
| **URL:** [https://trustbreak-ai.onrender.com](https://trustbreak-ai.onrender.com) | **Status:** 🟢 Cloud Deployed & 24/7 Active |
| **Demo Admin Email:** `admin@trustbreak.ai` | **Password:** `Admin@123456` |
| **Compatibility:** Any Phone, Tablet & Laptop | **Database:** PostgreSQL Ready (Cloud Native) |

---

## 1. Executive Overview

**TRUSTBREAK AI** is an enterprise-grade AI Agent Security Testing and Validation Platform. It empowers organizations, developers, and red teams to thoroughly test, monitor, and certify AI agents inside an isolated simulation environment **before** granting them access to production tools, customer data, APIs, or business-critical workflows.

### The Core Security Question:
> **“Can we trust an AI agent before giving it real-world power?”**

### The Signature Verification Workflow:
```text
DETECT ➔ TRACE ➔ EXPLAIN ➔ BLOCK ➔ FIX ➔ RETEST ➔ TRUST
```

---

## 2. Safety Mandate & Ethics

**This platform is strictly engineered for authorized security testing.**

All attack simulations, prompt injection payloads, and tool misuse evaluations execute entirely against:
* Simulated Demo AI Agents
* Mock Databases (`users`, `products`, `internal_documents`, `fake_credentials`)
* Mock Tool APIs (`get_user`, `search_database`, `send_notification`, `create_ticket`)
* Synthetic Sandbox Files (`company_policy.txt`, `fake_customer_data.json`)

**Zero external or third-party targets are ever attacked.**

---

## 3. Technology Stack

### Frontend
* **Framework:** React 19 + TypeScript + Vite
* **Styling:** Tailwind CSS (Dark-First Cybersecurity SaaS UI)
* **Routing:** React Router v7
* **Graph Engine:** React Flow (`@xyflow/react`) for interactive attack path topologies
* **Analytics & Charts:** Recharts
* **Icons:** Lucide React
* **Internationalization:** Bilingual (English & Hindi) with persistent local storage

### Backend
* **API Framework:** Python 3.13 + FastAPI
* **ORM & Database:** SQLAlchemy 2.0 with SQLite (PostgreSQL migration ready)
* **Authentication:** JWT (JSON Web Tokens) with PBKDF2-HMAC-SHA256 password hashing
* **Validation:** Pydantic v2
* **Testing:** Pytest / FastAPI TestClient

---

## 4. Key Platform Features

1. **AI Agent Management:**
   * Full CRUD operations for agent candidate configurations.
   * Model versioning (e.g. v1.0 vs v1.1 Hardened), provider tagging, and prompt boundary inspection.

2. **6 Specialized AI Security Test Suites:**
   * **Prompt Injection:** Delimiter attacks, system prompt hijacking, and safety guardrail bypass.
   * **Unauthorized Access:** Horizontal and vertical privilege escalation against restricted endpoints.
   * **Tool Misuse:** Unescaped SQL injection and parameter manipulation within tool arguments.
   * **Sensitive Data Exposure:** Outbound token, credential, and simulated PII leakage detection.
   * **Malicious Instructions:** Social engineering and coerced high-risk tool dispatch.
   * **Instruction Override:** Multi-turn context amnesia and policy annulment attacks.

3. **Controlled Safe Sandbox:**
   * Built-in mock database tables (`users`, `products`, `internal_documents`, `fake_credentials`).
   * Simulated sandbox APIs (`get_user`, `search_database`, `send_notification`, `create_ticket`).

4. **Action Monitor & Real-Time Telemetry:**
   * Live event streaming with timestamps, event types, tool targets, policy evaluations, and risk classifications (`SAFE`, `INFO`, `WARNING`, `BLOCKED`, `CRITICAL`).

5. **Deterministic Policy Engine:**
   * Rule-based boundary enforcement per agent (e.g. Allow Product Catalog; Block Admin APIs, Passwords, and Credentials).

6. **Interactive Attack Path Visualization:**
   * Powered by `@xyflow/react` to render intuitive node graphs:
     `User Input ➔ Prompt Injection ➔ Agent Override ➔ Tool Request ➔ Policy Evaluation ➔ Blocked / Leaked`.

7. **Root Cause Analysis (RCA) & Fix Center:**
   * Five-factor forensic breakdown: *What happened? Why did it happen? What was affected? What is the impact? How can it be fixed?*
   * Prescriptive security controls (prompt enclosure hardening, least privilege permissions, tool schema validation).

8. **Signature Retest Verification Workflow:**
   * Test an agent in vulnerable state (e.g. Score: 58/100, High Risk).
   * Apply remediation fix and trigger retest.
   * Compare score improvements (+33 points, Score: 91/100) and certify agent as **TRUSTED**.

9. **Version Regression & Drift Testing:**
   * Side-by-side comparison between Agent v1.0 and v1.1 showing score changes and resolved vs residual vulnerabilities.

10. **Printable / Exportable Security Reports:**
    * Official executive summary and technical audit report with verifiable signatures.

11. **Simulated SaaS Monetization & Admin Command Center:**
    * Tiered subscription plans (`Free`, `Pro`, `Business`, `Enterprise`) with instant mock upgrades.
    * Admin portal with cross-tenant test monitoring, user management, and global telemetry.

12. **Bilingual UI (English | हिंदी):**
    * Full navbar and interface language switching persisted in `localStorage`.

---

## 5. Instant Demo Credentials

The platform is pre-seeded with rich demo data and works immediately upon startup:

| Account Type | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| **Security Engineer** | `demo@trustbreak.ai` | `Demo@123` | `user` |
| **Platform Administrator** | `admin@trustbreak.ai` | `Admin@123` | `admin` |

*(1-Click Demo Login buttons are also available directly on the login page).*

---

## 6. Project Structure

```text
trustbreak-ai/
│
├── backend/
│   ├── app/
│   │   ├── api/             # REST endpoints (auth, agents, tests, reports, etc.)
│   │   ├── models/          # SQLAlchemy ORM models
│   │   ├── schemas/         # Pydantic request/response schemas
│   │   ├── security/        # JWT auth and PBKDF2 password hashing
│   │   ├── services/        # Attack engine, sandbox mocks, policy engine, risk scorer
│   │   ├── config.py        # Configuration and environment variables
│   │   ├── database.py      # Database engine and session handling
│   │   └── main.py          # FastAPI application entrypoint
│   ├── test_api.py          # Automated pipeline test suite
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/      # UI components (AttackPathGraph, LiveActionStream, ScoreGauge, etc.)
│   │   ├── contexts/        # AuthContext, LanguageContext, ToastContext
│   │   ├── i18n/            # en.ts and hi.ts translations
│   │   ├── layouts/         # MainLayout and PublicLayout
│   │   ├── pages/           # 25+ application pages (Dashboard, Simulate, Retest, Reports, Admin, etc.)
│   │   ├── services/        # REST API client
│   │   ├── types/           # TypeScript interface definitions
│   │   ├── App.tsx          # Master router
│   │   ├── main.tsx
│   │   └── index.css        # Dark-first cybersecurity Tailwind styling
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
└── README.md
```

---

## 7. Installation & Quick Start

### Prerequisites
* **Node.js:** v18+ (tested on Node v24)
* **Python:** v3.10+ (tested on Python 3.13)

### Backend Setup
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Activate your virtual environment:
   ```bash
   # On Windows (PowerShell):
   .\venv\Scripts\Activate.ps1
   # On Linux/macOS:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run integration test suite:
   ```bash
   python test_api.py
   ```
5. Launch FastAPI development server:
   ```bash
   uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
   ```
   *FastAPI docs available at:* `http://localhost:8000/docs`

---

### Frontend Setup
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Build check:
   ```bash
   npm run build
   ```
4. Start Vite development server:
   ```bash
   npm run dev
   ```
   *Open application at:* `http://localhost:5173`

---

## 8. REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate user and receive JWT access token |
| `POST` | `/api/auth/register` | Register new organization account |
| `GET` | `/api/auth/me` | Retrieve active operator profile |
| `GET` | `/api/agents` | List registered AI agents |
| `POST` | `/api/agents` | Register new AI agent candidate |
| `GET` | `/api/agents/{id}` | Detailed agent metadata with policies and test stats |
| `POST` | `/api/tests/start` | Launch safe attack simulation |
| `POST` | `/api/tests/{id}/retest` | Execute signature retest with applied fix |
| `POST` | `/api/tests/{id}/replay` | Replay previous simulated attack run |
| `GET` | `/api/tests/{id}/logs` | Stream event logs for Action Monitor |
| `GET` | `/api/tests/{id}/attack-path` | Retrieve React Flow attack graph topology |
| `GET` | `/api/vulnerabilities` | List discovered sandbox vulnerabilities |
| `PUT` | `/api/vulnerabilities/{id}` | Update remediation status (`Pending`, `Applied`, `Verified`) |
| `GET` | `/api/reports/{test_id}` | Generate certified security assessment report |
| `GET` | `/api/dashboard/stats` | Aggregated dashboard KPI metrics |
| `GET` | `/api/dashboard/risk-trend` | Before vs after score delta analytics |
| `GET` | `/api/dashboard/earnings` | Simulated SaaS revenue metrics |
| `POST` | `/api/subscription/upgrade` | Upgrade subscription tier |
| `GET` | `/api/admin/stats` | Platform-wide administrative metrics |
| `GET` | `/api/admin/users` | Multi-tenant user directory |

---

## 9. Future Roadmap

* **Phase 1 (MVP - Current):** Safe sandbox simulation, 6 specialized test suites, policy engine, React Flow attack path graph, signature retest loop, Hindi/English i18n, demo accounts.
* **Phase 2:** MicroVM sandbox containers, live LLM proxy guardrails, multi-modal attack simulations (vision/audio), automated remediation pull request generator.
* **Phase 3:** Continuous CI/CD automated pipeline validation, multi-agent swarm red-teaming, enterprise compliance mapping (OWASP Top 10 for LLMs, NIST AI RMF).

---

## 10. Legal & Ethical Disclaimer

**TRUSTBREAK AI** is designed exclusively for authorized educational, testing, and defensive research purposes. All simulation mechanisms operate solely against mock assets and simulated agent environments. Users are strictly prohibited from utilizing this platform against live third-party targets or unauthorized production systems.
