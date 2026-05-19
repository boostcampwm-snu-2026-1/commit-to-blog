# GitHub API 설명 정리

GitHub API는 내 서비스가 GitHub에 있는 사용자 정보, 저장소, 브랜치, 커밋, 코드 변경사항 등을 가져올 수 있게 해주는 HTTP API이다.

이 서비스에서는 GitHub API를 다음 흐름으로 사용한다.

```txt
GitHub 로그인
→ 사용자 정보 조회
→ Repository 목록 조회
→ 특정 Repository 선택
→ Branch 목록 조회
→ Commit 목록 조회
→ Commit 상세 변경사항 조회
→ AI 블로그 생성에 사용
```

---

## 1. GitHub API란?

GitHub API는 GitHub 웹사이트에서 볼 수 있는 데이터를 코드로 가져오거나 조작할 수 있게 해주는 인터페이스이다.

예를 들어 GitHub 웹사이트에서 직접 확인할 수 있는 다음 정보들을 API로 가져올 수 있다.

```txt
내 프로필
내 저장소 목록
브랜치 목록
커밋 기록
변경된 파일 목록
Pull Request
Issue
```

GitHub에는 대표적으로 두 종류의 API가 있다.

```txt
1. REST API
2. GraphQL API
```

### 1. REST API

REST API는 GitHub에서 정해둔 URL 엔드포인트에 요청을 보내는 방식이다.

예시 endpoint
```txt
GET https://api.github.com/user/repos
```
endpoint 자체가 요청하는 데이터를 나타낸다. 

REST API 예시
```txt
1. GET /user
   → 사용자 정보 조회

2. GET /user/repos
   → 저장소 목록 조회

3. GET /repos/{owner}/{repo}/branches
   → 브랜치 목록 조회

4. GET /repos/{owner}/{repo}/commits?sha={branch}
   → 특정 브랜치의 커밋 목록 조회

5. GET /repos/{owner}/{repo}/commits/{sha}
   → 특정 커밋의 변경 파일과 diff 조회
```

### 2. GraphQL API
 
REST처럼 여러 URL에 요청하는 방식이 아니라, ***하나의 GraphQL 엔드포인트에 쿼리문을 보내는 방식***이다. 

예시 endpoint
```txt
POST https://api.github.com/graphql
```
이후 요청 body에 "내가 원하는 데이터 구조"를 적는다. 
-> 이 구조가 곧 query문

즉, REST API와 달리 endpoint는 하나로 고정되어 있고 대신 body가 요청하는 데이터를 나타낸다. 

예시 body 
```txt
현재 로그인한 사용자의 로그인명과 저장소 목록을 가져오는 body

query {
  viewer {
    login
    repositories(first: 10) {
      nodes {
        name
        isPrivate
        defaultBranchRef {
          name
        }
      }
    }
  }
}
```
의미
```txt
현재 로그인한 사용자 viewer의
login을 가져오고,
repository 10개를 가져오되,
각 repository의 name, isPrivate, defaultBranchRef.name만 가져와라.
```
### REST API vs GraphQL API
REST API 장점 
- 단순하고 직관적이다. 따라서 이해하기 쉽고 디버깅하기 쉽다. 
- 문서와 예시가 매우 많고, curl이나 fetch로 바로 테스트하기 좋다.

REST API 단점
- 필요한 데이터가 여러 리소스에 흩어져 있으면 요청이 많아질 수 있다. 
- 응답에 필요 없는 필드가 같이 오는 경우가 많다. 

GraphQL API 장점
- 필요한 데이터만 골라서 요청할 수 있다.
- 여러 관계 데이터를 한 번에 가져올 수 있다. 

GraphQL API 단점
- 처음에 배우기 어렵다. 
- 쿼리 복잡도와 rate limit 계산 방식이 REST와 다르다.


| 항목              | REST API         | GraphQL API      |
| --------------- | ---------------- | ---------------- |
| 요청 방식           | 여러 URL 엔드포인트에 요청 | 하나의 엔드포인트에 쿼리 전송 |
| 데이터 선택          | 서버가 정한 응답 형태를 받음 | 클라이언트가 필요한 필드 선택 |
| 학습 난이도          | 낮음               | 상대적으로 높음         |
| 디버깅             | 쉬움               | 쿼리 구조 이해 필요      |
| 단순 CRUD         | 적합               | 과할 수 있음          |
| 관계형 데이터 한 번에 조회 | 요청이 많아질 수 있음     | 강함               |
| 응답 크기 최적화       | 불필요한 필드 포함 가능    | 필요한 필드만 받을 수 있음  |
| 네 프로젝트 MVP      | 추천               | 나중에 고려           |



