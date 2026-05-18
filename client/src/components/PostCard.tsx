import { useNavigate } from 'react-router-dom';
import type { Post } from '../types';
import styles from './PostCard.module.css';

interface Props {
  post: Post;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function excerpt(content: string, maxLen = 100) {
  const plain = content.replace(/[#*`>\-]/g, '').trim();
  return plain.length > maxLen ? plain.slice(0, maxLen) + '...' : plain;
}

export default function PostCard({ post }: Props) {
  const navigate = useNavigate();

  return (
    <article className={styles.card} onClick={() => navigate(`/editor/${post.id}`)}>
      <div className={styles.header}>
        <span className={`${styles.badge} ${styles[post.status]}`}>
          {post.status === 'published' ? '발행됨' : '임시저장'}
        </span>
        <span className={styles.date}>{formatDate(post.updatedAt)}</span>
      </div>
      <h3 className={styles.title}>{post.title}</h3>
      <p className={styles.excerpt}>{excerpt(post.content)}</p>
      <div className={styles.footer}>
        <span className={styles.tag}>{post.repoName}</span>
        <span className={styles.tag}>{post.branchName}</span>
      </div>
    </article>
  );
}
