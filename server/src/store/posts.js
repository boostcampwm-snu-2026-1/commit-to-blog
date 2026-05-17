import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DATA_FILE = path.resolve(__dirname, '../../data/posts.json')

let queue = Promise.resolve()
function serialize(task) {
  const next = queue.then(task, task)
  queue = next.catch(() => {})
  return next
}

async function load() {
  try {
    const raw = await readFile(DATA_FILE, 'utf8')
    const json = JSON.parse(raw)
    if (!Array.isArray(json.posts)) return { posts: [] }
    return json
  } catch (err) {
    if (err.code === 'ENOENT') return { posts: [] }
    throw err
  }
}

async function save(data) {
  await mkdir(path.dirname(DATA_FILE), { recursive: true })
  await writeFile(DATA_FILE, JSON.stringify(data, null, 2) + '\n', 'utf8')
}

function genId() {
  return `p_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
}

export async function readAll() {
  const { posts } = await load()
  return [...posts].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
}

export async function findById(id) {
  const { posts } = await load()
  return posts.find((p) => p.id === id) ?? null
}

export async function create(input) {
  return serialize(async () => {
    const data = await load()
    const now = new Date().toISOString()
    const post = {
      id: genId(),
      title: input.title ?? '',
      content: input.content ?? '',
      summary: input.summary ?? '',
      status: input.status ?? 'draft',
      source: input.source ?? null,
      createdAt: now,
      updatedAt: now,
    }
    data.posts.push(post)
    await save(data)
    return post
  })
}

export async function update(id, patch) {
  return serialize(async () => {
    const data = await load()
    const idx = data.posts.findIndex((p) => p.id === id)
    if (idx === -1) return null
    const existing = data.posts[idx]
    const updated = {
      ...existing,
      ...patch,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    }
    data.posts[idx] = updated
    await save(data)
    return updated
  })
}

export async function remove(id) {
  return serialize(async () => {
    const data = await load()
    const before = data.posts.length
    data.posts = data.posts.filter((p) => p.id !== id)
    if (data.posts.length === before) return false
    await save(data)
    return true
  })
}
