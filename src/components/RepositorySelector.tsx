import type { Repository } from "../types/github";

type RepositorySelectorProps = {
  repositories: Repository[];
  selectedRepository: Repository | null;
  isLoading: boolean;
  errorMessage: string | null;
  onSelect: (repository: Repository) => void;
  onRetry: () => void;
};

export const RepositorySelector = ({
  repositories,
  selectedRepository,
  isLoading,
  errorMessage,
  onSelect,
  onRetry,
}: RepositorySelectorProps) => (
  <section className="panel">
    <div className="section-header">
      <div>
        <p className="section-kicker">Step 1</p>
        <h2>Repository</h2>
      </div>
      <button className="icon-button" type="button" onClick={onRetry} title="저장소 다시 불러오기">
        R
      </button>
    </div>

    {isLoading && <p className="state-text">저장소를 불러오는 중입니다.</p>}
    {errorMessage && <p className="error-text">{errorMessage}</p>}
    {!isLoading && !errorMessage && repositories.length === 0 && (
      <p className="state-text">표시할 저장소가 없습니다.</p>
    )}

    <div className="option-list">
      {repositories.map((repository) => {
        const isSelected = selectedRepository?.fullName === repository.fullName;

        return (
          <button
            className={`option-row${isSelected ? " selected" : ""}`}
            key={repository.id}
            type="button"
            onClick={() => onSelect(repository)}
          >
            <span>
              <strong>{repository.name}</strong>
              <small>{repository.fullName}</small>
            </span>
            <span className="tag">{repository.visibility}</span>
          </button>
        );
      })}
    </div>
  </section>
);
