const GITHUB_API = 'https://api.github.com'

function getToken() {
  const token = process.env.GITHUB_TOKEN
  if (!token) {
    const err = new Error('GITHUB_TOKEN is not set. Add it to server/.env')
    err.code = 'MISSING_TOKEN'
    err.status = 500
    throw err
  }
  return token
}

async function githubFetch(path, { params } = {}) {
  const url = new URL(GITHUB_API + path)
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null) url.searchParams.set(k, v)
    }
  }

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    const err = new Error(`GitHub ${res.status}: ${body.slice(0, 200)}`)
    err.status = res.status
    if (res.status === 401) err.code = 'INVALID_TOKEN'
    else if (res.status === 403) err.code = 'RATE_LIMIT_OR_FORBIDDEN'
    else if (res.status === 404) err.code = 'NOT_FOUND'
    throw err
  }

  return res.json()
}

function normalizeRepo(r) {
  return {
    id: r.id,
    owner: r.owner.login,
    name: r.name,
    fullName: r.full_name,
    defaultBranch: r.default_branch,
    description: r.description,
    updatedAt: r.updated_at,
    private: r.private,
  }
}

function normalizeBranch(b) {
  return {
    name: b.name,
    sha: b.commit.sha,
  }
}

function normalizeCommitSummary(c) {
  return {
    sha: c.sha,
    message: c.commit.message,
    author: {
      name: c.commit.author?.name ?? 'unknown',
      date: c.commit.author?.date ?? null,
    },
    url: c.html_url,
  }
}

function normalizeCommitDetail(c) {
  return {
    sha: c.sha,
    message: c.commit.message,
    author: { name: c.commit.author?.name ?? 'unknown' },
    date: c.commit.author?.date ?? null,
    files: (c.files ?? []).map((f) => ({
      filename: f.filename,
      status: f.status,
      additions: f.additions,
      deletions: f.deletions,
      patch: f.patch,
    })),
  }
}

export async function listRepos() {
  const data = await githubFetch('/user/repos', {
    params: { per_page: 100, sort: 'updated' },
  })
  return data.map(normalizeRepo)
}

export async function listBranches(owner, repo) {
  const data = await githubFetch(
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/branches`,
    { params: { per_page: 100 } },
  )
  return data.map(normalizeBranch)
}

export async function listCommits(owner, repo, branch) {
  const data = await githubFetch(
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/commits`,
    { params: { sha: branch, per_page: 20 } },
  )
  return data.map(normalizeCommitSummary)
}

export async function getCommit(owner, repo, sha) {
  const data = await githubFetch(
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/commits/${sha}`,
  )
  return normalizeCommitDetail(data)
}
