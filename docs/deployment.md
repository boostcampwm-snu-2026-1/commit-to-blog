# 배포

## 환경 변수 (`.env.local`)

```
MONGODB_URI=mongodb+srv://<user>:<pw>@cluster0.xxxxx.mongodb.net/commit-to-blog
GEMINI_API_KEY=AIza...
```

`.env.local`은 절대 커밋하지 않는다. PAT는 환경 변수로 관리하지 않고, 사용자가 런타임에 입력한다.

## Vercel 배포

1. vercel.com에서 GitHub 저장소 연결
2. 환경 변수 `MONGODB_URI`, `GEMINI_API_KEY` 입력
3. Deploy — 이후 `main` push 시 자동 재배포

## MongoDB Atlas 설정

- Network Access에서 `0.0.0.0/0` 허용 (Vercel IP가 유동적이므로)
- 배포 시 환경 변수 `MONGODB_URI`를 Vercel 프로젝트 설정에 추가
