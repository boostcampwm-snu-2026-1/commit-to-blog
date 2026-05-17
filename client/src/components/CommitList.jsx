import { useEffect, useState } from 'react'
import { getCommits } from '../api.js'
import styles from './CommitList.module.css'

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleString('ko-KR')
}

export default function CommitList({ repo, branch, value, onChange }) {
  const [commits, setCommits] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!repo || !branch) return
    setLoading(true)
    setError(null)
    setCommits([])
    getCommits(repo.owner, repo.name, branch)
      .then(setCommits)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repo?.owner, repo?.name, branch])

  if (!repo || !branch) return null
  if (loading) return <p className={styles.empty}>커밋 불러오는 중...</p>
  if (error) return <p className={styles.error}>에러: {error}</p>
  if (commits.length === 0)
    return <p className={styles.empty}>이 브랜치에 커밋이 없어요.</p>

  const toggle = (sha) => {
    onChange(
      value.includes(sha) ? value.filter((s) => s !== sha) : [...value, sha],
    )
  }

  return (
    <div className={styles.wrap}>
      <p className={styles.count}>
        {value.length}개 선택 / 최근 {commits.length}개
      </p>
      <ul className={styles.list}>
        {commits.map((c) => {
          const checked = value.includes(c.sha)
          return (
            <li key={c.sha}>
              <label
                className={`${styles.item} ${checked ? styles.selected : ''}`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(c.sha)}
                />
                <span className={styles.body}>
                  <span className={styles.message}>
                    {c.message.split('\n')[0]}
                  </span>
                  <small className={styles.meta}>
                    {c.author.name} · {formatDate(c.author.date)} ·{' '}
                    {c.sha.slice(0, 7)}
                  </small>
                </span>
              </label>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
