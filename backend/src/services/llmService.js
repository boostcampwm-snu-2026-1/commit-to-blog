const Anthropic = require('@anthropic-ai/sdk');
let client = null;

function getClient() {
  if (!client) {
    if (!process.env.ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY is not set in environment');
    client = new Anthropic();
  }
  return client;
}

function buildPrompt({ repoFullName, branch, commits, additionalContext }) {
  const commitSummaries = commits.map(c => {
    const fileSummary = c.files.slice(0, 5).map(f => `  - ${f.filename} (+${f.additions}/-${f.deletions})`).join('\n');
    return `커밋: ${c.sha.substring(0, 7)}\n메시지: ${c.message}\n변경 파일:\n${fileSummary}`;
  }).join('\n\n---\n\n');

  return `당신은 개발자 기술 블로그 작성 전문가입니다. 아래 GitHub 커밋 정보를 분석하여 한국어 개발 블로그 포스트를 작성해주세요.

저장소: ${repoFullName}
브랜치: ${branch}
${additionalContext ? `추가 컨텍스트: ${additionalContext}` : ''}

=== 커밋 정보 ===
${commitSummaries}

=== 작성 지침 ===
1. 제목: 변경 사항을 명확히 표현 (50자 이내)
2. 본문 (마크다운):
   - ## 개요: 변경의 목적과 배경
   - ## 주요 변경 사항: 기술적 세부 내용
   - ## 구현 과정: 접근 방식과 고려 사항
   - ## 결과: 변경 후 개선된 점
3. 요약: 1-2문장 핵심 요약

반드시 다음 JSON 형식으로만 응답하세요:
{"title":"제목","body":"마크다운 본문","summary":"요약"}`;
}

async function generateBlogPost(params) {
  const message = await getClient().messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 2000,
    messages: [{ role: 'user', content: buildPrompt(params) }],
  });
  const text = message.content[0].text;
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('LLM response did not contain valid JSON');
  return JSON.parse(match[0]);
}

module.exports = { generateBlogPost };
