from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.middleware import SlowAPIMiddleware
from starlette.middleware.base import BaseHTTPMiddleware

from .ml_model import ml_model
from .config import settings

limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="BIH Real Estate Estimator API",
    description="API to predict apartment prices in Bosnia and Herzegovina.",
    version="1.0.0"
)

app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        return response

app.add_middleware(SecurityHeadersMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    ml_model.load_model()
    ml_model.load_city_map()

@app.get("/", tags=["Root"])
@limiter.limit(f"{settings.RATE_LIMIT_REQUESTS}/{settings.RATE_LIMIT_MINUTES}minute")
async def read_root(request: Request):
    return {"message": "Welcome to the BIH Real Estate Estimator API. Go to /docs for details."}

from .router import router
app.include_router(router)