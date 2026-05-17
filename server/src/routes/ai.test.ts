import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';

// Mutable mock state — each test sets behavior on these.
const mockGetCommit = vi.fn();
const mockGenerateContent = vi.fn();

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

vi.mock('@google/genai', () => {
  class GoogleGenAI {
    models: { generateContent: typeof mockGenerateContent };
    constructor(_opts?: unknown) {
      this.models = { generateContent: mockGenerateContent };
    }
  }
  return { GoogleGenAI };
});

// Import app AFTER the mocks so the route module receives the mocked clients.
const { default: app } = await import('../app.js');

const originalGithubToken = process.env.GITHUB_TOKEN;
const originalGeminiKey = process.env.GEMINI_API_KEY;

beforeEach(() => {
  mockGetCommit.mockReset();
  mockGenerateContent.mockReset();
  process.env.GITHUB_TOKEN = 'test-github-token';
  process.env.GEMINI_API_KEY = 'test-gemini-key';
});

afterEach(() => {
  if (originalGithubToken === undefined) {
    delete process.env.GITHUB_TOKEN;
  } else {
    process.env.GITHUB_TOKEN = originalGithubToken;
  }
  if (originalGeminiKey === undefined) {
    delete process.env.GEMINI_API_KEY;
  } else {
    process.env.GEMINI_API_KEY = originalGeminiKey;
  }
});

describe('POST /api/ai/draft', () => {
  it('returns 400 when body is empty', async () => {
    const res = await request(app).post('/api/ai/draft').send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
    expect(mockGetCommit).not.toHaveBeenCalled();
    expect(mockGenerateContent).not.toHaveBeenCalled();
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
    expect(mockGenerateContent).not.toHaveBeenCalled();
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
    expect(mockGenerateContent).not.toHaveBeenCalled();
  });

  it('returns 500 when GEMINI_API_KEY is not set', async () => {
    delete process.env.GEMINI_API_KEY;
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
    expect(res.body).toEqual({ error: 'GEMINI_API_KEY not set' });
    expect(mockGenerateContent).not.toHaveBeenCalled();
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
    mockGenerateContent.mockResolvedValue({
      text: '# Hello',
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
    expect(mockGenerateContent).toHaveBeenCalledTimes(1);
    const callArg = mockGenerateContent.mock.calls[0]?.[0];
    expect(callArg.model).toBe('gemini-2.5-flash');
    expect(callArg.config.maxOutputTokens).toBe(4096);
    expect(typeof callArg.config.systemInstruction).toBe('string');
    expect(typeof callArg.contents).toBe('string');
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
    expect(mockGenerateContent).not.toHaveBeenCalled();
  });

  it('returns 502 when Gemini response has no text', async () => {
    mockGetCommit.mockResolvedValue({
      data: {
        sha: 'abc123',
        commit: { message: 'feat: hi' },
        files: [],
      },
    });
    mockGenerateContent.mockResolvedValue({
      text: undefined,
      candidates: [],
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
