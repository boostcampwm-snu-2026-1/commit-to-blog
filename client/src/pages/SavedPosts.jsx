import { useEffect, useState } from 'react'
import { getPosts } from '../api.js'

export default function SavedPosts() {
  const [posts, setPosts] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPosts()
      .then(setPosts)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>불러오는 중...</p>
  if (error) return <p style={{ color: 'crimson' }}>에러: {error}</p>
  if (posts.length === 0) return <p>아직 저장된 글이 없어요.</p>

  return (
    <ul style={{ paddingLeft: '1.2rem' }}>
      {posts.map((p) => (
        <li key={p.id} style={{ marginBottom: '0.5rem' }}>
          <strong>{p.title || '(제목 없음)'}</strong>{' '}
          <small style={{ color: '#888' }}>[{p.status}]</small>
          {p.summary && <div style={{ color: '#666' }}>{p.summary}</div>}
        </li>
      ))}
    </ul>
  )
}
