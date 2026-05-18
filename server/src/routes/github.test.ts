import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';

const { listForAuthenticatedUser, listBranches, listCommits } = vi.hoisted(() => ({
  listForAuthenticatedUser: vi.fn(),
  listBranches: vi.fn(),
  listCommits: vi.fn(),
}));

vi.mock('@octokit/rest', () => ({
  Octokit: class MockOctokit {
    repos = {
      listForAuthenticatedUser,
      listBranches,
      listCommits,
    };
  },
}));

vi.mock('../env.js', () => ({
  env: {
    GITHUB_TOKEN: 'test_token',
    ANTHROPIC_API_KEY: 'test_anthropic',
    PORT: 3001,
  },
}));

const { createApp } = await import('../app.js');
const app = createApp();

beforeEach(() => {
  vi.clearAllMocks();
});

describe('GET /api/github/repos', () => {
  it('maps Octokit response to RepoSummary[]', async () => {
    listForAuthenticatedUser.mockResolvedValue({
      data: [
        { full_name: 'owner/a', default_branch: 'main' },
        { full_name: 'owner/b', default_branch: 'develop' },
      ],
    });

    const res = await request(app).get('/api/github/repos');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      data: [
        { name: 'owner/a', defaultBranch: 'main' },
        { name: 'owner/b', defaultBranch: 'develop' },
      ],
    });
  });

  it('filters by ?q substring (case-insensitive)', async () => {
    listForAuthenticatedUser.mockResolvedValue({
      data: [
        { full_name: 'owner/Foo', default_branch: 'main' },
        { full_name: 'owner/bar', default_branch: 'main' },
      ],
    });

    const res = await request(app).get('/api/github/repos?q=FO');

    expect(res.body.data).toEqual([{ name: 'owner/Foo', defaultBranch: 'main' }]);
  });
});

describe('GET /api/github/branches', () => {
  it('returns 400 INVALID_REPO when repo is missing', async () => {
    const res = await request(app).get('/api/github/branches');
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_REPO');
  });

  it('returns 400 when repo has no slash', async () => {
    const res = await request(app).get('/api/github/branches?repo=foo');
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_REPO');
  });

  it('returns 400 when repo has trailing slash', async () => {
    const res = await request(app).get('/api/github/branches?repo=foo/');
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_REPO');
  });

  it('returns branch names', async () => {
    listBranches.mockResolvedValue({
      data: [{ name: 'main' }, { name: 'develop' }],
    });

    const res = await request(app).get('/api/github/branches?repo=owner/repo');

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual(['main', 'develop']);
    expect(listBranches).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      per_page: 100,
    });
  });
});

describe('GET /api/github/commits', () => {
  it('returns 400 INVALID_REPO when repo is missing', async () => {
    const res = await request(app).get('/api/github/commits');
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_REPO');
  });

  it('returns 400 INVALID_BRANCH when branch is missing', async () => {
    const res = await request(app).get('/api/github/commits?repo=owner/repo');
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_BRANCH');
  });

  it('maps Octokit response to CommitSummary[] with first line of message and author login', async () => {
    listCommits.mockResolvedValue({
      data: [
        {
          sha: 'abc1234',
          commit: {
            message: 'first line\n\nbody here',
            author: { name: 'Fallback', date: '2026-01-01T00:00:00Z' },
          },
          author: { login: 'octocat' },
        },
      ],
    });

    const res = await request(app).get('/api/github/commits?repo=owner/repo&branch=main');

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([
      {
        sha: 'abc1234',
        message: 'first line',
        author: 'octocat',
        date: '2026-01-01T00:00:00Z',
      },
    ]);
  });

  it('falls back author to commit.author.name when no login', async () => {
    listCommits.mockResolvedValue({
      data: [
        {
          sha: 'x',
          commit: {
            message: 'm',
            author: { name: 'Limon', date: '2026-01-01T00:00:00Z' },
          },
          author: null,
        },
      ],
    });

    const res = await request(app).get('/api/github/commits?repo=o/r&branch=main');

    expect(res.body.data[0].author).toBe('Limon');
  });

  it('forwards limit query param to Octokit per_page', async () => {
    listCommits.mockResolvedValue({ data: [] });

    await request(app).get('/api/github/commits?repo=o/r&branch=main&limit=5');

    expect(listCommits).toHaveBeenCalledWith({
      owner: 'o',
      repo: 'r',
      sha: 'main',
      per_page: 5,
    });
  });

  it('defaults limit to 20 when not provided', async () => {
    listCommits.mockResolvedValue({ data: [] });

    await request(app).get('/api/github/commits?repo=o/r&branch=main');

    expect(listCommits).toHaveBeenCalledWith({
      owner: 'o',
      repo: 'r',
      sha: 'main',
      per_page: 20,
    });
  });

  it('clamps invalid limit to default 20', async () => {
    listCommits.mockResolvedValue({ data: [] });

    await request(app).get('/api/github/commits?repo=o/r&branch=main&limit=999');

    expect(listCommits).toHaveBeenCalledWith({
      owner: 'o',
      repo: 'r',
      sha: 'main',
      per_page: 20,
    });
  });
});
