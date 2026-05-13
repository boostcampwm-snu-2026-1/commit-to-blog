# 구현 범위 (Scope)

> 2주 안에 끝낼 일과, 일부러 미루는 일을 분명히 한다.
> 우선순위는 **Must → Should → Could**. Won't 는 명시적으로 배제.

---

## Must (반드시 — 12주차 종료 시점에 동작해야 함)

| ID | 항목 | 검증 방법 |
|---|---|---|
| M1 | `apps/server` Express+TS 부트 + `GET /healthz` | `curl localhost:4000/healthz` → `{ "ok": true }` |
| M2 | Octokit GraphQL 클라이언트로 `viewer.repositories` 조회 | `GET /api/repos` 응답 JSON 에 본인 repo 다수 포함 |
| M3 | 브랜치 / 커밋 엔드포인트 | 11주차에는 라우트 stub만, 12주차에 실제 응답 |
| M4 | LLM 요약 엔드포인트 (`POST /api/posts/draft`) | 12주차: 한 커밋 입력 → 한국어 블로그 초안 응답 |
| M5 | React 카드 목록 (`Saved Posts` 화면) | `/` 진입 시 저장된 포스트 0~N 개 렌더 |
| M6 | React 포스트 작성 화면 (`/create`) | 저장소 검색 → 브랜치 선택 → 커밋 선택 → AI 요약 → 편집기 |
| M7 | 포스트 영속화 | JSON 파일에 저장, 재시작 후에도 조회 가능 |
| M8 | 발행 동작 | `draft` ↔ `published` 토글이 카드 뱃지에 반영 |

## Should (있으면 좋음)

| ID | 항목 | 비고 |
|---|---|---|
| S1 | 커밋 다중 선택 → 하나의 글로 묶기 | 12주차 후반 |
| S2 | 마크다운 미리보기 (편집기 옆) | `react-markdown` 후보 |
| S3 | 발행된 포스트 상세 페이지 (`/posts/:id`) | 공유 URL 용도 |
| S4 | LLM 호출 결과 캐시 (같은 sha + 같은 모델) | 비용/속도 |

## Could (시간 남으면)

| ID | 항목 |
|---|---|
| C1 | 다크 모드 토글 |
| C2 | 포스트 본문 검색 |
| C3 | 태그 / 카테고리 시스템 |
| C4 | 발행된 포스트 export (`.md` 다운로드) |

## Won't (이번 2주 안에는 하지 않음)

| ID | 항목 | 이유 |
|---|---|---|
| W1 | OAuth 로그인 | 단일 사용자 가정. PAT 로 충분 |
| W2 | 멀티 유저 / 권한 모델 | 범위 폭발 |
| W3 | DB (Postgres/SQLite) | JSON 파일로 충분, 도입은 미래 작업 |
| W4 | 외부 블로그 플랫폼 publish (Medium, Velog 등) | 시간 부족 |
| W5 | 모바일 전용 디자인 | 데스크탑 우선, 반응형은 best-effort |
| W6 | 댓글 / 좋아요 / 알림 | 본질 기능 아님 |
| W7 | i18n / 다국어 | 한국어 단일 |
| W8 | Production 배포 (Vercel/Render) | 로컬 데모로 충분 |

## 합의된 단순화

- **인증**: PAT 한 개 (`.env`). 클라이언트는 사용자명/토큰을 절대 다루지 않음.
- **저장소**: 단일 GitHub 계정 (token 소유자) 의 repo 만 다룸.
- **저장**: in-memory Map + `data/posts.json` 영속화. 동시성 고려 X (단일 프로세스).
- **시간대**: 모든 timestamp 는 ISO 8601 UTC 저장, 표시 시점에 KST 로 변환.

## 정확도 vs 속도 트레이드오프

- 검색은 디바운스 300ms 로 응답성 우선.
- LLM 응답은 정확도 우선 → streaming 미적용 (12주차 시간 남으면 도입).
- diff 가 큰 커밋은 잘라서 보냄 (truncate). 12주차에 임계치 정함.
