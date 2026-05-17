import { useEffect, useState } from 'react'
import { getRepos } from '../api.js'
import styles from './RepoSelector.module.css'

export default function RepoSelector({ value, onChange }) {
  const [repos, setRepos] = useState([])
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getRepos()
      .then(setRepos)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className={styles.empty}>레포 목록 불러오는 중...</p>
  if (error) return <p className={styles.error}>에러: {error}</p>

  const q = filter.toLowerCase()
  const filtered = q
    ? repos.filter((r) => r.fullName.toLowerCase().includes(q))
    : repos

  return (
    <div className={styles.wrap}>
      <input
        className={styles.search}
        type="search"
        placeholder={`레포 검색 (총 ${repos.length}개)`}
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <ul className={styles.list}>
        {filtered.map((r) => {
          const selected =
            value?.owner === r.owner && value?.name === r.name
          return (
            <li key={r.id}>
              <button
                type="button"
                className={`${styles.item} ${selected ? styles.selected : ''}`}
                onClick={() => onChange(r)}
              >
                <span className={styles.name}>{r.fullName}</span>
                {r.private && <span className={styles.badge}>private</span>}
                {r.description && (
                  <span className={styles.desc}>{r.description}</span>
                )}
              </button>
            </li>
          )
        })}
        {filtered.length === 0 && (
          <li className={styles.empty}>검색 결과 없음</li>
        )}
      </ul>
    </div>
  )
}
