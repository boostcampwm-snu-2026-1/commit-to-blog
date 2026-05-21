import { useNavigate } from 'react-router-dom'
import styles from './PostCard.module.css'

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

export default function PostCard({ post, onPublishToggle, onDelete, busy }) {
  const navigate = useNavigate()
  const branch = post.source?.branch
  const isPublished = post.status === 'published'

  return (
    <div className={styles.card}>
      <div className={styles.head}>
        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
          {branch && <span className={styles.branch}>{branch}</span>}
          <span
            className={`${styles.status} ${isPublished ? styles.statusPublished : styles.statusDraft}`}
          >
            {isPublished ? 'published' : 'draft'}
          </span>
        </div>
        <span className={styles.date}>{formatDate(post.createdAt)}</span>
      </div>

      <h3 className={styles.title}>{post.title || '(제목 없음)'}</h3>
      <p className={styles.summary}>{post.summary || ''}</p>

      <div className={styles.actions}>
        <button
          type="button"
          onClick={() => navigate(`/posts/${post.id}/edit`)}
          disabled={busy}
        >
          수정하기
        </button>
        <button
          type="button"
          className={styles.primary}
          onClick={() => onPublishToggle(post)}
          disabled={busy}
        >
          {isPublished ? '발행 취소' : '발행하기'}
        </button>
        <button
          type="button"
          className={styles.danger}
          onClick={() => onDelete(post)}
          disabled={busy}
          aria-label="삭제"
        >
          삭제
        </button>
      </div>
    </div>
  )
}
