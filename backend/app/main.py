from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base, SessionLocal
from app.services.seed_data import seed_database
from app.api.auth_routes import router as auth_router
from app.api.agent_routes import router as agent_router
from app.api.test_routes import router as test_router
from app.api.vulnerability_routes import router as vuln_router
from app.api.report_routes import router as report_router
from app.api.dashboard_routes import router as dashboard_router
from app.api.subscription_routes import router as subscription_router
from app.api.notification_routes import router as notification_router
from app.api.admin_routes import router as admin_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create tables and seed demo records
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Break It Safely. Fix It. Trust It. — AI Agent Security Testing and Validation Platform",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(auth_router)
app.include_router(agent_router)
app.include_router(test_router)
app.include_router(vuln_router)
app.include_router(report_router)
app.include_router(dashboard_router)
app.include_router(subscription_router)
app.include_router(notification_router)
app.include_router(admin_router)

@app.get("/")
def root():
    return {
        "platform": settings.PROJECT_NAME,
        "tagline": settings.TAGLINE,
        "status": "operational",
        "notice": "Authorized Security Testing Only — All tests run in a controlled sandbox."
    }

@app.get("/api/health")
def health():
    return {"status": "healthy"}
