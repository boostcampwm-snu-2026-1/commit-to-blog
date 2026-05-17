import { useEffect, useState } from 'react'
import { getBranches } from '../api.js'
import styles from './BranchSelector.module.css'

export default function BranchSelector({ repo, value, onChange }) {
  const [branches, setBranches] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!repo) return
    setLoading(true)
    setError(null)
    getBranches(repo.owner, repo.name)
      .then((bs) => {
        setBranches(bs)
        if (!value || !bs.some((b) => b.name === value)) {
          const def = bs.find((b) => b.name === repo.defaultBranch) ?? bs[0]
          if (def) onChange(def.name)
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repo?.owner, repo?.name])

  if (!repo) return null
  if (loading) return <p className={styles.empty}>브랜치 불러오는 중...</p>
  if (error) return <p className={styles.error}>에러: {error}</p>

  return (
    <div className={styles.wrap}>
      <label htmlFor="branch-select" className={styles.label}>
        브랜치
      </label>
      <select
        id="branch-select"
        className={styles.select}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
      >
        {branches.map((b) => (
          <option key={b.name} value={b.name}>
            {b.name}
          </option>
        ))}
      </select>
    </div>
  )
}
