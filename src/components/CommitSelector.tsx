import type { Branch, CommitSummary } from "../types/github";

type CommitSelectorProps = {
  commits: CommitSummary[];
  selectedBranch: Branch | null;
  selectedCommitShas: string[];
  isLoading: boolean;
  errorMessage: string | null;
  onToggle: (sha: string) => void;
};

const formatDate = (value: string) => {
  if (!value) {
    return "날짜 없음";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
};

export const CommitSelector = ({
  commits,
  selectedBranch,
  selectedCommitShas,
  isLoading,
  errorMessage,
  onToggle,
}: CommitSelectorProps) => (
  <section className="panel">
    <div className="section-header">
      <div>
        <p className="section-kicker">Step 3</p>
        <h2>Commits</h2>
      </div>
      <span className="tag">{selectedCommitShas.length} selected</span>
    </div>

    {!selectedBranch && <p className="state-text">브랜치를 먼저 선택하세요.</p>}
    {isLoading && <p className="state-text">커밋을 불러오는 중입니다.</p>}
    {errorMessage && <p className="error-text">{errorMessage}</p>}
    {selectedBranch && !isLoading && !errorMessage && commits.length === 0 && (
      <p className="state-text">표시할 커밋이 없습니다.</p>
    )}

    <div className="commit-list">
      {commits.map((commit) => {
        const isSelected = selectedCommitShas.includes(commit.sha);

        return (
          <label className={`commit-row${isSelected ? " selected" : ""}`} key={commit.sha}>
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggle(commit.sha)}
              disabled={!selectedBranch}
            />
            <span className="commit-copy">
              <strong>{commit.message.split("\n")[0]}</strong>
              <small>
                {commit.sha.slice(0, 7)} · {commit.authorName} · {formatDate(commit.authorDate)}
              </small>
            </span>
          </label>
        );
      })}
    </div>
  </section>
);
