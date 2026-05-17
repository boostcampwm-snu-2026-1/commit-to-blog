# design.md

이 문서는 제공된 UI 화면(저장된 포스트 목록, 커밋 선택 및 AI 요약 화면)을 기반으로 도출한 **디자인 토큰 및 UI 컴포넌트 사양**입니다. 프론트엔드 개발 시 CSS Modules의 변수(`:root`)로 등록하여 엄격하게 준수해야 합니다.

---

## 1. 컬러 토큰 (Color Tokens)

### 1.1. Background (배경)
- `--color-bg-default`: `#F8F9FA` (메인 레이아웃의 전체 배경색, 아주 옅은 회색)
- `--color-bg-paper`: `#FFFFFF` (헤더, 카드, 본문 컨테이너 등 콘텐츠 영역 배경)
- `--color-bg-input`: `#FFFFFF` (검색창, 선택 박스 배경)
- `--color-bg-muted`: `#F3F4F6` (AI 요약 텍스트 박스 내부 등 강조되지 않은 배경)

### 1.2. Text (텍스트)
- `--color-text-primary`: `#111827` (제목, 본문 기본 텍스트, 완전한 검은색에 가까운 진회색)
- `--color-text-secondary`: `#6B7280` (설명글, 날짜, 작성자 이름 등 보조 텍스트)
- `--color-text-placeholder`: `#9CA3AF` (인풋창의 플레이스홀더 텍스트)

### 1.3. Brand & Accent (브랜드 및 강조 포인트)
- `--color-primary`: `#000000` (주요 액션 버튼: '블로그 생성', '발행하기', '블로그 포스트로 저장 및 게시')
- `--color-primary-text`: `#FFFFFF` (주요 액션 버튼 내부 텍스트)
- `--color-accent-blue`: `#2563EB` (AI 요약 아이콘 및 텍스트)

### 1.4. Status & Tag (상태 및 태그)
- `--color-tag-bg`: `#EFF6FF` (브랜치명, 커밋 해시 태그의 배경색 - 연한 파란색)
- `--color-tag-text`: `#1D4ED8` (브랜치명, 커밋 해시 태그의 텍스트색 - 진한 파란색)
- `--color-border-default`: `#E5E7EB` (카드 테두리, 구분선, 인풋창 테두리)
- `--color-border-active`: `#000000` (활성화된 커밋 아이템 테두리)

---

## 2. 타이포그래피 (Typography)

- **Font Family**: `Pretendard`, `Noto Sans KR`, `sans-serif` (시스템 폰트 스택 적용)

### 2.1. Heading (제목)
- **H1 (페이지 타이틀)**: `24px` / `Bold` / `--color-text-primary` (예: "저장된 포스트", "선택된 커밋")
- **H2 (카드 타이틀, 커밋 제목)**: `18px` / `Bold` 또는 `SemiBold` / `--color-text-primary`
- **H3 (섹션 타이틀)**: `16px` / `Bold` / `--color-accent-blue` (예: "🤖 AI 요약")

### 2.2. Body (본문)
- **Body 1 (기본 본문)**: `14px` / `Regular` / `--color-text-primary` (카드 요약문, AI 생성 내용)
- **Body 2 (보조 텍스트)**: `13px` / `Regular` / `--color-text-secondary` (작성자, 148 chars 등)
- **Caption (날짜, 태그)**: `12px` / `Medium` / `--color-text-secondary` 또는 `--color-tag-text`

---

## 3. 레이아웃 및 여백 (Layout & Spacing)

- **Max Width**: `1200px` (또는 `1024px`) 중앙 정렬 (`margin: 0 auto`)
- **Header Height**: `64px` (상단 고정 또는 스크롤)
- **Footer Height**: `80px` ~ `100px`
- **Gutter (단 간격)**: `24px` (카드 사이의 간격, 사이드바와 메인 컨텐츠 사이의 간격)
- **Border Radius**: 
  - 기본 컨테이너/카드: `8px`
  - 버튼/인풋: `4px`
  - 태그(Pill): `4px` (또는 양끝이 둥근 형태 `9999px`)

---

## 4. 핵심 UI 컴포넌트 사양

### 4.1. Navigation Header
- **구조**: 로고 (좌) / 메뉴 탭 (중앙 좌측) / 프로필 아이콘 (우)
- **스타일**: 높이 64px, 하단에 1px 옅은 테두리(`--color-border-default`), 배경색 `--color-bg-paper`.
- **활성 탭**: 텍스트 `Bold` 처리 및 하단에 검은색 실선 언더라인 2px (예: "Saved Posts").

### 4.2. Buttons
- **Primary Button (블랙)**: 배경 `#000`, 글자 `#FFF`, 테두리 없음. 호버 시 투명도 90% 또는 `#333`.
- **Secondary Button (아웃라인)**: 배경 `#FFF`, 글자 `#000`, 테두리 1px `#E5E7EB` (예: "수정하기", "취소").
- **Ghost Button (회색 배경)**: 배경 `#F3F4F6`, 글자 `#6B7280` (예: "요약 생성" 비활성 상태).

### 4.3. Cards (저장된 포스트 목록)
- **구조**: 상단(태그, 날짜) -> 제목 -> 썸네일 이미지 -> 요약 텍스트 -> 하단 액션 버튼(2분할).
- **스타일**: 배경 `--color-bg-paper`, 테두리 1px `--color-border-default`, `border-radius: 8px`. 하단 액션 버튼 영역은 상단과 선으로 구분되지 않고 자연스럽게 배치됨.
- **빈 카드 (새 초안 작성)**: 테두리를 점선(Dashed)으로 처리하고, 내부 요소 중앙 정렬, 배경 투명.

### 4.4. List Items (최근 커밋 목록)
- **스타일**: 기본적으로 1px 테두리를 가진 둥근 사각형.
- **Active 상태**: 클릭되어 선택된 상태일 때는 테두리가 `--color-border-active` (2px 검은색)으로 굵고 진해짐.
- **Inactive 상태**: 테두리가 옅은 회색, 버튼은 "요약 생성" 상태.

### 4.5. Tags (브랜치 및 커밋 해시)
- **스타일**: 폰트 크기 `12px`, Monospace 폰트(옵션), 배경 연파랑(`--color-tag-bg`), 텍스트 진파랑(`--color-tag-text`), 높이 약 `24px`, 좌우 패딩 `8px`, `border-radius: 4px`.