import type { Repo } from '../types';
import styles from './RepoSelector.module.css';

interface Props {
  repos: Repo[];
  selected: Repo | null;
  onSelect: (repo: Repo) => void;
}

export default function RepoSelector({ repos, selected, onSelect }: Props) {
  return (
    <div className={styles.wrapper}>
      <label className={styles.label}>저장소 선택</label>
      <select
        className={styles.select}
        value={selected?.id ?? ''}
        onChange={(e) => {
          const repo = repos.find((r) => r.id === Number(e.target.value));
          if (repo) onSelect(repo);
        }}
      >
        <option value="" disabled>
          저장소를 선택하세요
        </option>
        {repos.map((repo) => (
          <option key={repo.id} value={repo.id}>
            {repo.fullName}
            {repo.description ? ` — ${repo.description}` : ''}
          </option>
        ))}
      </select>
    </div>
  );
}
