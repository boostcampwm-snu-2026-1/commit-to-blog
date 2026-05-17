from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import posts, repos, chat

app = FastAPI(title="Commit to Blog API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(posts.router, prefix="/api/posts", tags=["posts"])
app.include_router(repos.router, prefix="/api/repos", tags=["repos"])
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])


@app.get("/health")
def health():
    return {"status": "ok"}
