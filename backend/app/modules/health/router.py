from fastapi import APIRouter, Depends
from sqlmodel import Session, text

from app.api.dependencies import get_session

router = APIRouter(tags=["health"])


@router.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "commit-to-blog-api"}


@router.get("/ready")
def ready(session: Session = Depends(get_session)) -> dict[str, str]:
    session.exec(text("SELECT 1")).one()
    return {"status": "ready"}
