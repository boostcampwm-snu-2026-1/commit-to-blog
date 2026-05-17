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
| **tagFilter** | array | 기술 스택 태그 필터 선택값 | `[]` |

### D. 레이아웃 및 화면 제어

| 변수명 | 타입 | 의미 | 초기값 |
| :--- | :--- | :--- | :--- |
| **activeTab** | string | 현재 표시 중인 탭 (`"VIEW"` / `"WRITE"`) | `"VIEW"` |
| **editingPostId** | string | 현재 수정 중인 포스트의 ID | `null` |

## 2. 상태 흐름 (State Flow)

### D. 레이아웃 및 화면 제어
- **D-1 (탭 전환)**: `activeTab` 변경 시 UI가 `"VIEW"`(블로그 목록)와 `"WRITE"`(커밋 선택 및 편집기) 사이를 전환함.
- **D-2 (수정 모드 진입)**: 
    1. `"VIEW"` 탭의 특정 포스트에서 [수정] 버튼 클릭.
    2. `editingPostId`에 해당 포스트의 ID가 할당됨.
    3. `activeTab`이 `"WRITE"`로 자동 전환되어 편집기 화면이 노출됨.
- **D-3 (수정 모드 종료)**: 저장 완료 또는 취소 시 `editingPostId`를 `null`로 초기화하여 수정 상태를 해제함.

### B. 편집기 및 생성 기능
- **B-1 (상태 잠금)**: [동기화] 또는 [요약] 버튼 클릭 -> `isSyncing` 또는 `isSummarizing` → `true` 전환 (UI 로딩 처리).
- **B-2 (데이터 반영)**: 백엔드 응답 수신 시 -> `title`, `content`, `tags` 상태가 새로운 데이터로 치환됨.
- **B-3 (상태 해제)**: 데이터 반영 완료 후 -> `isSyncing` 또는 `isSummarizing` → `false`로 복구 (로딩 종료).

### C. 보기 및 필터 기능
- **C-1 (데이터 로드)**: 페이지 마운트 시 `useEffect` 트리거 -> DB에서 전체 포스트 목록을 가져와 `posts` 상태 초기화.
- **C-2 (리포지토리 필터링)**: `repoFilter` 변경 시 -> 해당 리포지토리에 속한 포스트들만 필터링하여 UI 갱신.
- **C-3 (태그 입력 및 필터링)**: 
    1. 사용자가 필터 바 입력창에 태그 입력 후 엔터 클릭.
    2. 입력값이 `tagFilter` 배열에 추가됨 (상태 전이).
    3. `tagFilter` 변경을 감지하여 `posts` 목록 중 해당 태그들을 모두 포함하는 항목만 추출.
    4. 필터 뱃지의 제거(x) 버튼 클릭 시 `tagFilter`에서 해당 값이 삭제되며 필터링 결과가 실시간으로 복구됨.
