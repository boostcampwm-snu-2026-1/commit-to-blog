import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';

// Mutable mock state — each test sets behavior on these.
const mockGetCommit = vi.fn();
const mockAnthropicCreate = vi.fn();

vi.mock('@octokit/rest', () => {
  class Octokit {
    repos: {
      getCommit: typeof mockGetCommit;
    };
    constructor(_opts?: unknown) {
      this.repos = {
        getCommit: mockGetCommit,
      };
    }
  }
  return { Octokit };
});

vi.mock('@anthropic-ai/sdk', () => {
  class Anthropic {
    messages: {
      create: typeof mockAnthropicCreate;
    };
    constructor(_opts?: unknown) {
      this.messages = {
        create: mockAnthropicCreate,
      };
    }
  }
  return { default: Anthropic };
});

// Import app AFTER the mocks so the route module receives the mocked clients.
const { default: app } = await import('../app.js');

const originalGithubToken = process.env.GITHUB_TOKEN;
const originalAnthropicKey = process.env.ANTHROPIC_API_KEY;

beforeEach(() => {
  mockGetCommit.mockReset();
  mockAnthropicCreate.mockReset();
  process.env.GITHUB_TOKEN = 'test-github-token';
  process.env.ANTHROPIC_API_KEY = 'test-anthropic-key';
});

afterEach(() => {
  if (originalGithubToken === undefined) {
    delete process.env.GITHUB_TOKEN;
  } else {
    process.env.GITHUB_TOKEN = originalGithubToken;
  }
  if (originalAnthropicKey === undefined) {
    delete process.env.ANTHROPIC_API_KEY;
  } else {
    process.env.ANTHROPIC_API_KEY = originalAnthropicKey;
  }
});

describe('POST /api/ai/draft', () => {
  it('returns 400 when body is empty', async () => {
    const res = await request(app).post('/api/ai/draft').send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
    expect(mockGetCommit).not.toHaveBeenCalled();
    expect(mockAnthropicCreate).not.toHaveBeenCalled();
  });

  it('returns 400 when commits array is empty', async () => {
    const res = await request(app).post('/api/ai/draft').send({
      owner: 'octocat',
      repo: 'repo-one',
      branch: 'main',
      commits: [],
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
    expect(mockGetCommit).not.toHaveBeenCalled();
    expect(mockAnthropicCreate).not.toHaveBeenCalled();
  });

  it('returns 500 when GITHUB_TOKEN is not set', async () => {
    delete process.env.GITHUB_TOKEN;

    const res = await request(app).post('/api/ai/draft').send({
      owner: 'octocat',
      repo: 'repo-one',
      branch: 'main',
      commits: ['abc123'],
    });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'GITHUB_TOKEN not set' });
    expect(mockGetCommit).not.toHaveBeenCalled();
    expect(mockAnthropicCreate).not.toHaveBeenCalled();
  });

  it('returns 500 when ANTHROPIC_API_KEY is not set', async () => {
    delete process.env.ANTHROPIC_API_KEY;
    mockGetCommit.mockResolvedValue({
      data: {
        sha: 'abc123',
        commit: { message: 'feat: hi' },
        files: [],
      },
    });

    const res = await request(app).post('/api/ai/draft').send({
      owner: 'octocat',
      repo: 'repo-one',
      branch: 'main',
      commits: ['abc123'],
    });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'ANTHROPIC_API_KEY not set' });
    expect(mockAnthropicCreate).not.toHaveBeenCalled();
  });

  it('returns 200 with markdown on happy path', async () => {
    mockGetCommit.mockResolvedValue({
      data: {
        sha: 'abc1234567890',
        commit: { message: 'feat: add hi' },
        files: [
          {
            filename: 'src/hi.ts',
            status: 'added',
            patch: '@@ -0,0 +1 @@\n+export const hi = 1;',
          },
        ],
      },
    });
    mockAnthropicCreate.mockResolvedValue({
      content: [{ type: 'text', text: '# Hello' }],
    });

    const res = await request(app).post('/api/ai/draft').send({
      owner: 'octocat',
      repo: 'repo-one',
      branch: 'main',
      commits: ['abc1234567890'],
    });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ markdown: '# Hello' });
    expect(mockGetCommit).toHaveBeenCalledWith({
      owner: 'octocat',
      repo: 'repo-one',
      ref: 'abc1234567890',
    });
    expect(mockAnthropicCreate).toHaveBeenCalledTimes(1);
    const callArg = mockAnthropicCreate.mock.calls[0]?.[0];
    expect(callArg.model).toBe('claude-sonnet-4-6');
    expect(callArg.max_tokens).toBe(4096);
    expect(Array.isArray(callArg.messages)).toBe(true);
    expect(callArg.messages[0].role).toBe('user');
    expect(typeof callArg.messages[0].content).toBe('string');
  });

  it('returns 429 on GitHub rate limit', async () => {
    mockGetCommit.mockRejectedValue({
      status: 403,
      message: 'API rate limit exceeded',
      response: { headers: { 'x-ratelimit-remaining': '0' } },
    });

    const res = await request(app).post('/api/ai/draft').send({
      owner: 'octocat',
      repo: 'repo-one',
      branch: 'main',
      commits: ['abc123'],
    });

    expect(res.status).toBe(429);
    expect(res.body).toEqual({ error: 'GitHub API rate limit exceeded' });
    expect(mockAnthropicCreate).not.toHaveBeenCalled();
  });

  it('returns 502 when Anthropic response has no text block', async () => {
    mockGetCommit.mockResolvedValue({
      data: {
        sha: 'abc123',
        commit: { message: 'feat: hi' },
        files: [],
      },
    });
    mockAnthropicCreate.mockResolvedValue({
      content: [{ type: 'tool_use', id: 'x', name: 'y', input: {} }],
    });

    const res = await request(app).post('/api/ai/draft').send({
      owner: 'octocat',
      repo: 'repo-one',
      branch: 'main',
      commits: ['abc123'],
    });

    expect(res.status).toBe(502);
    expect(res.body.error).toBeDefined();
  });
});
