import Anthropic from '@anthropic-ai/sdk';
import type { CommitDetail } from '../github.js';

export class MissingAnthropicKeyError extends Error {
  constructor() {
    super('ANTHROPIC_API_KEY not set');
    this.name = 'MissingAnthropicKeyError';
  }
}

/**
 * Build an Anthropic client using the current ANTHROPIC_API_KEY env var.
 * Read on every call so tests can swap the env var per-case.
 */
export function getAnthropic(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new MissingAnthropicKeyError();
  }
  return new Anthropic({ apiKey });
}

const MODEL = 'claude-sonnet-4-6';
const MAX_TOKENS = 4096;

const SYSTEM_PROMPT =
  '당신은 개발자의 GitHub 커밋들을 분석해 한국어 개발 블로그 초안을 작성하는 어시스턴트입니다. ' +
  '입력으로 받은 커밋 메시지와 코드 변경(diff)을 바탕으로, 무엇을 왜 바꿨는지, ' +
  '어떤 결정을 했는지 자연스럽게 markdown으로 정리하세요. ' +
  '결과는 순수 markdown만 반환합니다 (코드블록 ```으로 감싸지 마세요). ' +
  '제목은 # 로 시작하는 적절한 한 줄로 정합니다.';

export function buildPrompt(commits: CommitDetail[]): string {
  const sections = commits.map((commit) => {
    const shortSha = commit.sha.slice(0, 7);
    const fileList =
      commit.files.length > 0
        ? commit.files.map((f) => `- ${f.status} ${f.filename}`).join('\n')
        : '(no files)';

    const diffBlocks = commit.files
      .map((file) => {
        if (file.patch && file.patch.length > 0) {
          return `--- ${file.filename}\n\`\`\`\n${file.patch}\n\`\`\``;
        }
        return `--- ${file.filename}\n(binary or no patch)`;
      })
      .join('\n\n');

    return [
      `## Commit ${shortSha}`,
      'Message:',
      commit.message,
      '',
      'Changed files:',
      fileList,
      '',
      'Diff:',
      diffBlocks,
    ].join('\n');
  });

  return sections.join('\n\n');
}

export async function generateDraft(commits: CommitDetail[]): Promise<string> {
  const client = getAnthropic();
  const userPrompt = buildPrompt(commits);

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userPrompt }],
  });

  const firstBlock = response.content[0];
  if (!firstBlock || firstBlock.type !== 'text') {
    throw new Error('Anthropic response missing text content');
  }
  const text = firstBlock.text;
  if (text.length === 0) {
    throw new Error('Anthropic response returned empty text');
  }
  return text;
}
