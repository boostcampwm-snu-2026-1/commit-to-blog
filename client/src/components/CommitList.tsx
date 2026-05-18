import type { Commit } from '../types';
import styles from './CommitList.module.css';

interface Props {
  commits: Commit[];
  selected: string[];
  onToggle: (sha: string) => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function CommitList({ commits, selected, onToggle }: Props) {
  return (
    <div className={styles.wrapper}>
      <label className={styles.label}>커밋 선택 ({selected.length}개 선택됨)</label>
      <ul className={styles.list}>
        {commits.map((commit) => {
          const isChecked = selected.includes(commit.sha);
          return (
            <li
              key={commit.sha}
              className={`${styles.item} ${isChecked ? styles.checked : ''}`}
              onClick={() => onToggle(commit.sha)}
            >
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={isChecked}
                onChange={() => onToggle(commit.sha)}
                onClick={(e) => e.stopPropagation()}
              />
              <div className={styles.info}>
                <span className={styles.message}>{commit.message}</span>
                <span className={styles.meta}>
                  <code className={styles.sha}>{commit.sha.slice(0, 7)}</code>
                  <span>{commit.author}</span>
                  <span>{formatDate(commit.date)}</span>
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
