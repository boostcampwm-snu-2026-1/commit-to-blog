import styles from './LoginPage.module.css';

export default function LoginPage() {
  const handleLogin = () => {
    window.location.href = '/auth/github';
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.icon}>✦</div>
        <h1 className={styles.title}>GitBlog</h1>
        <p className={styles.desc}>GitHub 커밋을 분석해<br />블로그 포스트를 자동으로 만들어드려요</p>
        <button className={styles.btn} onClick={handleLogin}>
          GitHub으로 시작하기
        </button>
      </div>
    </div>
  );
}
