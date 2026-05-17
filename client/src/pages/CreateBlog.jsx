import { useState } from 'react'
import RepoSelector from '../components/RepoSelector.jsx'
import BranchSelector from '../components/BranchSelector.jsx'
import CommitList from '../components/CommitList.jsx'

export default function CreateBlog() {
  const [repo, setRepo] = useState(null)
  const [branch, setBranch] = useState(null)
  const [selectedShas, setSelectedShas] = useState([])

  const handleRepoChange = (r) => {
    setRepo(r)
    setBranch(null)
    setSelectedShas([])
  }

  const handleBranchChange = (b) => {
    setBranch(b)
    setSelectedShas([])
  }

  return (
    <section
      style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
    >
      <div>
        <h2 style={{ marginTop: 0 }}>1. 레포 선택</h2>
        <RepoSelector value={repo} onChange={handleRepoChange} />
      </div>

      {repo && (
        <div>
          <h2>2. 브랜치 선택</h2>
          <BranchSelector
            repo={repo}
            value={branch}
            onChange={handleBranchChange}
          />
        </div>
      )}

      {repo && branch && (
        <div>
          <h2>3. 커밋 선택</h2>
          <CommitList
            repo={repo}
            branch={branch}
            value={selectedShas}
            onChange={setSelectedShas}
          />
        </div>
      )}

      {selectedShas.length > 0 && (
        <div>
          <button
            type="button"
            disabled
            style={{
              padding: '0.6rem 1.2rem',
              fontSize: '1rem',
              background: '#ddd',
              color: '#666',
              border: 'none',
              borderRadius: 4,
              cursor: 'not-allowed',
            }}
          >
            초안 생성 (2주차 구현 예정)
          </button>
        </div>
      )}
    </section>
  )
}
