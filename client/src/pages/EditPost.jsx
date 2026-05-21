import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PostEditor from '../components/PostEditor.jsx'
import { getPost, updatePost } from '../api.js'

export default function EditPost() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [post, setPost] = useState(null)
  const [loadError, setLoadError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)

  useEffect(() => {
    getPost(id)
      .then(setPost)
      .catch((e) => setLoadError(e.message))
  }, [id])

  async function handleSave({ title, body }) {
    setSaving(true)
    setSaveError(null)
    try {
      await updatePost(id, { title, content: body, summary: body })
      navigate('/posts', {
        state: { toast: '수정 사항이 저장되었어요.' },
      })
    } catch (e) {
      setSaveError(e.message)
      setSaving(false)
    }
  }

  if (loadError)
    return <p style={{ color: 'crimson' }}>에러: {loadError}</p>
  if (!post) return <p>불러오는 중...</p>

  return (
    <PostEditor
      initialTitle={post.title}
      initialBody={post.content}
      saving={saving}
      error={saveError}
      saveLabel="저장"
      onSave={handleSave}
      onCancel={() => navigate('/posts')}
    />
  )
}
