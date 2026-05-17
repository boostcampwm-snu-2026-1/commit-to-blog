---
name: blog-from-commits
description: Generate a Korean developer blog post from selected GitHub commits. Fetches diffs, analyzes with Claude Haiku, produces structured draft (title/body/summary). Use when user selects commits and wants to create a blog post.
---

# Blog From Commits Skill

## Purpose
Encapsulates: select commits → fetch diffs → LLM analysis → Korean dev blog draft.

## Workflow Pattern

```
INPUT:  repoFullName, branch, commitShas[], additionalContext?
  ↓
FETCH:  GET /api/github/repos/:owner/:repo/commits/:sha (per commit)
        → collect: message, author, date, files[]{filename, patch}
  ↓
BUILD:  Construct Korean blog prompt (see template below)
  ↓
CALL:   Anthropic claude-haiku-4-5, max_tokens=2000
  ↓
PARSE:  Extract JSON {title, body, summary} via regex
  ↓
OUTPUT: BlogDraft → frontend BlogEditor
```

## LLM Prompt Template

```
당신은 개발자 기술 블로그 작성 전문가입니다.
아래 GitHub 커밋 정보를 분석하여 한국어 개발 블로그 포스트를 작성해주세요.

저장소: {repoFullName} | 브랜치: {branch}

=== 커밋 정보 ===
{for each commit:
  커밋: {sha[0:7]}
  메시지: {message}
  변경 파일: {filename} (+{additions}/-{deletions})
}

=== 작성 지침 ===
1. 제목: 변경 사항 명확히 표현 (50자 이내)
2. 본문 (마크다운):
   ## 개요 / ## 주요 변경 사항 / ## 구현 과정 / ## 결과
3. 요약: 1-2문장

JSON만 응답: {"title":"...","body":"...","summary":"..."}
```

## Quality Iteration Guide

| Problem | Solution |
|---------|----------|
| Poor quality output | Upgrade model: `claude-haiku-4-5` → `claude-sonnet-4-6` |
| Missing code examples | Include `patch` field (truncated to 500 chars/file) |
| Too generic | Add `additionalContext` field with user-provided hints |
| Beginner-unfriendly | Add "초보자도 이해할 수 있게" to instructions |

## Error Handling

| Error | Cause | Fix |
|-------|-------|-----|
| JSON parse failed | LLM non-JSON response | Retry with stricter prompt |
| Empty diff | Binary/large files | Filter: text files only |
| 429 Rate Limit | Too many requests | Exponential backoff |
| Response too long | Too many commits | Limit to 5 commits, truncate patches |

## File Locations
- Backend: `backend/src/services/llmService.js` → `generateBlogPost()`
- Route: `backend/src/routes/blog.js` → `POST /api/blog/generate`
- Frontend: `frontend/src/api/posts.ts` → `generateBlog()`
- UI: `frontend/src/pages/CreatePostPage.tsx` → Step 2 generate button

## Prompt Version History
- v1.0 (2026-05-17): Initial — basic Korean blog structure, 4-section format
