import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';

// Mutable mock state — each test sets behavior on these.
const mockListForAuthenticatedUser = vi.fn();
const mockListBranches = vi.fn();
const mockListCommits = vi.fn();

vi.mock('@octokit/rest', () => {
  class Octokit {
    repos: {
      listForAuthenticatedUser: typeof mockListForAuthenticatedUser;
      listBranches: typeof mockListBranches;
      listCommits: typeof mockListCommits;
    };
    constructor(_opts?: unknown) {
      this.repos = {
        listForAuthenticatedUser: mockListForAuthenticatedUser,
        listBranches: mockListBranches,
        listCommits: mockListCommits,
      };
    }
  }
  return { Octokit };
});

// Import app AFTER the mock so the route module receives the mocked Octokit.
const { default: app } = await import('../app.js');

const originalToken = process.env.GITHUB_TOKEN;

beforeEach(() => {
  mockListForAuthenticatedUser.mockReset();
  mockListBranches.mockReset();
  mockListCommits.mockReset();
  process.env.GITHUB_TOKEN = 'test-token';
});

afterEach(() => {
  if (originalToken === undefined) {
    delete process.env.GITHUB_TOKEN;
  } else {
    process.env.GITHUB_TOKEN = originalToken;
  }
});

describe('GET /api/github/repos', () => {
  it('returns mapped repo list (200)', async () => {
    mockListForAuthenticatedUser.mockResolvedValue({
      data: [
        {
          name: 'repo-one',
          full_name: 'octocat/repo-one',
          private: false,
          default_branch: 'main',
          owner: { login: 'octocat' },
        },
      ],
    });

    const res = await request(app).get('/api/github/repos');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      {
        owner: 'octocat',
        name: 'repo-one',
        fullName: 'octocat/repo-one',
        private: false,
        defaultBranch: 'main',
      },
    ]);
    expect(mockListForAuthenticatedUser).toHaveBeenCalledWith({ per_page: 30 });
  });

  it('returns 500 when GITHUB_TOKEN is not set', async () => {
    delete process.env.GITHUB_TOKEN;

    const res = await request(app).get('/api/github/repos');

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'GITHUB_TOKEN not set' });
    expect(mockListForAuthenticatedUser).not.toHaveBeenCalled();
  });

  it('returns 429 on rate limit (403 + x-ratelimit-remaining: 0)', async () => {
    mockListForAuthenticatedUser.mockRejectedValue({
      status: 403,
      message: 'API rate limit exceeded',
      response: { headers: { 'x-ratelimit-remaining': '0' } },
    });

    const res = await request(app).get('/api/github/repos');

    expect(res.status).toBe(429);
    expect(res.body).toEqual({ error: 'GitHub API rate limit exceeded' });
  });

  it('returns 502 on generic GitHub error', async () => {
    mockListForAuthenticatedUser.mockRejectedValue({
      status: 500,
      message: 'boom',
    });

    const res = await request(app).get('/api/github/repos');

    expect(res.status).toBe(502);
    expect(res.body).toEqual({ error: 'boom' });
  });
});

describe('GET /api/github/repos/:owner/:repo/branches', () => {
  it('returns mapped branches (200)', async () => {
    mockListBranches.mockResolvedValue({
      data: [{ name: 'main' }, { name: 'dev' }],
    });

    const res = await request(app).get('/api/github/repos/octocat/repo-one/branches');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ name: 'main' }, { name: 'dev' }]);
    expect(mockListBranches).toHaveBeenCalledWith({
      owner: 'octocat',
      repo: 'repo-one',
      per_page: 30,
    });
  });
});

describe('GET /api/github/repos/:owner/:repo/commits', () => {
  it('returns 400 when branch query is missing', async () => {
    const res = await request(app).get('/api/github/repos/octocat/repo-one/commits');

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'branch query is required' });
    expect(mockListCommits).not.toHaveBeenCalled();
  });

  it('returns mapped commits (200) with author/date from commit.author', async () => {
    mockListCommits.mockResolvedValue({
      data: [
        {
          sha: 'abc123',
          commit: {
            message: 'feat: hi',
            author: { name: 'Octo Cat', date: '2026-01-01T00:00:00Z' },
          },
        },
        {
          sha: 'def456',
          commit: {
            message: 'fix: stuff',
            // missing author -> empty strings
            author: null,
          },
        },
      ],
    });

    const res = await request(app)
      .get('/api/github/repos/octocat/repo-one/commits')
      .query({ branch: 'main' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      {
        sha: 'abc123',
        message: 'feat: hi',
        author: 'Octo Cat',
        date: '2026-01-01T00:00:00Z',
      },
      {
        sha: 'def456',
        message: 'fix: stuff',
        author: '',
        date: '',
      },
    ]);
    expect(mockListCommits).toHaveBeenCalledWith({
      owner: 'octocat',
      repo: 'repo-one',
      sha: 'main',
      per_page: 30,
    });
  });
});
