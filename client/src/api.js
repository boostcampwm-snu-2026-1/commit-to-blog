import { notify as notifyGlobal } from './errorBus.js'

const BASE = '/api'

const GLOBAL_CODES = new Set([
  'INVALID_TOKEN',
  'MISSING_TOKEN',
  'RATE_LIMIT_OR_FORBIDDEN',
  'NETWORK',
])

async function request(path, options = {}) {
  let res
  try {
    res = await fetch(BASE + path, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers ?? {}),
      },
    })
  } catch (e) {
    const err = new Error('서버에 연결할 수 없습니다.')
    err.code = 'NETWORK'
    err.cause = e
    notifyGlobal(err)
    throw err
  }
  const text = await res.text()
  const data = text ? JSON.parse(text) : null
  if (!res.ok) {
    const err = new Error(data?.error?.message ?? `HTTP ${res.status}`)
    err.status = res.status
    err.code = data?.error?.code ?? 'UNKNOWN'
    // Vite 프록시에서 백엔드 다운 시 502/503/504 — 네트워크 문제로 분류
    if (err.code === 'UNKNOWN' && [502, 503, 504].includes(res.status)) {
      err.code = 'NETWORK'
      err.message = '서버에 연결할 수 없습니다.'
    }
    if (GLOBAL_CODES.has(err.code)) notifyGlobal(err)
    throw err
  }
  return data
}

// GitHub
export const getRepos = () => request('/repos')

export const getBranches = (owner, repo) =>
  request(
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/branches`,
  )

export const getCommits = (owner, repo, branch) =>
  request(
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/commits?branch=${encodeURIComponent(branch)}`,
  )

export const getCommit = (owner, repo, sha) =>
  request(
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/commits/${sha}`,
  )

// LLM
export const createDraft = (body) =>
  request('/draft', { method: 'POST', body: JSON.stringify(body) })

// Posts
export const getPosts = () => request('/posts')

export const getPost = (id) => request(`/posts/${id}`)

export const createPost = (body) =>
  request('/posts', { method: 'POST', body: JSON.stringify(body) })

export const updatePost = (id, patch) =>
  request(`/posts/${id}`, { method: 'PUT', body: JSON.stringify(patch) })

export const deletePost = (id) =>
  request(`/posts/${id}`, { method: 'DELETE' })
