import { useState, useEffect } from 'react';
import api from '../api/axios';

type VerifyStatus = 'idle' | 'loading' | 'success' | 'error';

export default function SettingsPage() {
  const [token, setToken] = useState('');
  const [saved, setSaved] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState<VerifyStatus>('idle');
  const [verifyMessage, setVerifyMessage] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('github_token');
    if (stored) setToken(stored);
  }, []);

  function handleSave() {
    localStorage.setItem('github_token', token.trim());
    setSaved(true);
    setVerifyStatus('idle');
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleVerify() {
    if (!token.trim()) return;
    setVerifyStatus('loading');
    setVerifyMessage('');
    try {
      // 토큰 저장 후 verify (인터셉터가 헤더에 추가함)
      localStorage.setItem('github_token', token.trim());
      const res = await api.get<{ login: string }>('/github/me');
      setVerifyStatus('success');
      setVerifyMessage(`연결 성공: @${res.data.login}`);
    } catch {
      setVerifyStatus('error');
      setVerifyMessage('토큰이 유효하지 않습니다. 다시 확인해주세요.');
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Settings</h1>
      <p className="text-gray-500 text-sm mb-8">
        GitHub Personal Access Token을 입력하면 레포지토리에 접근할 수 있습니다.
      </p>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            GitHub Personal Access Token
          </label>
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-mono"
          />
          <p className="mt-1.5 text-xs text-gray-400">
            GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens
            <br />
            필요 권한: <span className="font-medium">repo (read)</span>
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleVerify}
            disabled={!token.trim() || verifyStatus === 'loading'}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {verifyStatus === 'loading' ? '확인 중...' : '토큰 확인'}
          </button>
          <button
            onClick={handleSave}
            disabled={!token.trim()}
            className="px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saved ? '저장됨!' : '저장'}
          </button>
        </div>

        {verifyStatus === 'success' && (
          <p className="text-sm text-green-600 font-medium">{verifyMessage}</p>
        )}
        {verifyStatus === 'error' && (
          <p className="text-sm text-red-500">{verifyMessage}</p>
        )}
      </div>
    </div>
  );
}
