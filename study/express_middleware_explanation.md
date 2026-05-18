# Express Middleware 설명 정리

Express에서 **미들웨어 middleware**는 요청이 들어왔을 때, 최종 API 로직으로 가기 전에 중간에서 실행되는 함수이다.

흐름으로 보면 다음과 같다.

```txt
Client 요청
  ↓
Middleware 1
  ↓
Middleware 2
  ↓
Controller
  ↓
Service
  ↓
Response
```

예를 들어 사용자가 저장된 글 목록을 요청한다고 해보자.

```http
GET /api/posts
```

이 요청은 바로 `posts.controller.ts`로 가는 것이 아니라, 중간에 여러 미들웨어를 거칠 수 있다.

```txt
요청 도착
  ↓
로그인 여부 확인 middleware
  ↓
요청 데이터 검증 middleware
  ↓
posts.controller.ts
  ↓
posts.service.ts
  ↓
DB 조회
  ↓
응답 반환
```

---

## 1. 미들웨어가 필요한 이유

미들웨어는 여러 API에서 반복되는 공통 작업을 한 곳에 모아두기 위해 사용한다.

예를 들어 이 서비스에서는 다음 작업들이 필요하다.

```txt
로그인한 사용자인지 확인
요청 body가 올바른지 검증
에러를 공통 형식으로 처리
요청 로그 남기기
CORS 설정
JSON body 파싱
```

이 작업들을 모든 controller마다 직접 작성하면 코드가 지저분해진다.

나쁜 예시는 다음과 같다.

```ts
export async function getPosts(req, res) {
  const user = await checkLogin(req);

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // 실제 글 목록 조회 로직
}
```

좋은 예시는 다음과 같다.

```ts
router.get("/posts", authMiddleware, getPosts);
```

이렇게 하면 `getPosts`는 진짜 역할인 “글 목록 조회”에만 집중할 수 있다.

---

## 2. Express 미들웨어 기본 형태

Express 미들웨어는 보통 다음 형태이다.

```ts
function middleware(req, res, next) {
  // 중간 처리
  next();
}
```

여기서 중요한 것은 `next()`이다.

`next()`는 “다음 미들웨어 또는 다음 controller로 넘어가라”는 뜻이다.

```ts
const logMiddleware = (req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
};
```

만약 `next()`를 호출하지 않으면 요청 흐름이 멈춘다.

---

## 3. 예시 1: 로그인 확인 미들웨어

이 프로젝트에서 가장 중요한 미들웨어는 `auth.middleware.ts`이다.

```ts
// middlewares/auth.middleware.ts

export async function authMiddleware(req, res, next) {
  const sessionId = req.cookies.sessionId;

  if (!sessionId) {
    return res.status(401).json({
      message: "로그인이 필요합니다.",
    });
  }

  const user = await findUserBySessionId(sessionId);

  if (!user) {
    return res.status(401).json({
      message: "유효하지 않은 세션입니다.",
    });
  }

  req.user = user;
  next();
}
```

이 미들웨어를 라우터에 붙이면 다음과 같다.

```ts
router.get("/posts", authMiddleware, postsController.getPosts);
```

요청 흐름은 다음과 같다.

```txt
GET /api/posts 요청
  ↓
authMiddleware 실행
  ↓
로그인 확인 성공
  ↓
req.user에 사용자 정보 저장
  ↓
postsController.getPosts 실행
```

그럼 controller에서는 다음처럼 사용할 수 있다.

```ts
export async function getPosts(req, res) {
  const userId = req.user.id;

  const posts = await postsService.getPostsByUserId(userId);

  res.json(posts);
}
```

즉, controller는 매번 로그인 검사를 직접 하지 않아도 된다.

---

## 4. 예시 2: 요청 데이터 검증 미들웨어

블로그 글을 저장할 때는 요청 body가 올바른지 확인해야 한다.

```http
POST /api/posts
```

요청 body 예시는 다음과 같다.

```json
{
  "title": "GitHub OAuth 구현기",
  "summary": "GitHub 로그인 기능을 구현한 과정",
  "bodyMarkdown": "...",
  "tags": ["GitHub", "OAuth"],
  "visibility": "private"
}
```

이때 `title`이 비어 있거나, `visibility`가 이상한 값이면 저장하면 안 된다.

