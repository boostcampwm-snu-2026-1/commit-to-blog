import { useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';
import { mockPosts } from '../mocks';
import styles from './PostsPage.module.css';

export default function PostsPage() {
  const navigate = useNavigate();

  return (
    <div>
      <div className={styles.header}>
        <h2 className={styles.heading}>내 포스트</h2>
        <button className={styles.createBtn} onClick={() => navigate('/create')}>
          + 새 글 작성
        </button>
      </div>

      {mockPosts.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>📝</span>
          <span>아직 작성된 포스트가 없어요</span>
        </div>
      ) : (
        <div className={styles.grid}>
          {mockPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
