import { Sparkles } from "lucide-react";

function CommitList({ commits, selectedCommitIds, onToggleCommit, onGenerateDraft }) {
  return (
    <section className="commit-section">
      <div className="panel-title">
        <h2>최근 커밋</h2>
        <span>{commits.length} commits</span>
      </div>
      <div className="commit-list">
        {commits.map((commit) => {
          const isSelected = selectedCommitIds.includes(commit.sha);

          return (
            <article key={commit.sha} className={`commit-item ${isSelected ? "selected" : ""}`}>
              <button type="button" onClick={() => onToggleCommit(commit.sha)}>
                <strong>{commit.message}</strong>
                <span>
                  {commit.author} · {commit.date}
                </span>
              </button>
              <button className="small-action" type="button" onClick={onGenerateDraft}>
                <Sparkles size={14} aria-hidden="true" />
                요약 생성
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default CommitList;
