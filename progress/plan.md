# 현재 Plan

> /planner 가 작성하고, /executor 가 읽는다.

## 상태
진행 중

---

## Task
개발 환경 셋팅

## 문제 정의
Docker Compose 기반으로 frontend, backend, db 서비스를
로컬에서 한 번에 실행할 수 있는 기본 개발 환경을 구성한다.
실제 기능 구현은 이 단계에서 하지 않는다.

## 접근 방법
frontend는 Vite 스캐폴딩 후 구조 정리.
backend, db는 수동 생성.

## 실행 단계
- [ ] 1. docker-compose.yml 작성
- [ ] 2. frontend/ 생성 (Vite 스캐폴딩 + 구조 정리 + Dockerfile)
- [ ] 3. backend/ 생성 (FastAPI 기본 구조 + requirements.txt + Dockerfile)
- [ ] 4. db/init.sql 작성 (data-model.md 기반 테이블 생성)
- [ ] 5. docker-compose up 실행 확인

## 예상 변경 파일
- docker-compose.yml (신규)
- frontend/Dockerfile (신규)
- frontend/vite.config.ts (신규)
- frontend/src/ 구조 (신규)
- backend/Dockerfile (신규)
- backend/requirements.txt (신규)
- backend/app/main.py (신규)
- db/init.sql (신규)

## 리스크
- Docker 미설치 시 5단계 확인 불가
