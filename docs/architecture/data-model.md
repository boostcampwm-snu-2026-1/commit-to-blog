# 데이터 모델

## 도출 기준
포스트 목록 화면, 포스트 작성 화면 (에디터 + 챗), GitHub 레포 연동.

## 테이블 정의

### User
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | PK | |
| github_id | string | GitHub 유저 ID |
| username | string | |
| avatar_url | string | |
| access_token | string | GitHub OAuth 토큰 (암호화) |

### Repository
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | PK | |
| user_id | FK → User | |
| github_repo_id | string | GitHub 레포 ID |
| owner | string | 레포 소유자 |
| name | string | 레포 이름 |
| full_name | string | owner/name |
| clone_path | string | 서버에 클론된 경로 |
| cloned_at | datetime | |
| last_pulled_at | datetime | |

### Post
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | PK | |
| user_id | FK → User | |
| title | string | |
| content | text | 마크다운 |
| status | enum | draft / published |
| created_at | datetime | |
| updated_at | datetime | |
| published_at | datetime | nullable |

### PostRepoReference
포스트에 연결된 레포/브랜치 참조 (인라인 또는 태그).

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | PK | |
| post_id | FK → Post | |
| repo_id | FK → Repository | |
| branch | string | |
| reference_type | enum | inline / tag |

### ChatSession
포스트 1개당 1개의 챗 세션.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | PK | |
| post_id | FK → Post | |
| created_at | datetime | |

### ChatMessage
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | PK | |
| session_id | FK → ChatSession | |
| role | enum | user / assistant |
| content | text | |
| created_at | datetime | |

### ChatRepoContext
현재 챗 세션에서 에이전트가 참조 중인 레포 목록.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| session_id | FK → ChatSession | |
| repo_id | FK → Repository | |
| branch | string | |