이 프로젝트에서는 우선 **REST API**를 사용하는 것이 적합하다. 저장소, 브랜치, 커밋, 사용자 정보 조회가 REST API만으로 충분히 가능하기 때문이다.

---

## 2. 기본 요청 구조

GitHub REST API의 기본 주소는 다음과 같다.

```txt
https://api.github.com
```

사용자의 저장소 목록을 가져오는 요청 예시는 다음과 같다.

```http
GET https://api.github.com/user/repos
```

특정 저장소의 브랜치 목록은 다음과 같이 가져온다.

```http
GET https://api.github.com/repos/{owner}/{repo}/branches
```

특정 저장소의 커밋 목록은 다음과 같이 가져온다.

```http
GET https://api.github.com/repos/{owner}/{repo}/commits
```

---

## 3. 인증이 필요한 이유

공개 저장소만 읽는 경우에는 인증 없이 일부 API를 사용할 수 있다. 하지만 이 서비스는 사용자의 GitHub 활동을 분석해야 하므로 대부분 인증이 필요하다.

특히 다음 기능은 인증이 필요하다고 보는 것이 좋다.

```txt
사용자의 repository 목록 가져오기
private repository 접근하기
사용자 프로필 정보 가져오기
API 요청 제한을 넉넉하게 사용하기
```

따라서 사용자는 먼저 **GitHub OAuth 로그인**을 해야 한다.

---

## 4. GitHub OAuth 흐름

OAuth는 사용자가 GitHub 계정으로 로그인하고, 우리 서비스가 GitHub 데이터에 접근할 권한을 받는 방식이다.

흐름은 다음과 같다.

```txt
1. 사용자가 "GitHub로 로그인" 버튼 클릭
2. 프론트엔드가 백엔드의 /api/auth/github 로 이동
3. 백엔드가 GitHub OAuth 페이지로 redirect
4. 사용자가 GitHub에서 권한 승인
5. GitHub가 우리 백엔드 callback URL로 code 전달
6. 백엔드가 code를 access token으로 교환
7. 백엔드가 access token으로 GitHub API 호출
8. 사용자 정보를 DB에 저장
9. 세션 또는 쿠키로 로그인 유지
```

프론트엔드가 GitHub API를 직접 호출할 수도 있지만 추천하지 않는다. 이유는 access token이 브라우저에 노출될 수 있기 때문이다.

추천 구조는 다음과 같다.

```txt
React
  ↓
Express Backend
  ↓
GitHub API
```

---

## 5. 사용자 정보 조회 API

로그인 후 현재 사용자의 정보를 가져올 때는 다음 API를 사용한다.

```http
GET https://api.github.com/user
```

응답 예시는 다음과 같다.

```json
{
  "login": "gim222932",
  "id": 12345678,
  "avatar_url": "https://avatars.githubusercontent.com/u/12345678?v=4",
  "html_url": "https://github.com/gim222932"
}
```

중요한 값은 다음과 같다.

| GitHub 응답 필드 | 우리 서비스 필드 | 의미 |
|---|---|---|
| `id` | `githubId` | GitHub 사용자 고유 ID |
| `login` | `username` | GitHub 닉네임 |
| `avatar_url` | `avatarUrl` | GitHub 프로필 이미지 URL |
| `html_url` | `githubProfileUrl` | GitHub 프로필 페이지 |

예상 타입은 다음과 같다.

```ts
type User = {
  id: string;
  githubId: string;
  username: string;
  avatarUrl?: string;
  githubProfileUrl?: string;
  accessTokenEncrypted: string;
  createdAt: Date;
  updatedAt: Date;
};
```

---

## 6. Repository 목록 조회

사용자의 저장소 목록을 가져오려면 보통 다음 API를 사용한다.

```http
GET https://api.github.com/user/repos
```

Express 백엔드에서는 다음과 같이 호출할 수 있다.

