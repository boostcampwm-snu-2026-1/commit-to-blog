import { useEffect, useState } from 'react';
import { getRepos } from '../api/github';
import type { Repository } from '../types';

export default function RepoSelector({ onSelect }: { onSelect: (repo: Repository) => void }) {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getRepos().then(setRepos).catch(e => setError(e.message)).finally(() => setLoading(false));
  }, []);

  const filtered = repos.filter(r => r.fullName.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="text-gray-500 py-4 text-center">저장소 목록 불러오는 중...</div>;
  if (error) return <div className="text-red-500 py-4">오류: {error}</div>;

  return (
    <div>
      <input
        type="text"
        placeholder="저장소 검색..."
        className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <ul className="space-y-2 max-h-64 overflow-y-auto">
        {filtered.map(repo => (
          <li key={repo.id}>
            <button
              onClick={() => onSelect(repo)}
              className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-colors"
            >
              <div className="font-medium text-gray-900 text-sm">{repo.fullName}</div>
              {repo.description && <div className="text-xs text-gray-500 truncate mt-0.5">{repo.description}</div>}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
