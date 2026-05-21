import { useCallback, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { getPosts, updatePost, deletePost } from '../api.js'
import PostCard from '../components/PostCard.jsx'
import styles from './SavedPosts.module.css'

export default function SavedPosts() {
  const location = useLocation()
  const navigate = useNavigate()

  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [busyId, setBusyId] = useState(null)
  const [toast, setToast] = useState(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setPosts(await getPosts())
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    const msg = location.state?.toast
    if (!msg) return
    setToast(msg)
    navigate(location.pathname, { replace: true, state: null })
    const t = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handlePublishToggle(post) {
    const next = post.status === 'published' ? 'draft' : 'published'
    setBusyId(post.id)
    try {
      await updatePost(post.id, { status: next })
      setPosts((list) =>
        list.map((p) => (p.id === post.id ? { ...p, status: next } : p)),
      )
      setToast(next === 'published' ? '발행되었어요.' : '발행이 취소되었어요.')
      setTimeout(() => setToast(null), 2500)
    } catch (e) {
      setError(e.message)
    } finally {
      setBusyId(null)
    }
  }

  async function handleDelete(post) {
    if (!window.confirm(`"${post.title || '제목 없음'}" 글을 정말 삭제할까요?`)) return
    setBusyId(post.id)
    try {
      await deletePost(post.id)
      setPosts((list) => list.filter((p) => p.id !== post.id))
      setToast('삭제되었어요.')
      setTimeout(() => setToast(null), 2500)
    } catch (e) {
      setError(e.message)
    } finally {
      setBusyId(null)
    }
  }

  return (
    <>
      <div className={styles.header}>
        <div>
          <h2 className={styles.heading}>저장된 포스트</h2>
          <p className={styles.sub}>
            AI가 생성한 초안과 발행된 글 목록이에요.
          </p>
        </div>
        <Link to="/" className={styles.cta}>
          + 블로그 생성
        </Link>
      </div>

      {loading && <p>불러오는 중...</p>}
      {error && <p className={styles.error}>에러: {error}</p>}

      {!loading && !error && posts.length === 0 && (
        <div className={styles.empty}>
          아직 저장된 글이 없어요. 우상단 "블로그 생성"으로 시작해보세요.
        </div>
      )}

      {!loading && !error && posts.length > 0 && (
        <div className={styles.grid}>
          {posts.map((p) => (
            <PostCard
              key={p.id}
              post={p}
              busy={busyId === p.id}
              onPublishToggle={handlePublishToggle}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {toast && <div className={styles.toast}>{toast}</div>}
    </>
  )
}