```ts
const response = await fetch("https://api.github.com/user/repos", {
  headers: {
    Authorization: `Bearer ${accessToken}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  },
});
```

응답 예시는 다음과 같다.

```json
[
  {
    "id": 987654,
    "name": "my-project",
    "full_name": "gim222932/my-project",
    "private": false,
    "default_branch": "main",
    "html_url": "https://github.com/gim222932/my-project",
    "owner": {
      "login": "gim222932"
    }
  }
]
```

서비스 내부 타입은 다음처럼 정의할 수 있다.

```ts
type GitHubRepository = {
  id: number;
  name: string;
  fullName: string;
  owner: string;
  private: boolean;
  defaultBranch: string;
  htmlUrl: string;
};
```

저장소 선택 화면에서는 이 정보만 있어도 충분하다.

---

## 7. Branch 목록 조회

사용자가 특정 저장소를 선택하면, 그 저장소의 브랜치 목록을 가져와야 한다.

```http
GET https://api.github.com/repos/{owner}/{repo}/branches
```

예시는 다음과 같다.

```http
GET https://api.github.com/repos/gim222932/my-project/branches
```

응답 예시는 다음과 같다.

```json
[
  {
    "name": "main",
    "commit": {
      "sha": "abc123",
      "url": "https://api.github.com/repos/gim222932/my-project/commits/abc123"
    },
    "protected": false
  },
  {
    "name": "feature/login",
    "commit": {
      "sha": "def456",
      "url": "https://api.github.com/repos/gim222932/my-project/commits/def456"
    },
    "protected": false
  }
]
```

서비스 내부 타입은 다음처럼 정의할 수 있다.

```ts
type GitHubBranch = {
  name: string;
  commitSha: string;
  protected: boolean;
};
```

---

## 8. Commit 목록 조회

특정 브랜치의 커밋 목록을 가져오려면 다음 API를 사용한다.

```http
GET https://api.github.com/repos/{owner}/{repo}/commits?sha={branchName}
```

예시는 다음과 같다.

```http
GET https://api.github.com/repos/gim222932/my-project/commits?sha=feature/login
```

응답 예시는 다음과 같다.

```json
[
  {
    "sha": "abc123",
    "commit": {
      "message": "feat: add GitHub login",
      "author": {
        "name": "Haram Kim",
        "date": "2026-05-18T04:00:00Z"
      }
    },
    "html_url": "https://github.com/gim222932/my-project/commit/abc123"
  }
]
```

서비스 내부 타입은 다음처럼 정의할 수 있다.

```ts
type GitHubCommit = {
  sha: string;
  message: string;
  authorName: string;
  authorDate: string;
  htmlUrl: string;
};
```

커밋 목록 화면에서는 다음과 같은 형태로 보여줄 수 있다.

```txt
[ ] feat: add GitHub login
    Haram Kim · 2026-05-18

[ ] fix: handle OAuth callback error
    Haram Kim · 2026-05-18
```

---

## 9. Commit SHA란?

`commitShas`에서 `Shas`는 **SHA 값들의 목록**이라는 뜻이다.

Git에서 각 커밋을 식별하는 고유한 해시값을 SHA라고 부른다.

```ts
commitShas: string[];
```

즉, 다음 의미이다.

```txt
선택된 커밋들의 고유 ID 목록
```

예시는 다음과 같다.

```ts
const commitShas = [
  "a1b2c3d4e5f6...",
  "9f8e7d6c5b4a...",
  "123abc456def..."
];
```

GitHub 커밋 URL에서도 이 값을 볼 수 있다.

```txt
https://github.com/owner/repo/commit/a1b2c3d4e5f6...
```

여기서 마지막 `a1b2c3d4e5f6...` 부분이 커밋 SHA이다.

---

## 10. Commit 상세 조회

블로그 초안을 만들려면 단순 커밋 메시지만으로는 부족하다. 실제로 어떤 파일이 바뀌었는지 봐야 한다.

이때 사용하는 API가 commit 상세 조회이다.

```http
GET https://api.github.com/repos/{owner}/{repo}/commits/{ref}
```

예시는 다음과 같다.

```http
GET https://api.github.com/repos/gim222932/my-project/commits/abc123
```

응답에는 다음 정보가 포함된다.

```json
{
  "sha": "abc123",
  "commit": {
    "message": "feat: add GitHub login"
  },
  "files": [
    {
      "filename": "src/features/auth/GitHubLoginButton.tsx",
      "status": "added",
      "additions": 50,
      "deletions": 0,
      "changes": 50,
      "patch": "@@ -0,0 +1,50 @@ ..."
    }
  ]
}
```

AI 블로그 생성에 중요한 값은 `files`이다.

```ts
type ChangedFile = {
  filename: string;
  status: "added" | "modified" | "removed" | "renamed";
  additions: number;
  deletions: number;
  changes: number;
  patch?: string;
};
```

특히 `patch`는 실제 코드 diff 일부를 담고 있다. LLM에게 이 정보를 넘기면 어떤 기능을 구현했는지 더 정확히 요약할 수 있다.

---

## 11. 이 서비스에서 GitHub API 사용 흐름

이 서비스에서는 다음 순서로 GitHub API를 사용한다.

```txt
1. GET /user
   → 로그인한 사용자 정보 확인

2. GET /user/repos
   → 사용자의 repository 목록 조회

