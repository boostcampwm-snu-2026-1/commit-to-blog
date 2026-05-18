import type { CommitDetail } from 'shared';

type BlogDraftPromptInput = {
  repo: string;
  branch: string;
  commit: CommitDetail;
};

export function buildBlogDraftPrompt({ repo, branch, commit }: BlogDraftPromptInput): string {
  const shortSha = commit.sha.slice(0, 7);
  const bodySection = commit.body.trim() ? `\n\n${commit.body.trim()}` : '';

  return `당신은 GitHub 커밋을 분석해서 한국어 개발 블로그 초안을 작성하는 도우미입니다.

# 입력
- 저장소: ${repo}
- 브랜치: ${branch}
- 커밋 SHA: ${shortSha}
- 작성자: ${commit.author}
- 날짜: ${commit.date}

## 커밋 메시지
${commit.message}${bodySection}

## 변경 요약
${commit.diffSummary}

# 작업
위 커밋을 바탕으로 한국어 개발 블로그 글 초안을 작성하세요.
아래 형식의 **JSON 객체만** 출력하세요. 코드 펜스(\`\`\`), 설명, 머리말, 꼬리말은 포함하지 마세요.

{
  "title": "블로그 글 제목 (40자 이내, 명사형, 이모지 금지)",
  "summary": "1~2문장으로 작업의 핵심을 요약 (카드 미리보기용)",
  "body": "markdown 본문 (300~600자, '무엇을 / 왜 / 어떻게' 흐름)"
}

# 작성 규칙
- 커밋 메시지와 변경 요약에 적힌 사실만 사용. 추측·과장·홍보 표현 금지.
- 독자 관점에서 변경의 의도와 영향을 풀어 설명.
- body는 적절한 줄바꿈을 사용하되 헤더 남용 금지(필요할 때만 \`##\`).
- 출력은 유효한 JSON 한 덩어리만.`;
}
