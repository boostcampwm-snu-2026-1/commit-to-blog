# commit-to-blog

Smart Blog - AI Tutor 모노레포입니다.

## 1) 사전 준비
- Node.js 20+
- npm 10+
- MongoDB Atlas(M0 가능)

## 2) 환경변수 설정
루트 `.env.example`를 복사해 `.env` 생성 후 값 입력:

```bash
cp .env.example .env
```

필수 값:
- `MONGODB_URI`
- `GITHUB_TOKEN`
- `GEMINI_API_KEY`

## 3) 설치
```bash
npm install
```

## 4) 실행
클라이언트(Vite):
```bash
npm run dev --workspace @commit-to-blog/client
```

서버(Express):
```bash
npm run dev --workspace @commit-to-blog/server
```

## 5) 현재 상태
- 클라이언트: 커밋 선택 + 인터뷰 룸 기본 UI 목업 연결
- 서버: health/repo/commit/diff/interview/posts 라우트 스텁
- DB: MongoDB 연결 및 Mongoose 모델 스켈레톤
