# 프로젝트 페이지 명세

> **참고 문서**: 이 파일은 프로젝트 페이지 전용 명세입니다.
> 공통 사항(Header, Footer, 반응형)은 `CLAUDE.md`를 함께 참고해주세요.

## Figma 노드 참조

작업 전 `get_design_context` 또는 `get_screenshot`으로 해당 노드를 직접 확인하세요.
파일 키: `7OjrgXkN43GXOCr6eT7iX9`

| 섹션 | 노드 ID |
|------|---------|
| 프로젝트 페이지 전체 | `1:2` |
| Header | `1:7` |
| 프로젝트 소개 섹션 | `3:20` |
| GitHub 통계 섹션 | `3:26` |
| Footer | `7:754` |

---

## 1. 프로젝트 소개 섹션

### 개요

- 섹션 상단: `나의 프로젝트를 소개합니다.` 타이틀 (좌측 주황색 원형 아이콘과 함께)
- 최대 3개의 프로젝트를 겹쳐진 카드 형태로 표시

### 프로젝트 탭 (오른쪽 사이드)

- 오른쪽 세로 탭: `Project 1`, `Project 2`, `Project 3` 레이블
- 탭 클릭 시 해당 프로젝트 섹션이 가장 왼쪽(최상단)으로 이동
- 현재 활성 프로젝트가 레이어 최상단에 위치

### 프로젝트 카드 레이아웃

```
[썸네일 이미지]   프로젝트 제목
                 YYYY.MM.DD ~ YYYY.MM.DD
                 프로젝트 한 줄 설명

─────────────────────────────────────────
Problem & Solve

  Problem 1   문제 설명
  Solve 1     해결 방법
  관련 PR (#제목), 관련 이슈 (#제목)

  Problem 2   문제 설명
  ...

[우측 영역: 스크린샷 또는 보조 이미지, 필수는 아님]
```

#### 프로젝트 카드 세부 사항

- **썸네일**: 단일 이미지 1장
- **기간**: `YYYY.MM.DD ~ YYYY.MM.DD` 형식
- **Problem & Solve**
  - Problem/Solve 쌍의 개수 제한 없음
  - 카드 내부 콘텐츠가 카드 높이를 초과하면 카드 내부에 **스크롤** 적용 (외부 레이아웃은 고정)
- **관련 PR / 관련 이슈**: 클릭 시 GitHub 외부 링크로 이동 (`target="_blank"`)

### 데이터

- mock 데이터 파일: `src/mocks/projects.json`

---

## 2. GitHub 통계 섹션

### 개요

- 섹션 타이틀: `깃허브를 구경해요.` (좌측 초록색 원형 아이콘과 함께)
- GitHub API를 통해 잔디(contribution) 데이터를 시각화
- **백엔드 서버**를 별도로 두어 GitHub Personal Access Token 관리

### 잔디 (Contribution Graph)

- **축**: 월(May~May) × 요일(Mon, Wed, Fri)
- **셀 색상**: 커밋 수에 따라 단계적으로 다른 색상 적용

  | 단계 | 기준 |
  |------|------|
  | 0단계 (비어있음) | 커밋 0개 |
  | 1단계 | 커밋 적음 |
  | 2단계 | 커밋 보통 |
  | 3단계 | 커밋 많음 |
  | 4단계 | 커밋 매우 많음 |

- 우측 하단에 `Less ···■ More` 범례 표시

#### 잔디 셀 클릭 상호작용

- 선택된 셀에 **border** 표시 + **꽃 아이콘** 표시
- 클릭 시 하단 활동 내용 패널이 해당 날짜 데이터로 업데이트

### 활동 내용 패널

클릭한 날짜에 따라 하단 영역이 업데이트된다.

#### 타이틀

```
N월 NN일 깃허브 활동을 요약했어요.
```

#### 커밋이 없는 날 (빈 상태)

```
N월 NN일 깃허브 활동을 요약했어요.
이날은 쉬었어요!
```

- 활동 요약, 주요 커밋 영역 미표시

#### 활동 요약 (AI 자동 생성)

- 해당 날짜의 커밋 데이터를 기반으로 **AI가 자동 요약** 생성
- 백엔드 개발 전에는 `src/mocks/commit-activity.json`의 `summary` 필드를 사용
- 로딩 중에는 **스켈레톤 UI** 표시
- 불릿 리스트 형태로 표시

#### 주요 커밋

- 해당 날짜에 커밋이 있는 **모든 프로젝트**를 순서대로 표시
- 프로젝트당 최대 **5개** 커밋 표시

##### 커밋 슬라이더

- 커밋들을 **원형 노드**로 연결된 타임라인으로 표시

  ```
  ● ─── ○ ─── ○ ─── ○ ─── ○
  ```

- 채워진 원(●): 현재 선택된 커밋
- 빈 원(○): 다른 커밋
- 원 클릭 시 해당 커밋 내용 표시
- **자동 슬라이드**: 3초마다 다음 원으로 이동 (마지막 커밋에서 첫 번째로 순환)
- 각 커밋 아래: 커밋 메시지 및 설명 표시
- `커밋으로 바로 가기` 링크: 해당 커밋 GitHub URL로 외부 링크 이동

### 데이터

- 잔디 mock 데이터: `src/mocks/contributions.json` (GitHub GraphQL 응답 스키마와 동일)
- 커밋 상세 mock 데이터: `src/mocks/commit-activity.json`

#### contributions.json 스키마

```
data.user.contributionsCollection.contributionCalendar
  ├── totalContributions: number
  ├── months[]: { name, year, firstDay, totalWeeks }
  └── weeks[]
        └── contributionDays[]
              ├── date: "YYYY-MM-DD"
              ├── contributionCount: number
              ├── color: string   ← GitHub 색상값 그대로 사용 가능
              └── weekday: 0~6   (0 = 일요일)
```

백엔드 연동 시 아래 GraphQL 쿼리를 사용하며, 응답 스키마가 mock과 동일하여 프론트 코드 변경 불필요:

```graphql
query($username: String!) {
  user(login: $username) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays { date contributionCount color weekday }
        }
        months { name year firstDay totalWeeks }
      }
    }
  }
}
```

#### commit-activity.json 스키마

```json
{
  "YYYY-MM-DD": {
    "date": "YYYY-MM-DD",
    "totalCount": 8,
    "summary": ["요약 문장 1", "요약 문장 2"],
    "projects": [
      {
        "projectId": "string",
        "commits": [
          { "message": "커밋 메시지", "url": "https://github.com/...", "sha": "abc123" }
        ]
      }
    ]
  }
}
```
