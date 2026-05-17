# Week 2 Plan: 개발 & 통합 (2026-05-25 ~ 2026-05-31)

## 목표
1주차 설계를 바탕으로 핵심 기능을 완전히 구현하고, 엔드투엔드로 동작하는 서비스를 완성한다.

## 완료 기준 (Definition of Done)

### 필수 기능
- [ ] GitHub 저장소 목록 조회 동작 (실제 API 연동)
- [ ] 브랜치 목록 조회 동작
- [ ] 커밋 목록 다중 선택 가능 (체크박스)
- [ ] AI 블로그 초안 생성 (한국어, 기술 블로그 형식)
- [ ] 생성된 초안 편집 가능 (제목 + 본문)
- [ ] 포스트 저장 동작 (SQLite)
- [ ] 저장된 포스트 카드 목록 표시
- [ ] 저장된 포스트 재편집 가능
- [ ] 발행(published=true) 기능 동작
- [ ] API 키 안전 관리 (.env, 절대 프론트엔드 노출 없음)

### 품질 기준
- [ ] 전체 플로우 (저장소 선택 → 커밋 → AI 생성 → 저장) 오류 없이 동작
- [ ] 에러 메시지 사용자 친화적 표시
- [ ] 로딩 상태 표시 (AI 생성 중, 저장 중)

## 구현 순서

### Day 1-2: 백엔드 기반
1. Express 서버 기동 확인 (GET /api/health → 200 OK)
2. SQLite posts 테이블 생성 (initDb)
3. GET /api/posts, POST /api/posts 동작 확인

### Day 2-3: GitHub API 연동
1. GET /api/github/repos 동작 (실제 토큰으로 테스트)
2. GET /api/github/repos/:owner/:repo/branches 동작
3. GET /api/github/repos/:owner/:repo/commits 동작
4. GET /api/github/repos/:owner/:repo/commits/:sha (diff 포함)

### Day 3-4: LLM 연동
1. POST /api/blog/generate 동작
2. 커밋 diff를 프롬프트에 포함
3. 한국어 기술 블로그 형식 출력 확인
4. JSON 파싱 에러 처리

### Day 4-6: 프론트엔드
1. PostsListPage 완성 (빈 상태 + 카드 목록)
2. CreatePostPage 위자드 4단계 완성
3. EditPostPage 완성
4. API 연결 및 에러 핸들링

### Day 7: 통합 테스트 & 개선
1. 엔드투엔드 시나리오 2개 실행
2. 버그 수정
3. README 업데이트

## 테스트 시나리오

### Scenario 1: 새 포스트 생성
1. http://localhost:5173 접속
2. "새 글 작성" 클릭
3. commit-to-blog 저장소 선택
4. main 브랜치 선택
5. 최근 커밋 2개 체크
6. "AI로 초안 생성" 클릭 → 한국어 초안 표시
7. 제목 수정 → "저장하기" 클릭
8. 홈에서 새 카드 확인

### Scenario 2: 편집 & 발행
1. 홈에서 카드 "편집 →" 클릭
2. 내용 수정
3. "발행하기" 클릭
4. 홈에서 "발행됨" 뱃지 확인

## 커스텀 스킬 활용

.claude/skills/blog-from-commits.md 스킬 사용:
- LLM 프롬프트 품질이 낮을 때 이 스킬의 "Quality Iteration Guide" 참고
- 에러 발생 시 "Error Handling" 섹션 확인

## AI Workflow 개선 (2주차)

1주차 대비 개선:
- 검증 단계 강화: 각 API 연동 후 curl로 즉시 테스트
- 에러 로깅 강화: errorHandler에서 상세 로그
- 프롬프트 튜닝: 블로그 품질 피드백 반영

## 위험 요소 & 대응

| 위험 | 대응 |
|------|------|
| better-sqlite3 빌드 실패 | node-gyp 설치: npm install -g node-gyp |
| CORS 오류 | Express cors 미들웨어 origin 확인 |
| LLM JSON 파싱 실패 | 정규식으로 JSON 추출, 재시도 로직 |
| GitHub API 429 (rate limit) | 요청 간격 조절, 캐싱 |
