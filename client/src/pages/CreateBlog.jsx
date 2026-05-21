import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import RepoSelector from '../components/RepoSelector.jsx'
import BranchSelector from '../components/BranchSelector.jsx'
import CommitList from '../components/CommitList.jsx'
import PostEditor from '../components/PostEditor.jsx'
import { createDraft, createPost } from '../api.js'

export default function CreateBlog() {
  const navigate = useNavigate()

  const [repo, setRepo] = useState(null)
  const [branch, setBranch] = useState(null)
  const [selectedShas, setSelectedShas] = useState([])

  const [draft, setDraft] = useState(null) // { title, content, summary } or null
  const [draftLoading, setDraftLoading] = useState(false)
  const [draftError, setDraftError] = useState(null)

  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)

  const handleRepoChange = (r) => {
    setRepo(r)
    setBranch(null)
    setSelectedShas([])
    resetDraft()
  }

  const handleBranchChange = (b) => {
    setBranch(b)
    setSelectedShas([])
    resetDraft()
  }

  function resetDraft() {
    setDraft(null)
    setDraftError(null)
    setSaveError(null)
  }

  async function handleGenerate() {
    if (!repo || !branch || selectedShas.length === 0) return
    setDraftLoading(true)
    setDraftError(null)
    try {
      const result = await createDraft({
        owner: repo.owner,
        repo: repo.name,
        branch,
        commitShas: selectedShas,
      })
      setDraft(result)
    } catch (e) {
      setDraftError(e.message)
    } finally {
      setDraftLoading(false)
    }
  }

  async function handleSave({ title, body }) {
    setSaving(true)
    setSaveError(null)
    try {
      await createPost({
        title,
        content: body,
        summary: body,
        status: 'published',
        source: {
          owner: repo.owner,
          repo: repo.name,
          branch,
          commitShas: selectedShas,
        },
      })
      navigate('/posts', {
        state: { toast: '블로그 포스트가 저장 및 게시되었어요.' },
      })
    } catch (e) {
      setSaveError(e.message)
      setSaving(false)
    }
  }

  function handleCancel() {
    resetDraft()
  }

  if (draft) {
    return (
      <PostEditor
        initialTitle={draft.title ?? ''}
        initialBody={draft.content ?? ''}
        saving={saving}
        error={saveError}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    )
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={draftLoading}
            style={{
              padding: '0.6rem 1.2rem',
              fontSize: '1rem',
              background: draftLoading ? '#888' : '#000',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              cursor: draftLoading ? 'wait' : 'pointer',
              alignSelf: 'flex-start',
            }}
          >
            {draftLoading ? '초안 생성 중...' : '초안 생성'}
          </button>
          {draftError && (
            <p style={{ color: '#b00020', margin: 0 }}>
              초안 생성 실패: {draftError}
            </p>
          )}
        </div>
      )}
    </section>
  )
}
