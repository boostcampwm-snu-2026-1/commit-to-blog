import { useEffect, useState } from 'react';
import { getCommits } from '../api/github';
import type { CommitRef } from '../types';

export default function CommitList({ owner, repo, branch, onSelectionChange }: {
  owner: string; repo: string; branch: string; onSelectionChange: (commits: CommitRef[]) => void;
}) {
  const [commits, setCommits] = useState<CommitRef[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCommits(owner, repo, branch).then(setCommits).finally(() => setLoading(false));
  }, [owner, repo, branch]);

  const toggle = (sha: string) => {
    const next = new Set(selected);
    next.has(sha) ? next.delete(sha) : next.add(sha);
    setSelected(next);
    onSelectionChange(commits.filter(c => next.has(c.sha)));
  };

  if (loading) return <div className="text-gray-500 py-4 text-center">커밋 목록 불러오는 중...</div>;

  return (
    <ul className="space-y-2 max-h-80 overflow-y-auto">
      {commits.map(c => (
        <li key={c.sha}>
          <label className="flex items-start gap-3 px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
            <input type="checkbox" checked={selected.has(c.sha)} onChange={() => toggle(c.sha)} className="mt-1 accent-blue-600" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 line-clamp-2">{c.message}</div>
              <div className="text-xs text-gray-400 mt-0.5">{c.author} · {new Date(c.date).toLocaleDateString('ko-KR')}</div>
            </div>
            <span className="text-xs text-gray-300 font-mono shrink-0">{c.sha.slice(0, 7)}</span>
          </label>
        </li>
      ))}
    </ul>
  );
}
