import type { Repo, Branch, Commit, Post } from './types';

export const mockRepos: Repo[] = [
  { id: 1, name: 'my-app', fullName: 'user/my-app', description: 'React 기반 웹 애플리케이션' },
  { id: 2, name: 'api-server', fullName: 'user/api-server', description: 'Express REST API 서버' },
  { id: 3, name: 'data-pipeline', fullName: 'user/data-pipeline', description: null },
];

export const mockBranches: Branch[] = [
  { name: 'main' },
  { name: 'develop' },
  { name: 'feature/auth' },
  { name: 'feature/dashboard' },
];

export const mockCommits: Commit[] = [
  {
    sha: 'a1b2c3d',
    message: 'feat: JWT 인증 미들웨어 추가',
    author: 'user',
    date: '2026-05-17T10:30:00Z',
  },
  {
    sha: 'e4f5g6h',
    message: 'fix: 토큰 만료 시 자동 갱신 로직 수정',
    author: 'user',
    date: '2026-05-16T14:20:00Z',
  },
  {
    sha: 'i7j8k9l',
    message: 'refactor: 사용자 서비스 레이어 분리',
    author: 'user',
    date: '2026-05-15T09:15:00Z',
  },
  {
    sha: 'm1n2o3p',
    message: 'docs: API 엔드포인트 명세 업데이트',
    author: 'user',
    date: '2026-05-14T16:45:00Z',
  },
  {
    sha: 'q4r5s6t',
    message: 'chore: 의존성 패키지 버전 업그레이드',
    author: 'user',
    date: '2026-05-13T11:00:00Z',
  },
];

export const mockPosts: Post[] = [
  {
    id: '1',
    title: 'JWT 인증 시스템 구현기',
    content: '# JWT 인증 시스템 구현기\n\nJWT를 활용한 인증 미들웨어를 구현했습니다...',
    status: 'published',
    repoName: 'api-server',
    branchName: 'feature/auth',
    createdAt: '2026-05-17T10:30:00Z',
    updatedAt: '2026-05-17T11:00:00Z',
  },
  {
    id: '2',
    title: 'Express 서비스 레이어 리팩토링',
    content: '# 서비스 레이어 분리\n\n컨트롤러에 비즈니스 로직이 집중되어...',
    status: 'draft',
    repoName: 'api-server',
    branchName: 'develop',
    createdAt: '2026-05-15T09:15:00Z',
    updatedAt: '2026-05-15T10:00:00Z',
  },
  {
    id: '3',
    title: '데이터 파이프라인 설계 회고',
    content: '# 데이터 파이프라인 설계\n\n이번 스프린트에서 파이프라인 구조를...',
    status: 'draft',
    repoName: 'data-pipeline',
    branchName: 'main',
    createdAt: '2026-05-13T11:00:00Z',
    updatedAt: '2026-05-13T12:30:00Z',
  },
];
