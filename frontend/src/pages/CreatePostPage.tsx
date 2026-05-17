import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RepoSelector from '../components/RepoSelector';
import BranchSelector from '../components/BranchSelector';
import CommitList from '../components/CommitList';
import BlogEditor from '../components/BlogEditor';
import { generateBlog, createPost } from '../api/posts';
import type { Repository, CommitRef } from '../types';

const STEPS = ['저장소 선택', '브랜치 선택', '커밋 선택', '초안 편집'];

export default function CreatePostPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [repo, setRepo] = useState<Repository | null>(null);
  const [branch, setBranch] = useState('');
  const [commits, setCommits] = useState<CommitRef[]>([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [summary, setSummary] = useState('');
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);

  const [owner, repoName] = repo ? repo.fullName.split('/') : ['', ''];

  const handleGenerate = async () => {
    if (!repo || !branch || commits.length === 0) return;
    setGenerating(true);
    try {
      const draft = await generateBlog({ repoFullName: repo.fullName, branch, commitShas: commits.map(c => c.sha) });
      setTitle(draft.title);
      setBody(draft.body);
      setSummary(draft.summary);
      setStep(3);
    } catch (e: any) {
      alert(`생성 실패: ${e.message}`);
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!repo) return;
    setSaving(true);
    try {
      await createPost({ title, body, summary, repo_name: repo.fullName, branch, commits, tags: [] });
      navigate('/');
    } catch (e: any) {
      alert(`저장 실패: ${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">새 포스트 작성</h1>
      <div className="flex mb-8 gap-1">
        {STEPS.map((label, i) => (
          <div key={i} className="flex-1 text-center">
            <div className={`w-8 h-8 rounded-full mx-auto mb-1 flex items-center justify-center text-xs font-bold
              ${step > i ? 'bg-green-500 text-white' : step === i ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
              {step > i ? '✓' : i + 1}
            </div>
            <div className={`text-xs ${step === i ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>{label}</div>
          </div>
        ))}
      </div>

      {step === 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">GitHub 저장소를 선택하세요</h2>
          <RepoSelector onSelect={r => { setRepo(r); setStep(1); }} />
        </div>
      )}

      {step === 1 && repo && (
        <div>
          <h2 className="text-lg font-semibold mb-4">{repo.fullName} — 브랜치 선택</h2>
          <BranchSelector owner={owner} repo={repoName} onSelect={b => { setBranch(b); setStep(2); }} />
          <button onClick={() => setStep(0)} className="mt-4 text-sm text-gray-400 hover:text-gray-600">← 뒤로</button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">{branch} — 분석할 커밋 선택</h2>
          <CommitList owner={owner} repo={repoName} branch={branch} onSelectionChange={setCommits} />
          <div className="flex items-center gap-3 mt-4">
            <button onClick={() => setStep(1)} className="text-sm text-gray-400 hover:text-gray-600">← 뒤로</button>
            <button
              onClick={handleGenerate}
              disabled={commits.length === 0 || generating}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-40 transition-colors"
            >
              {generating ? '⏳ AI 생성 중...' : `커밋 ${commits.length}개로 초안 생성`}
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">초안 편집</h2>
          <BlogEditor title={title} body={body} onTitleChange={setTitle} onBodyChange={setBody} />
          <div className="flex items-center gap-3 mt-6">
            <button onClick={() => setStep(2)} className="text-sm text-gray-400 hover:text-gray-600">← 뒤로</button>
            <button
              onClick={handleSave}
              disabled={saving || !title}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-40 transition-colors"
            >
              {saving ? '저장 중...' : '저장하기'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
