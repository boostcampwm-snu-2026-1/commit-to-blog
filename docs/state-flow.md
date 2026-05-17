# UI 상태 흐름 설계 (docs/state-flow.md)

이 문서는 사용자의 동작에 따라 변화하는 프론트엔드의 주요 상태(State)를 정의합니다.

## 1. 상태 변수 정의 (State List)

### A. 요약할 커밋 로그 선택 기능

| 변수명 | 타입 | 의미 | 초기값 |
| :--- | :--- | :--- | :--- |
| **repos** | array | 내 레포지토리 목록 | `[]` |
| **selectedRepo** | string | 선택한 레포지토리 | `""` |
| **branches** | array | 브랜치 목록 | `[]` |
| **selectedBranch** | string | 선택한 브랜치 | `""` |
| **commits** | array | 커밋 로그 목록 | `[]` |
| **selectedCommit** | object | 선택한 커밋 로그 | `null` |

### B. 편집기 및 생성 기능

| 변수명 | 타입 | 의미 | 초기값 |
| :--- | :--- | :--- | :--- |
| **title** | string | 블로그 제목 | `""` |
| **content** | string | AI 요약 내용 | `""` |
| **isSummarizing** | boolean | AI 요약 중 여부 | `false` |
| **isSyncing** | boolean | 깃허브-DB 데이터 동기화 중 여부 | `false` |
| **tags** | array | 자동 추출된 태그 | `[]` |

### C. 보기 및 필터 기능

| 변수명 | 타입 | 의미 | 초기값 |
| :--- | :--- | :--- | :--- |
| **posts** | array | 저장된 블로그 포스트 목록 | `[]` |
| **repoFilter** | string | 리포지토리 필터 선택값 | `"전체"` |
| **typeFilter** | string | 작업 유형 필터 선택값 | `"전체"` |
| **tagFilter** | array | 기술 스택 태그 필터 선택값 | `[]` |

### D. 레이아웃 및 화면 제어

| 변수명 | 타입 | 의미 | 초기값 |
| :--- | :--- | :--- | :--- |
| **activeTab** | string | 현재 표시 중인 탭 (`"VIEW"` / `"WRITE"`) | `"VIEW"` |
| **editingPostId** | string | 현재 수정 중인 포스트의 ID | `null` |
