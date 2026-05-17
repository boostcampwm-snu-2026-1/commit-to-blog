import { Router, Request, Response } from 'express';

const router = Router();

function getToken(req: Request): string {
  const token = req.headers['x-github-token'] as string;
  if (!token) throw new Error('GitHub 토큰이 없습니다. Settings에서 토큰을 입력해주세요.');
  return token;
}

async function githubFetch(path: string, token: string) {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message || `GitHub API 오류: ${res.status}`);
  }
  return res.json();
}

// diff는 LLM 토큰 한도 초과 방지를 위해 6000자로 자름
const DIFF_MAX_CHARS = 6000;

// GET /api/github/me — 토큰 유효성 확인
router.get('/me', async (req: Request, res: Response) => {
  try {
    const token = getToken(req);
    const data = await githubFetch('/user', token);
    res.json({ login: (data as { login: string }).login });
  } catch (err) {
    res.status(401).json({ error: (err as Error).message });
  }
});

// GET /api/github/repos?q=검색어 — 내 레포 목록
router.get('/repos', async (req: Request, res: Response) => {
  try {
    const token = getToken(req);
    const q = (req.query.q as string) || '';

    let repos;
    if (q) {
      // 검색어가 있으면 GitHub 검색 API 사용
      const data = await githubFetch(
        `/search/repositories?q=${encodeURIComponent(q)}+user:me&sort=updated&per_page=20`,
        token
      ) as { items: unknown[] };
      // 검색 API는 인증 사용자 레포만 필터링이 어려우므로 /user/repos로 대체
      const allRepos = await githubFetch(
        `/user/repos?sort=updated&per_page=100&affiliation=owner`,
        token
      ) as Array<{ name: string }>;
      repos = allRepos.filter((r) =>
        r.name.toLowerCase().includes(q.toLowerCase())
      );
      void data; // 검색 API 응답 미사용 처리
    } else {
      repos = await githubFetch(
        `/user/repos?sort=updated&per_page=30&affiliation=owner`,
        token
      );
    }

    res.json(repos);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// GET /api/github/branches/:owner/:repo — 브랜치 목록
router.get('/branches/:owner/:repo', async (req: Request, res: Response) => {
  try {
    const token = getToken(req);
    const { owner, repo } = req.params;
    const data = await githubFetch(
      `/repos/${owner}/${repo}/branches?per_page=50`,
      token
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// GET /api/github/commits/:owner/:repo?branch=브랜치명 — 커밋 목록
router.get('/commits/:owner/:repo', async (req: Request, res: Response) => {
  try {
    const token = getToken(req);
    const { owner, repo } = req.params;
    const branch = (req.query.branch as string) || '';

    const branchParam = branch ? `&sha=${encodeURIComponent(branch)}` : '';
    const data = await githubFetch(
      `/repos/${owner}/${repo}/commits?per_page=20${branchParam}`,
      token
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// GET /api/github/diff/:owner/:repo/:sha — 특정 커밋 diff
router.get('/diff/:owner/:repo/:sha', async (req: Request, res: Response) => {
  try {
    const token = getToken(req);
    const { owner, repo, sha } = req.params;

    const data = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits/${sha}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          // diff 형식으로 받기 위해 Accept 헤더 변경
          Accept: 'application/vnd.github.diff',
        },
      }
    );

    if (!data.ok) {
      const err = await data.json().catch(() => ({}));
      throw new Error((err as { message?: string }).message || `GitHub API 오류: ${data.status}`);
    }

    const diff = await data.text();
    const truncated = diff.length > DIFF_MAX_CHARS;

    res.json({
      diff: truncated ? diff.slice(0, DIFF_MAX_CHARS) + '\n... (truncated)' : diff,
      truncated,
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
