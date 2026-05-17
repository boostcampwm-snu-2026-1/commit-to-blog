const BASE = '/api'

async function request(path, options = {}) {
  const res = await fetch(BASE + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
  })
  const text = await res.text()
  const data = text ? JSON.parse(text) : null
  if (!res.ok) {
    const err = new Error(data?.error?.message ?? `HTTP ${res.status}`)
    err.status = res.status
    err.code = data?.error?.code ?? 'UNKNOWN'
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

// Posts
export const getPosts = () => request('/posts')

export const getPost = (id) => request(`/posts/${id}`)

export const createPost = (body) =>
  request('/posts', { method: 'POST', body: JSON.stringify(body) })

export const updatePost = (id, patch) =>
  request(`/posts/${id}`, { method: 'PUT', body: JSON.stringify(patch) })

export const deletePost = (id) =>
  request(`/posts/${id}`, { method: 'DELETE' })
