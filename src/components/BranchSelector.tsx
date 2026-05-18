import type { Branch, Repository } from "../types/github";

type BranchSelectorProps = {
  branches: Branch[];
  selectedBranch: Branch | null;
  selectedRepository: Repository | null;
  isLoading: boolean;
  errorMessage: string | null;
  onSelect: (branch: Branch) => void;
};

export const BranchSelector = ({
  branches,
  selectedBranch,
  selectedRepository,
  isLoading,
  errorMessage,
  onSelect,
}: BranchSelectorProps) => (
  <section className="panel">
    <div className="section-header">
      <div>
        <p className="section-kicker">Step 2</p>
        <h2>Branch</h2>
      </div>
      {selectedRepository && <span className="tag">{selectedRepository.defaultBranch}</span>}
    </div>

    {!selectedRepository && <p className="state-text">저장소를 먼저 선택하세요.</p>}
    {isLoading && <p className="state-text">브랜치를 불러오는 중입니다.</p>}
    {errorMessage && <p className="error-text">{errorMessage}</p>}
    {selectedRepository && !isLoading && !errorMessage && branches.length === 0 && (
      <p className="state-text">표시할 브랜치가 없습니다.</p>
    )}

    <div className="option-list compact">
      {branches.map((branch) => {
        const isSelected = selectedBranch?.name === branch.name;

        return (
          <button
            className={`option-row${isSelected ? " selected" : ""}`}
            key={branch.name}
            type="button"
            onClick={() => onSelect(branch)}
            disabled={!selectedRepository}
          >
            <span>
              <strong>{branch.name}</strong>
              <small>{branch.sha.slice(0, 7)}</small>
            </span>
            {branch.protected && <span className="tag warning">protected</span>}
          </button>
        );
      })}
    </div>
  </section>
);
