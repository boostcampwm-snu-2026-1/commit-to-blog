import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BlogEditor from '../components/BlogEditor';
import { getPost, updatePost, publishPost } from '../api/posts';
import type { Post } from '../types';

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    if (!id) return;
    getPost(Number(id)).then(p => { setPost(p); setTitle(p.title); setBody(p.body); });
  }, [id]);

  const save = async () => {
    if (!post) return;
    setSaving(true);
    try { await updatePost(post.id, { title, body }); navigate('/'); }
    finally { setSaving(false); }
  };

  const publish = async () => {
    if (!post) return;
    setPublishing(true);
    try { await updatePost(post.id, { title, body }); await publishPost(post.id); navigate('/'); }
    finally { setPublishing(false); }
  };

  if (!post) return <div className="text-center text-gray-400 py-16">불러오는 중...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex-1">포스트 편집</h1>
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-mono">{post.branch}</span>
        {post.published && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">발행됨</span>}
      </div>
      <BlogEditor title={title} body={body} onTitleChange={setTitle} onBodyChange={setBody} />
      <div className="flex items-center gap-3 mt-6">
        <button onClick={() => navigate('/')} className="text-sm text-gray-400 hover:text-gray-600">← 목록으로</button>
        <button onClick={save} disabled={saving} className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-40">
          {saving ? '저장 중...' : '저장'}
        </button>
        {!post.published && (
          <button onClick={publish} disabled={publishing} className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 disabled:opacity-40">
            {publishing ? '발행 중...' : '발행하기'}
          </button>
        )}
      </div>
    </div>
  );
}
