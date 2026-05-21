import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getPosts } from '../api.js'

export default function SavedPosts() {
  const location = useLocation()
  const navigate = useNavigate()

  const [posts, setPosts] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    getPosts()
      .then(setPosts)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const msg = location.state?.toast
    if (!msg) return
    setToast(msg)
    navigate(location.pathname, { replace: true, state: null })
    const t = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            padding: '0.75rem 1rem',
            background: '#111',
            color: '#fff',
            borderRadius: 6,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 1000,
          }}
        >
          {toast}
        </div>
      )}

      {loading && <p>불러오는 중...</p>}
      {error && <p style={{ color: 'crimson' }}>에러: {error}</p>}
      {!loading && !error && posts.length === 0 && (
        <p>아직 저장된 글이 없어요.</p>
      )}
      {!loading && !error && posts.length > 0 && (
        <ul style={{ paddingLeft: '1.2rem' }}>
          {posts.map((p) => (
            <li key={p.id} style={{ marginBottom: '0.5rem' }}>
              <strong>{p.title || '(제목 없음)'}</strong>{' '}
              <small style={{ color: '#888' }}>[{p.status}]</small>
              {p.summary && <div style={{ color: '#666' }}>{p.summary}</div>}
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
