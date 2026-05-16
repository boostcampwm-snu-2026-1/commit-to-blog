# 포트폴리오 사이트 기획 명세서
 
## 문서 구조
 
이 프로젝트의 기획 명세는 페이지별로 파일이 분리되어 있습니다.
작업하는 페이지에 맞는 문서를 참고해주세요.
 
| 커맨드 | 참고 문서 | 설명 |
|--------|-----------|------|
| `@docs project` | `/.claude/project.md` | 프로젝트 페이지 작업 시 |
| `@docs blog` | `/.claude/blog.md` | 블로그 페이지 작업 시 |
 
> 공통 사항(Header, Footer, 반응형)은 이 파일(`CLAUDE.md`)에 포함되어 있습니다.
> 페이지별 작업 시에는 이 파일과 해당 페이지 문서를 함께 참고해주세요.

---

## Figma 참조

- **파일 키**: `7OjrgXkN43GXOCr6eT7iX9`
- **참조 방법**: 작업 전 `get_design_context` 또는 `get_screenshot`으로 해당 섹션 노드를 직접 확인하여 색상·간격·타이포그래피 수치를 적용합니다.
- Figma에 디자인 시스템(토큰, 스타일)이 별도로 정리되어 있지 않으므로, 각 노드를 직접 참조해서 수치를 읽어야 합니다.

| 영역 | 노드 ID |
|------|---------|
| 프로젝트 페이지 전체 | `1:2` |
| 블로그 페이지 전체 | `7:925` |
| Header (프로젝트 페이지 기준) | `1:7` |
| Footer (프로젝트 페이지 기준) | `7:754` |
 
---

## 디자인 토큰

`src/index.css`의 `@theme` 블록에 정의된 Tailwind CSS 커스텀 토큰입니다.
**하드코딩된 hex 값(`#cbcbcb` 등) 대신 아래 토큰 클래스를 사용하세요.**

### 색상

| 토큰 | Tailwind 클래스 예시 | 용도 |
|------|---------------------|------|
| `--color-surface` (`#fffefc`) | `bg-surface` | 헤더·카드 배경 (따뜻한 오프화이트) |
| `--color-border` (`#cbcbcb`) | `border-border` | 표준 경계선 |
| `--color-border-light` (`#d9d9d9`) | `border-border-light` / `bg-border-light` | 연한 구분선·아이콘 플레이스홀더 |
| `--color-muted` (`#656565`) | `text-muted` | 보조 텍스트, 날짜, 링크 |
| `--color-placeholder` (`#b79d9d`) | `bg-placeholder` | 이미지 플레이스홀더 |
| `--color-contribution-0` (`#eeece6`) | `bg-contribution-0` | 잔디: 활동 없음 |
| `--color-contribution-1` (`#eccfbf`) | `bg-contribution-1` | 잔디: 낮음 |
| `--color-contribution-2` (`#bf8b75`) | `bg-contribution-2` | 잔디: 보통 |
| `--color-contribution-3` (`#a16558`) | `bg-contribution-3` | 잔디: 높음 |
| `--color-contribution-4` (`#613e30`) | `bg-contribution-4` | 잔디: 매우 높음 |

### 폰트 패밀리

| 토큰 | Tailwind 클래스 | 사용 범위 |
|------|----------------|---------|
| `--font-pretendard` | `font-pretendard` | 모든 UI 텍스트 (기본) |
| `--font-inter` | `font-inter` | GitHub 잔디 축 레이블(`Mon`, `May` 등) 한정 |

폰트는 `index.html`에서 CDN으로 로드됩니다 (Pretendard: jsdelivr, Inter: Google Fonts).

### 폰트 사이즈 / 웨이트

Tailwind 기본값과 매핑:

| 크기 | Tailwind 클래스 |
|------|----------------|
| 12px | `text-xs` |
| **13px** | `text-2xs` *(커스텀, 커밋 링크 등)* |
| 14px | `text-sm` |
| 18px | `text-lg` |
| 24px | `text-2xl` |

| Pretendard 스타일 | Tailwind 클래스 |
|------------------|----------------|
| Light (300) | `font-light` |
| Regular (400) | `font-normal` |
| SemiBold (600) | `font-semibold` |
| Bold (700) | `font-bold` |

### 레이아웃

| 토큰 | Tailwind 클래스 | 값 |
|------|----------------|---|
| `--spacing-page-x` | `px-page-x` | 54px (콘텐츠 좌우 패딩) |
| `--spacing-header` | `h-header` | 80px (헤더 높이) |
| — | `max-w-[1280px]` | 페이지 최대 너비 |

---

## 프로젝트 개요
 
개인 포트폴리오 웹사이트. 프로젝트 소개, 블로그, 자기소개 페이지로 구성되며, 프로젝트 페이지에는 GitHub 통계를 실시간으로 시각화한다.
 
---
 
## 공통 사항
 
### 반응형 대응
 
- **기본 타깃**: 데스크톱 (가로 레이아웃 기준 설계)
- **모바일**: 가로(Landscape) 모드 고정. 세로 모드에서는 "가로 화면으로 전환해주세요" 안내 메시지 표시
- 데스크톱과 모바일의 디자인을 최대한 동일하게 유지
---
 
## Header
 
### 구조
 
```
[포트폴리오_김연우]     [프로젝트] [블로그] [자기소개]
```
 
- 좌측: 사이트 타이틀 (로고 역할)
- 중앙: 네비게이션 메뉴 3개 (프로젝트 / 블로그 / 자기소개)

- 페이지 라우팅은 react-router를 사용하여 수행합니다.

### 네비게이션 아이콘 (동영상)
 
각 메뉴에는 개별 동영상 파일을 아이콘으로 사용한다. 메뉴별로 서로 다른 영상을 사용한다.
 
- 프로젝트: `/public/webm/project-twirl.webm`
- 블로그: `/public/webm/post-twirl.webm`
- 자기소개: `/public/webm/about-twirl.webm`
#### 동영상 재생 상태 정의
 
| 상황 | 동작 |
|------|------|
| 초기 렌더링 | 모든 메뉴 아이콘 동영상 처음부터 1회 재생 |
| hover | 해당 메뉴 아이콘 동영상 처음부터 재실행 |
| 클릭 (페이지 이동) | 이동한 메뉴의 아이콘 동영상만 재실행 |
| 그 외 (idle) | 동영상의 마지막 프레임을 정지 이미지로 표시 |
 
- 동영상은 loop 없이 1회 재생 후 마지막 프레임에서 정지
- idle 상태 = 초기 렌더링 재생 완료 후 / hover·클릭 재생 완료 후
### 활성 메뉴 표시
 
- 현재 활성화된 메뉴: 하단에 **underline** + **font-weight semibold**
- 비활성 메뉴: 기본 weight, underline 없음
---
 
## Footer
 
### 구조
 
```
김연우  Yeonu Kim
 
Github    Email    Velog
```
 
### 외부 링크
 
| 항목 | URL |
|------|-----|
| Github | `https://github.com/Yeonu-Kim` |
| Email | `mailto:ywk0524@snu.ac.kr` |
| Velog | `https://velog.io/@Yeonu-Kim` |
 
- 모두 `target="_blank"` 로 외부 링크 이동
---

