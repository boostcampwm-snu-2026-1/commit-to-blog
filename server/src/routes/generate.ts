import { Router, Request, Response } from 'express';
import OpenAI from 'openai';
import { GenerateRequest, GenerateResponse } from '../types';

const router = Router();

const SYSTEM_PROMPT = `당신은 개발 블로그 작성 전문가입니다.
주어진 Git 커밋 정보와 코드 변경사항을 바탕으로 개발자 독자를 위한 마크다운 블로그 글을 작성하세요.

작성 규칙:
- 제목은 구체적이고 검색 친화적으로
- 본문은 변경 배경 → 구현 내용 → 핵심 코드 설명 순으로 구성
- 코드 블록은 언어 태그 포함 (예: \`\`\`typescript)
- 전문 용어는 처음 등장 시 간단히 설명
- summary는 150자 이내로 핵심만

반드시 아래 JSON 형식으로만 응답하세요 (마크다운 코드 블록 없이 순수 JSON):
{"title":"...","content":"...(마크다운)","summary":"...(150자 이내)"}`;

// POST /api/generate — 커밋 정보 → 블로그 초안 생성
router.post('/', async (req: Request, res: Response) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'OPENAI_API_KEY가 설정되지 않았습니다. server/.env를 확인해주세요.' });
    return;
  }

  const { repoFullName, commitSha, commitMessage, diff } =
    req.body as Partial<GenerateRequest>;

  if (!commitMessage) {
    res.status(400).json({ error: 'commitMessage는 필수입니다.' });
    return;
  }

  try {
    const client = new OpenAI({ apiKey });

    const userMessage = [
      `저장소: ${repoFullName ?? ''}`,
      `커밋 SHA: ${commitSha ? commitSha.slice(0, 7) : ''}`,
      `커밋 메시지: ${commitMessage}`,
      '',
      diff ? `코드 변경사항 (diff):\n\`\`\`\n${diff}\n\`\`\`` : '(diff 없음)',
    ].join('\n');

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const raw = completion.choices[0]?.message?.content ?? '{}';
    const parsed = JSON.parse(raw) as Partial<GenerateResponse>;

    if (!parsed.title || !parsed.content) {
      res.status(500).json({ error: 'AI 응답 파싱 실패. 다시 시도해주세요.' });
      return;
    }

    const result: GenerateResponse = {
      title: parsed.title,
      content: parsed.content,
      summary: (parsed.summary ?? '').slice(0, 150),
    };

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
