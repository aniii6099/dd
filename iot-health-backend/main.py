from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from database import connect_db, close_db
from routes.data import router as data_router
from routes.ws import router as ws_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown lifecycle events."""
    await connect_db()
    yield
    await close_db()


app = FastAPI(
    title="IoT Smart Health Monitor API",
    description="Real-time health monitoring API for ESP32 + FastAPI + MongoDB",
    version="1.0.0",
    lifespan=lifespan,
)

# ── CORS ────────────────────────────────────────────────────────────────────
# Allow the React dev server (localhost:5173) and any other origin during dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ─────────────────────────────────────────────────────────────────
app.include_router(data_router)
app.include_router(ws_router)


@app.get("/")
async def root():
    return {
        "message": "IoT Smart Health Monitor API is running 🚀",
        "docs": "/docs",
        "websocket": "ws://localhost:8000/ws",
    }
