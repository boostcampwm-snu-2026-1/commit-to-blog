from anthropic import AsyncAnthropic

from app.core.config import Settings
from app.modules.drafts.schemas import DraftResponse
from app.modules.github.schemas import Commit
from app.utils.http_retry import call_with_retries


class LlmService:
    def __init__(self, settings: Settings) -> None:
        self.settings = settings

    async def create_blog_draft(self, repository_full_name: str, branch: str, commits: list[Commit]) -> DraftResponse:
        additions = sum(commit.additions for commit in commits)
        deletions = sum(commit.deletions for commit in commits)
        changed_files = sum(commit.changed_files for commit in commits)
        reading_minutes = max(2, min(8, round((len(commits) * 120 + changed_files * 30) / 250)))

        if self.settings.use_mocks:
            lines = "\n".join(
                f"- `{commit.sha}` {commit.message} · {commit.changed_files} files "
                f"· +{commit.additions}/-{commit.deletions}"
                for commit in commits
            )
            file_lines = "\n".join(
                f"- `{file.filename}` {file.status} (+{file.additions}/-{file.deletions})"
                for commit in commits
                for file in commit.files[:3]
            )
            title = f"{branch} 브랜치에서 블로그 생성 MVP 다듬기"
            summary = (
                f"{len(commits)}개 커밋, {changed_files}개 파일 변경, "
                f"+{additions}/-{deletions} 라인을 바탕으로 개발 흐름을 정리했습니다."
            )
            content = (
                f"# {title}\n\n"
                "## 오늘의 개발 맥락\n\n"
                "GitHub 활동을 읽고 바로 공유 가능한 개발 포스트로 바꾸는 MVP 경험을 기준으로 작업을 정리했습니다.\n\n"
                "## 커밋 하이라이트\n\n"
                f"{lines}\n\n"
                "## 변경 파일\n\n"
                f"{file_lines or '- 변경 파일 상세는 실제 GitHub API 연결 시 채워집니다.'}\n\n"
                "## 의사결정\n\n"
                "외부 API는 백엔드 서비스 계층에 격리하고, "
                "mock-first 흐름으로 키 없이도 제품 경험을 증명하도록 구성했습니다.\n\n"
                "## 다음 액션\n\n"
                "실제 diff 패치와 리뷰 코멘트를 더해 기술 회고의 밀도를 높입니다.\n"
            )
            return DraftResponse(
                title=title,
                repository_full_name=repository_full_name,
                branch=branch,
                summary=summary,
                content=content,
                hero_emoji="🚀",
                author="Claude Mock",
                reading_minutes=reading_minutes,
                commit_count=len(commits),
                changed_files=changed_files,
                additions=additions,
                deletions=deletions,
            )

        client = AsyncAnthropic(api_key=self.settings.anthropic_api_key)
        commit_context = "\n".join(
            f"- sha: {commit.sha}\n"
            f"  message: {commit.message}\n"
            f"  author: {commit.author}\n"
            f"  date: {commit.committed_at.isoformat()}"
            for commit in commits
        )
        file_context = "\n".join(
            "  files:\n"
            + "\n".join(
                f"    - {file.filename} ({file.status}, +{file.additions}/-{file.deletions})\n"
                f"      patch: {(file.patch or '')[:800]}"
                for file in commit.files
            )
            for commit in commits
        )
        response = await call_with_retries(
            lambda: client.messages.create(
                model=self.settings.anthropic_model,
                max_tokens=1400,
                system="You write polished Korean development blog posts from GitHub commit and file-change activity.",
                messages=[
                    {
                        "role": "user",
                        "content": (
                            "아래 GitHub 커밋 활동을 분석해서 개발 블로그 초안을 작성해줘. "
                            "제목, 요약, Markdown 본문을 만들고, SNS 피드에 어울리게 첫 문단은 짧고 강하게 써줘. "
                            "기술적 의사결정, 변경 파일 근거, 다음 단계를 포함해줘.\n\n"
                            f"repository: {repository_full_name}\n"
                            f"branch: {branch}\n"
                            f"commits:\n{commit_context}\n{file_context}"
                        ),
                    }
                ],
            )
        )
        content = "\n".join(block.text for block in response.content if getattr(block, "type", None) == "text")
        return DraftResponse(
            title=f"{repository_full_name} {branch} 개발 기록",
            repository_full_name=repository_full_name,
            branch=branch,
            summary=content.splitlines()[0][:200] if content else "Claude가 생성한 개발 블로그 초안입니다.",
            content=content,
            hero_emoji="✨",
            author="Claude",
            reading_minutes=reading_minutes,
            commit_count=len(commits),
            changed_files=changed_files,
            additions=additions,
            deletions=deletions,
        )