3. GET /repos/{owner}/{repo}/branches
   → 선택한 repository의 branch 목록 조회

4. GET /repos/{owner}/{repo}/commits?sha={branch}
   → 선택한 branch의 commit 목록 조회

5. GET /repos/{owner}/{repo}/commits/{sha}
   → 선택한 commit의 상세 변경사항 조회

6. 선택한 commit detail들을 LLM 입력으로 변환
   → 블로그 초안 생성
```

프론트엔드는 직접 GitHub API를 호출하지 않고, 우리 백엔드 API만 호출하는 것이 좋다.

```txt
React
  GET /api/github/repositories
  GET /api/github/repositories/:owner/:repo/branches
  GET /api/github/repositories/:owner/:repo/commits?branch=main
  POST /api/post-generator/generate

Express
  GitHub API 호출
  OpenAI API 호출
  DB 저장
```

---

## 12. 왜 백엔드에서 GitHub API를 호출해야 하나?

### 1. Access token 보호

GitHub access token은 비밀번호처럼 민감한 값이다. 프론트엔드에 저장하면 브라우저에서 노출될 수 있다.

좋은 구조는 다음과 같다.

```txt
GitHub access token → 백엔드 DB에 암호화 저장
브라우저 → httpOnly cookie만 보유
```

### 2. API 호출 로직 집중

GitHub API 요청 헤더, pagination, 에러 처리, rate limit 대응을 백엔드에서 한 번에 관리할 수 있다.

### 3. AI 생성 전 데이터 정리

GitHub commit diff는 너무 길 수 있다. LLM에 그대로 넣으면 비용도 커지고 입력 제한에도 걸릴 수 있다.

따라서 백엔드에서 먼저 정리해야 한다.

```txt
긴 patch 자르기
package-lock.json 제외
node_modules 제외
이미지, 바이너리 파일 제외
중요한 파일만 요약
```

---

## 13. GitHub API 요청 헤더

GitHub REST API를 호출할 때는 보통 아래 헤더를 넣는다.

```ts
const headers = {
  Authorization: `Bearer ${accessToken}`,
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
};
```

각각의 의미는 다음과 같다.

| 헤더 | 의미 |
|---|---|
| `Authorization` | GitHub access token 전달 |
| `Accept` | GitHub JSON 응답 형식 지정 |
| `X-GitHub-Api-Version` | 사용할 GitHub API 버전 지정 |

---

## 14. Pagination 처리

GitHub API는 목록 데이터를 한 번에 전부 주지 않고 페이지 단위로 나눠서 줄 수 있다.

예를 들어 repository나 commit이 많으면 다음처럼 요청한다.

```http
GET /user/repos?per_page=30&page=1
GET /user/repos?per_page=30&page=2
```

커밋 목록도 마찬가지이다.

```http
GET /repos/{owner}/{repo}/commits?sha=main&per_page=30&page=1
```

MVP에서는 우선 최근 30개만 보여줘도 충분하다.

```txt
MVP 추천:
- repository: 최대 50개
- branch: 전체 또는 최대 100개
- commit: 최근 30개
```

나중에 “더 보기” 버튼을 붙이면 된다.

---

## 15. Rate Limit

GitHub API는 무제한으로 호출할 수 없다. 요청 수 제한이 있다.

따라서 다음 전략이 필요하다.

```txt
1. 같은 repository 목록은 잠깐 캐싱
2. branch 목록도 캐싱
3. commit detail은 사용자가 선택한 것만 조회
4. commit 목록을 불러올 때 모든 detail을 미리 가져오지 않기
```

잘못된 방식은 다음과 같다.

```txt
commit 목록 30개를 보여주기 위해 30개 commit detail을 전부 미리 조회
```

좋은 방식은 다음과 같다.

```txt
commit 목록은 간단한 정보만 조회
사용자가 선택한 commit만 detail 조회
생성 버튼을 눌렀을 때 필요한 detail만 조회
```

---

## 16. 권한 Scope

이 서비스에 필요한 GitHub OAuth scope는 목표 범위에 따라 달라진다.

공개 저장소만 분석한다면 적은 권한으로 가능하지만, private repository까지 분석하려면 더 강한 권한이 필요하다.

MVP에서는 보통 다음 중 하나를 선택한다.

```txt
공개 저장소만:
read:user

