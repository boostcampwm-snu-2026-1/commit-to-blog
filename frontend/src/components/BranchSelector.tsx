import { useEffect, useState } from 'react';
import { getBranches } from '../api/github';
import type { Branch } from '../types';

export default function BranchSelector({ owner, repo, onSelect }: { owner: string; repo: string; onSelect: (branch: string) => void }) {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBranches(owner, repo).then(setBranches).finally(() => setLoading(false));
  }, [owner, repo]);

  if (loading) return <div className="text-gray-500 py-4 text-center">브랜치 목록 불러오는 중...</div>;

  return (
    <ul className="space-y-2 max-h-48 overflow-y-auto">
      {branches.map(b => (
        <li key={b.name}>
          <button
            onClick={() => onSelect(b.name)}
            className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 font-mono text-sm transition-colors"
          >
            {b.name}
          </button>
        </li>
      ))}
    </ul>
  );
}
