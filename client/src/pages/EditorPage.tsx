import { useState } from 'react';
import { useParams } from 'react-router-dom';
import RichEditor from '../components/RichEditor';
import { mockPosts } from '../mocks';
import type { PostStatus } from '../types';
import styles from './EditorPage.module.css';

const MOCK_DRAFT_CONTENT = `<h1>AI가 생성한 블로그 초안</h1>
<p>이 초안은 선택하신 커밋들을 분석해 자동으로 생성되었습니다. 자유롭게 수정해 주세요.</p>
<h2>구현 내용</h2>
<p>이번 작업에서는 JWT 기반 인증 미들웨어를 구현했습니다.</p>
<pre><code>const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  // ...
};</code></pre>
<h2>마무리</h2>
<p>추가로 개선할 내용이 있다면 직접 수정해 주세요.</p>`;

export default function EditorPage() {
  const { id } = useParams();
  const existingPost = id ? mockPosts.find((p) => p.id === id) : null;

  const [title, setTitle] = useState(existingPost?.title ?? '');
  const [content, setContent] = useState(existingPost?.content ?? MOCK_DRAFT_CONTENT);
  const [status, setStatus] = useState<PostStatus>(existingPost?.status ?? 'draft');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (newStatus: PostStatus) => {
    setIsSaving(true);
    // 2주차에 실제 API 연결
    await new Promise((r) => setTimeout(r, 800));
    setStatus(newStatus);
    setIsSaving(false);
    alert(newStatus === 'published' ? '발행 완료!' : '임시저장 완료!');
  };

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <div className={styles.statusBadge}>
          <span className={styles.label}>상태</span>
          <span className={`${styles.badge} ${styles[status]}`}>
            {status === 'published' ? '발행됨' : '임시저장'}
          </span>
        </div>
        <div className={styles.actions}>
          <button
            className={styles.draftBtn}
            onClick={() => handleSave('draft')}
            disabled={isSaving}
          >
            임시저장
          </button>
          <button
            className={styles.publishBtn}
            onClick={() => handleSave('published')}
            disabled={isSaving}
          >
            {isSaving ? '저장 중...' : '발행하기'}
          </button>
        </div>
      </div>

      <input
        className={styles.titleInput}
        type="text"
        placeholder="포스트 제목을 입력하세요"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <RichEditor content={content} onChange={setContent} />
    </div>
  );
}