그래서 `validate.middleware.ts`를 만들 수 있다.

```ts
// middlewares/validate.middleware.ts

export function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "요청 데이터가 올바르지 않습니다.",
        errors: result.error.flatten(),
      });
    }

    req.body = result.data;
    next();
  };
}
```

라우터에서는 다음처럼 사용한다.

```ts
router.post(
  "/posts",
  authMiddleware,
  validateBody(createPostSchema),
  postsController.createPost
);
```

흐름은 다음과 같다.

```txt
POST /api/posts 요청
  ↓
authMiddleware
  ↓
validateBody
  ↓
postsController.createPost
```

---

## 5. 예시 3: 에러 처리 미들웨어

서비스 로직에서 에러가 발생할 수 있다.

```ts
throw new Error("GitHub API 호출 실패");
```

이런 에러를 API마다 `try-catch`로 처리하면 반복이 많아진다.

그래서 공통 에러 미들웨어를 둔다.

```ts
// middlewares/error.middleware.ts

export function errorMiddleware(err, req, res, next) {
  console.error(err);

  res.status(err.statusCode || 500).json({
    message: err.message || "서버 오류가 발생했습니다.",
  });
}
```

`app.ts`에서는 맨 마지막에 등록한다.

```ts
app.use(errorMiddleware);
```

중요한 점은 **에러 처리 미들웨어는 보통 라우터 등록 이후, 가장 마지막에 둔다**는 것이다. 왜냐하면 에러 미들웨어를 앞에 둘 경우, 뒤에서 발생한 에러를 앞에 있는 미들웨어가 받을 수 없기 때문이다. 

```ts
app.use("/api/auth", authRoutes);
app.use("/api/github", githubRoutes);
app.use("/api/posts", postsRoutes);

app.use(errorMiddleware);
```

---

## 6. 프로젝트의 middleware 폴더 역할

제안한 Express 디렉토리 구조에서는 다음 폴더가 있었다.

```txt
middlewares/
  auth.middleware.ts
  error.middleware.ts
  validate.middleware.ts
```

각 파일의 역할은 다음과 같다.

| 파일 | 역할 |
|---|---|
| `auth.middleware.ts` | 로그인 여부 확인, `req.user` 설정 |
| `validate.middleware.ts` | 요청 body, params, query 검증 |
| `error.middleware.ts` | 서버 에러를 공통 응답 형식으로 변환 |

---

## 7. 이 프로젝트에서 실제로 필요한 미들웨어

### 7.1 `auth.middleware.ts`

보호해야 하는 API에 붙인다.

```txt
GET /api/github/repositories
GET /api/github/repositories/:owner/:repo/branches
GET /api/posts
POST /api/posts
PATCH /api/posts/:postId
PATCH /api/posts/:postId/publish
```

이런 API는 로그인한 사용자만 접근해야 하므로 인증 미들웨어가 필요하다.

---

### 7.2 `validate.middleware.ts`

요청 데이터가 있는 API에 붙인다.

```txt
POST /api/post-generator/generate
POST /api/posts
PATCH /api/posts/:postId
PATCH /api/posts/:postId/publish
```

예를 들어 AI 블로그 생성 요청에서 `commitShas`가 빈 배열이면 막아야 한다.

```ts
const generatePostSchema = z.object({
  owner: z.string(),
  repo: z.string(),
  branchName: z.string(),
  commitShas: z.array(z.string()).min(1),
});
```

---

### 7.3 `error.middleware.ts`

모든 API에서 발생하는 에러를 마지막에 처리한다.

```ts
app.use(errorMiddleware);
```

---

## 8. 간단한 요약

미들웨어는 Express에서 **요청과 응답 사이에 끼어드는 공통 처리 함수**이다.

```txt
요청이 들어오면
→ 로그인 검사하고
→ 데이터 검증하고
→ 실제 controller 실행하고
→ 에러가 나면 공통 처리한다
```

이 서비스에서는 특히 다음 세 개가 중요하다.

```txt
auth.middleware.ts
로그인한 사용자만 API를 사용할 수 있게 함

validate.middleware.ts
잘못된 요청 데이터가 controller까지 가지 않게 막음

error.middleware.ts
서버 에러 응답 형식을 통일함
```
