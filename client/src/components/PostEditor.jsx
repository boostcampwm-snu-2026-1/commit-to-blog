import { useState } from 'react'
import styles from './PostEditor.module.css'

export default function PostEditor({
  initialTitle = '',
  initialBody = '',
  saving = false,
  error = null,
  saveLabel = '블로그 포스트로 저장 및 게시',
  onSave,
  onCancel,
}) {
  const [title, setTitle] = useState(initialTitle)
  const [body, setBody] = useState(initialBody)

  const canSave =
    title.trim().length > 0 && body.trim().length > 0 && !saving

  return (
    <div className={styles.wrap}>
      <label className={styles.label}>제목</label>
      <input
        className={styles.title}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="블로그 제목"
      />

      <label className={styles.label}>본문 (AI 요약 · 편집 가능)</label>
      <textarea
        className={styles.body}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="마크다운 본문"
      />
      <div className={styles.counter}>{body.length} chars</div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.actions}>
        <button type="button" onClick={onCancel} disabled={saving}>
          취소
        </button>
        <button
          type="button"
          className={styles.primary}
          onClick={() => onSave({ title: title.trim(), body })}
          disabled={!canSave}
        >
          {saving ? '저장 중...' : saveLabel}
        </button>
      </div>
    </div>
  )
}
