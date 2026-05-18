import { NavLink, Outlet } from 'react-router-dom';
import styles from './Layout.module.css';

export default function Layout() {
  return (
    <div className={styles.root}>
      <nav className={styles.nav}>
        <span className={styles.logo}>GitBlog</span>
        <div className={styles.links}>
          <NavLink to="/posts" className={({ isActive }) => (isActive ? styles.active : '')}>
            포스트
          </NavLink>
          <NavLink to="/create" className={({ isActive }) => (isActive ? styles.active : '')}>
            글 작성
          </NavLink>
        </div>
        <button className={styles.loginBtn}>GitHub 로그인</button>
      </nav>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
