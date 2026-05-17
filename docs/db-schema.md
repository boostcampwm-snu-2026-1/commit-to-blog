# 데이터베이스 스키마 설계 (docs/db-schema.md)

이 문서는 MongoDB(Mongoose)에서 사용할 데이터 모델의 구조를 정의합니다.

## 1. Post Model (블로그 포스트)
사용자가 AI 요약을 거쳐 편집 및 저장한 최종 블로그 게시물 데이터입니다.

| 필드명 | 타입 | 필수 | 설명 |
| :--- | :--- | :---: | :--- |
| **title** | String | O | 블로그 포스트 제목 |
| **content** | String | O | 마크다운 형식의 본문 내용 |
| **tags** | [String] | X | 기술 스택 및 키워드 태그 배열 |
| **repoName** | String | O | 대상 GitHub 리포지토리 전체 이름 (owner/repo) |
| **commitSha** | String | O | 연결된 GitHub 커밋의 고유 SHA (Unique) |
| **githubUrl** | String | X | 해당 커밋의 GitHub 상세 페이지 URL |
| **createdAt** | Date | O | 포스트 생성 일시 (기본값: Now) |
| **updatedAt** | Date | O | 포스트 수정 일시 (기본값: Now) |

---

## 2. GitHub Cache Model (트리 구조)
GitHub API 호출 최적화를 위해 데이터를 계층 구조로 캐싱합니다.

### A. Repository
- **name**: 리포지토리 이름
- **owner**: 소유자 ID/이름

### B. Branch
- **name**: 브랜치 이름
- **repoId**: 부모 Repository의 `_id` (ObjectId 참조)

### C. Commit
- **sha**: 커밋 SHA
- **message**: 커밋 메시지
- **date**: 커밋 날짜 (GitHub 데이터 기준)
- **branchId**: 부모 Branch의 `_id` (ObjectId 참조)
