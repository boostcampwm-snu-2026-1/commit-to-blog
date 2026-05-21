/**
 * LLM 어댑터.
 *
 * 모든 호출은 generateDraft({ commits }) → { title, content, summary } 시그니처로 통일.
 * 실제 제공자는 LLM_PROVIDER 환경변수로 선택. 기본값은 mock.
 *
 * 새 제공자를 추가할 때는: (1) generateDraftXxx 함수를 만들고 (2) PROVIDERS에 등록.
 * buildPrompt는 실제 호출 어댑터에서 공통으로 재사용.
 */

const PROVIDERS = {
  mock: generateDraftMock,
  anthropic: generateDraftAnthropic,
  openai: generateDraftOpenAI,
}

export async function generateDraft({ commits }) {
  if (!Array.isArray(commits) || commits.length === 0) {
    const err = new Error('generateDraft requires a non-empty commits array')
    err.code = 'EMPTY_COMMITS'
    err.status = 400
    throw err
  }

  const provider = process.env.LLM_PROVIDER || 'mock'
  const impl = PROVIDERS[provider]
  if (!impl) {
    const err = new Error(`Unknown LLM_PROVIDER: ${provider}`)
    err.code = 'UNKNOWN_PROVIDER'
    err.status = 500
    throw err
  }

  return impl({ commits })
}

// ─────────────────────────────────────────────────────────────────────────────
// Mock adapter — UI 흐름을 막지 않으려는 용도. 외부 호출 없음.

async function generateDraftMock({ commits }) {
  await new Promise((r) => setTimeout(r, 400))

  const first = commits[0]
  const firstLine = first.message.split('\n')[0].trim()
  const title = firstLine || '제목 없음'

  const fileLines = commits
    .flatMap((c) => c.files || [])
    .slice(0, 6)
    .map((f) => `- \`${f.filename}\` (${f.status}, +${f.additions}/-${f.deletions})`)

  const commitLines = commits.map((c) => {
    const head = c.message.split('\n')[0].trim()
    return `- ${c.sha.slice(0, 7)} — ${head}`
  })

  const sections = [
    `# ${title}`,
    `이번 작업에서는 ${commits.length}개의 커밋을 통해 ${firstLine} 관련 변경을 진행했습니다.`,
    ['## 주요 커밋', ...commitLines].join('\n'),
  ]
  if (fileLines.length) {
    sections.push(['## 변경된 파일', ...fileLines].join('\n'))
  }
  sections.push(
    ['## 다음 단계', '- 회귀 테스트 보강', '- 관련 문서 업데이트'].join('\n'),
    '> (이 글은 mock LLM 어댑터가 생성한 더미 초안입니다.)',
  )
  const content = sections.join('\n\n')

  const summary = `${commits.length}개의 커밋을 묶어 ${firstLine}에 대한 변경 사항을 정리했습니다. 주요 영향 범위와 다음 단계를 함께 다룹니다.`

  return { title, content, summary }
}

// ─────────────────────────────────────────────────────────────────────────────
// 실제 LLM 호출 — 구현 시점에 SDK 임포트 + 응답 파싱만 채우면 됨.
// 단일 함수 교체 지점.

async function generateDraftAnthropic({ commits }) {
  void buildPrompt({ commits })
  throw notImplemented('anthropic')
}

async function generateDraftOpenAI({ commits }) {
  void buildPrompt({ commits })
  throw notImplemented('openai')
}

function notImplemented(provider) {
  const err = new Error(
    `LLM_PROVIDER=${provider} is not implemented yet. Set LLM_PROVIDER=mock in .env.`,
  )
  err.code = 'PROVIDER_NOT_IMPLEMENTED'
  err.status = 501
  return err
}

// ─────────────────────────────────────────────────────────────────────────────
// 프롬프트 — 실제 호출 어댑터가 공유. 응답은 JSON 한 덩어리로 받도록 강제.

const MAX_PATCH_CHARS = 2000

export function buildPrompt({ commits }) {
  const commitBlocks = commits.map((c) => {
    const files = (c.files || [])
      .map((f) => {
        const patch = (f.patch || '').slice(0, MAX_PATCH_CHARS)
        return [
          `### ${f.filename} (${f.status}, +${f.additions}/-${f.deletions})`,
          '```diff',
          patch || '(patch omitted)',
          '```',
        ].join('\n')
      })
      .join('\n\n')

    return [
      `## Commit ${c.sha.slice(0, 7)} — ${c.message.split('\n')[0]}`,
      `Author: ${c.author?.name ?? 'unknown'} @ ${c.date ?? 'unknown date'}`,
      '',
      c.message,
      '',
      files,
    ].join('\n')
  })

  return [
    '당신은 개발 블로그 글쓰기를 돕는 한국어 어시스턴트입니다.',
    '아래에 주어진 GitHub 커밋들을 분석해, 개발자 동료가 읽을 만한 블로그 초안을 마크다운으로 작성하세요.',
    '',
    '요구사항:',
    '- 톤: 담백하고 정확한 한국어. 마케팅 어조 금지.',
    '- 구조: 도입부 1~2문장 → "## 주요 변경" → "## 영향 범위" → (선택) "## 다음 단계".',
    '- 길이: 본문 300~600자.',
    '- 코드 변경은 파일 단위로 요약. 의미 있는 변경만 언급.',
    '',
    '출력은 반드시 아래 JSON 형식 하나로만 응답하세요. 다른 텍스트 금지.',
    '{',
    '  "title": "글 제목 (한 줄)",',
    '  "content": "마크다운 본문",',
    '  "summary": "100~200자 한국어 요약"',
    '}',
    '',
    '── 커밋 목록 ──',
    '',
    commitBlocks.join('\n\n---\n\n'),
  ].join('\n')
}
