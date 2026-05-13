from anthropic import AsyncAnthropic

from app.config import Settings
from app.models import Commit, DraftResponse


class LlmService:
    def __init__(self, settings: Settings) -> None:
        self.settings = settings

    async def create_blog_draft(self, repository_full_name: str, branch: str, commits: list[Commit]) -> DraftResponse:
        if self.settings.use_mocks:
            lines = "\n".join(f"- `{commit.sha}` {commit.message} ({commit.author})" for commit in commits)
            title = f"{repository_full_name} {branch} 개발 기록"
            summary = f"{len(commits)}개 커밋을 바탕으로 {branch} 브랜치의 개발 흐름을 정리했습니다."
            content = (
                f"# {title}\n\n"
                "## 작업 배경\n\n"
                "이번 작업은 GitHub 활동 데이터를 개발 블로그 초안으로 전환하는 흐름을 검증하기 위해 진행했습니다.\n\n"
                "## 주요 변경\n\n"
                f"{lines}\n\n"
                "## 배운 점\n\n"
                "커밋 선택, 변경 요약, 편집 가능한 초안 저장 과정을 분리하면 외부 API 없이도 핵심 UX를 빠르게 증명할 수 있습니다.\n\n"
                "## 다음 단계\n\n"
                "실제 GitHub diff와 Claude 응답을 연결해 더 풍부한 기술 회고를 생성합니다.\n"
            )
            return DraftResponse(title=title, branch=branch, summary=summary, content=content)

        client = AsyncAnthropic(api_key=self.settings.anthropic_api_key)
        commit_context = "\n".join(
            f"- sha: {commit.sha}\n  message: {commit.message}\n  author: {commit.author}\n  date: {commit.committed_at.isoformat()}"
            for commit in commits
        )
        response = await client.messages.create(
            model=self.settings.anthropic_model,
            max_tokens=1400,
            system="You write concise Korean development blog drafts from Git commit activity.",
            messages=[
                {
                    "role": "user",
                    "content": (
                        "아래 GitHub 커밋 활동을 분석해서 개발 블로그 초안을 작성해줘. "
                        "제목, 요약, 본문을 Markdown으로 구분하고 기술적 의사결정과 다음 단계를 포함해줘.\n\n"
                        f"repository: {repository_full_name}\nbranch: {branch}\ncommits:\n{commit_context}"
                    ),
                }
            ],
        )
        content = "\n".join(block.text for block in response.content if getattr(block, "type", None) == "text")
        return DraftResponse(
            title=f"{repository_full_name} {branch} 개발 기록",
            branch=branch,
            summary=content.splitlines()[0][:200] if content else "Claude가 생성한 개발 블로그 초안입니다.",
            content=content,
        )
