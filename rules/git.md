# Git Rules

> 커밋/브랜치/PR 작업 시 로드한다.

## 브랜치 전략

```
main          배포 브랜치
dev           개발 통합 브랜치
feat/[name]   기능 개발
fix/[name]    버그 수정
refactor/[name]  리팩터링
```

## 커밋 메시지

```
feat: 새 기능
fix: 버그 수정
refactor: 리팩터링
docs: 문서
style: 포맷팅
test: 테스트
chore: 설정, 빌드
```

예시: `feat: 로그인 페이지 UI 구현`

## PR 규칙

- 하나의 PR은 하나의 목적
- 제목: 커밋 메시지 형식 동일
- 본문: 변경 이유 + 주요 변경 사항
