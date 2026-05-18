import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RepoSelector from '../components/RepoSelector';
import CommitList from '../components/CommitList';
import { mockRepos, mockBranches, mockCommits } from '../mocks';
import type { Repo } from '../types';
import styles from './CreateBlogPage.module.css';

export default function CreateBlogPage() {
  const navigate = useNavigate();
  const [selectedRepo, setSelectedRepo] = useState<Repo | null>(null);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedCommits, setSelectedCommits] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleCommit = (sha: string) => {
    setSelectedCommits((prev) =>
      prev.includes(sha) ? prev.filter((s) => s !== sha) : [...prev, sha]
    );
  };

  const handleGenerate = async () => {
    if (!selectedRepo || !selectedBranch || selectedCommits.length === 0) return;
    setIsLoading(true);
    // 2주차에 실제 API 연결 — 지금은 에디터로 바로 이동
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);
    navigate('/editor');
  };

  const canGenerate = selectedRepo && selectedBranch && selectedCommits.length > 0;

  return (
    <div>
      <h2 className={styles.heading}>블로그 글 작성</h2>
      <p className={styles.desc}>저장소와 커밋을 선택하면 AI가 블로그 초안을 생성합니다.</p>

      <div className={styles.form}>
        {/* 저장소 선택 */}
        <RepoSelector
          repos={mockRepos}
          selected={selectedRepo}
          onSelect={(repo) => {
            setSelectedRepo(repo);
            setSelectedBranch('');
            setSelectedCommits([]);
          }}
        />

        {/* 브랜치 선택 */}
        {selectedRepo && (
          <div className={styles.field}>
            <label className={styles.label}>브랜치 선택</label>
            <select
              className={styles.select}
              value={selectedBranch}
              onChange={(e) => {
                setSelectedBranch(e.target.value);
                setSelectedCommits([]);
              }}
            >
              <option value="" disabled>
                브랜치를 선택하세요
              </option>
              {mockBranches.map((b) => (
                <option key={b.name} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* 커밋 목록 */}
        {selectedBranch && (
          <CommitList
            commits={mockCommits}
            selected={selectedCommits}
            onToggle={toggleCommit}
          />
        )}

        {/* 생성 버튼 */}
        {selectedBranch && (
          <button
            className={styles.generateBtn}
            disabled={!canGenerate || isLoading}
            onClick={handleGenerate}
          >
            {isLoading ? '초안 생성 중...' : `AI 초안 생성 (${selectedCommits.length}개 커밋)`}
          </button>
        )}
      </div>
    </div>
  );
}
