import logging
from contextlib import asynccontextmanager
from time import perf_counter
from uuid import uuid4

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import Response

from app.api.v1.api_router import api_router
from app.core.config import get_settings
from app.core.logging import configure_logging


@asynccontextmanager
async def lifespan(app: FastAPI):
    configure_logging()
    yield


settings = get_settings()
logger = logging.getLogger("app.request")

app = FastAPI(
    title="Commit to Blog API",
    description="Analyze GitHub activity and generate editable development blog drafts.",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def request_context_middleware(request: Request, call_next) -> Response:
    request_id = request.headers.get("x-request-id") or str(uuid4())
    started_at = perf_counter()
    try:
        response = await call_next(request)
    except Exception:
        elapsed_ms = round((perf_counter() - started_at) * 1000, 2)
        logger.exception(
            "request_failed request_id=%s method=%s path=%s elapsed_ms=%s",
            request_id,
            request.method,
            request.url.path,
            elapsed_ms,
        )
        raise

    elapsed_ms = round((perf_counter() - started_at) * 1000, 2)
    response.headers["x-request-id"] = request_id
    logger.info(
        "request_completed request_id=%s method=%s path=%s status_code=%s elapsed_ms=%s",
        request_id,
        request.method,
        request.url.path,
        response.status_code,
        elapsed_ms,
    )
    return response


app.include_router(api_router)