private 저장소 포함:
repo
```

다만 `repo` scope는 권한이 넓다. 사용자가 부담스러워할 수 있으므로 실제 서비스에서는 GitHub App 방식이나 fine-grained token 방식을 고려하는 것이 좋다.

MVP나 수업 프로젝트 수준에서는 OAuth App + `repo` scope로 시작하는 경우가 많다.

---

## 17. 코드 예시: Express에서 Repository 목록 가져오기

```ts
export async function getUserRepositories(accessToken: string) {
  const response = await fetch("https://api.github.com/user/repos?per_page=50", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch GitHub repositories");
  }

  const repos = await response.json();

  return repos.map((repo: any) => ({
    id: repo.id,
    name: repo.name,
    fullName: repo.full_name,
    owner: repo.owner.login,
    private: repo.private,
    defaultBranch: repo.default_branch,
    htmlUrl: repo.html_url,
  }));
}
```

---

## 18. 코드 예시: Branch 목록 가져오기

```ts
export async function getBranches(
  accessToken: string,
  owner: string,
  repo: string
) {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/branches?per_page=100`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch branches");
  }

  const branches = await response.json();

  return branches.map((branch: any) => ({
    name: branch.name,
    commitSha: branch.commit.sha,
    protected: branch.protected,
  }));
}
```

---

## 19. 코드 예시: Commit 목록 가져오기

```ts
export async function getCommits(
  accessToken: string,
  owner: string,
  repo: string,
  branch: string
) {
  const url = new URL(
    `https://api.github.com/repos/${owner}/${repo}/commits`
  );

  url.searchParams.set("sha", branch);
  url.searchParams.set("per_page", "30");

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch commits");
  }

  const commits = await response.json();

  return commits.map((item: any) => ({
    sha: item.sha,
    message: item.commit.message,
    authorName: item.commit.author?.name,
    authorDate: item.commit.author?.date,
    htmlUrl: item.html_url,
  }));
}
```

---

## 20. 코드 예시: Commit 상세 변경사항 가져오기

```ts
export async function getCommitDetail(
  accessToken: string,
  owner: string,
  repo: string,
  sha: string
) {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/commits/${sha}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch commit detail");
  }

  const data = await response.json();

  return {
    sha: data.sha,
    message: data.commit.message,
    authorName: data.commit.author?.name,
    authorDate: data.commit.author?.date,
    htmlUrl: data.html_url,
    files: data.files?.map((file: any) => ({
      filename: file.filename,
      status: file.status,
      additions: file.additions,
      deletions: file.deletions,
      changes: file.changes,
      patch: file.patch,
    })),
  };
}
```

---

## 21. 이 프로젝트에서 주의할 점

### 1. Diff를 그대로 전부 AI에 넣으면 안 된다

예를 들어 `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml` 같은 파일은 길기만 하고 블로그 내용에는 별로 중요하지 않다.

제외 추천 파일은 다음과 같다.

```txt
package-lock.json
yarn.lock
pnpm-lock.yaml
dist/
build/
node_modules/
이미지 파일
폰트 파일
```

### 2. Commit message만 믿으면 안 된다

커밋 메시지가 항상 정확하지는 않다.

```txt
fix bug
update
wip
test
```

이런 커밋 메시지만으로는 블로그를 만들기 어렵기 때문에, 반드시 `changed files`와 `patch`를 함께 분석해야 한다.

### 3. Private repository 권한 문제

사용자가 private repository를 선택했는데 권한이 없으면 404 또는 403이 날 수 있다.

이때는 사용자에게 다음처럼 보여주면 된다.

```txt
이 저장소에 접근할 수 없습니다.
GitHub 권한을 다시 확인해주세요.
```

### 4. Branch 이름 인코딩

브랜치 이름에 `/`가 들어갈 수 있다.

```txt
feature/login
fix/oauth-callback
```

URL path에 직접 넣으면 문제가 생길 수 있으니, query parameter로 보내거나 `encodeURIComponent`를 사용해야 한다.

좋은 방식은 다음과 같다.

```http
GET /api/github/repositories/:owner/:repo/commits?branch=feature/login
```

---

## 22. 정리

이 서비스에서 GitHub API는 다음 역할을 한다.

```txt
GitHub 로그인으로 사용자 인증
사용자의 저장소 목록 가져오기
저장소의 브랜치 목록 가져오기
브랜치의 커밋 목록 가져오기
선택한 커밋의 변경 파일과 diff 가져오기
가져온 데이터를 AI 블로그 생성 입력으로 사용
```

가장 중요한 API는 다음 다섯 개이다.

```txt
GET /user
GET /user/repos
GET /repos/{owner}/{repo}/branches
GET /repos/{owner}/{repo}/commits?sha={branch}
GET /repos/{owner}/{repo}/commits/{sha}
```

이 API들을 제대로 연결하면 서비스의 핵심인 **GitHub 활동 기반 개발 블로그 자동 생성 기능**을 구현할 수 있다.
