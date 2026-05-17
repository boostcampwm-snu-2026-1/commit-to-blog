# Naming Rules

> 새 파일/함수/변수 생성 시 로드한다.

## 파일명

| 종류 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 | PascalCase | `UserCard.tsx` |
| 유틸 함수 | camelCase | `formatDate.ts` |
| 페이지 | kebab-case | `user-profile.tsx` |
| 스타일 | kebab-case | `user-card.css` |
| 상수 | UPPER_SNAKE | `API_BASE_URL` |

## 변수/함수

- 함수: 동사로 시작 (`getUser`, `handleClick`, `formatDate`)
- 불린: `is`, `has`, `can` 으로 시작 (`isLoading`, `hasError`)
- 이벤트 핸들러: `handle` 로 시작 (`handleSubmit`)
- 컴포넌트 props: 명사 or 형용사

## 디렉터리

```
components/   공통 컴포넌트
pages/        라우트 페이지
hooks/        커스텀 훅
utils/        유틸 함수
services/     API 호출
types/        타입 정의
```
