import { Save, Sparkles } from "lucide-react";

function BlogEditor({ draft, repository, selectedBranch, selectedCommits, onChange, onGenerateDraft, onSave }) {
  return (
    <section className="editor-panel" aria-label="블로그 초안 편집기">
      <header className="editor-head">
        <div>
          <p>선택된 커밋</p>
          <h1>{selectedCommits[0]?.message ?? "커밋을 선택해주세요"}</h1>
          <span>
            {repository.fullName} · {selectedBranch}
          </span>
        </div>
        <span className="sha-badge">{selectedCommits[0]?.sha.slice(0, 7) ?? "mock"}</span>
      </header>

      <div className="ai-label">
        <Sparkles size={16} aria-hidden="true" />
        AI 요약
      </div>

      <textarea
        value={draft}
        onChange={(event) => onChange(event.target.value)}
        aria-label="AI가 생성한 블로그 초안"
      />

      <footer className="editor-actions">
        <button className="secondary-button" type="button" onClick={onGenerateDraft}>
          <Sparkles size={16} aria-hidden="true" />
          초안 다시 생성
        </button>
        <button className="primary-button" type="button" onClick={onSave}>
          <Save size={16} aria-hidden="true" />
          저장하기
        </button>
      </footer>
    </section>
  );
}

export default BlogEditor;
