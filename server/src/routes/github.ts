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

export default router;
