import { Search } from "lucide-react";

function RepositorySelector({ repositories, selectedRepositoryId, onChange }) {
  return (
    <div className="field-group">
      <label htmlFor="repository">저장소 선택</label>
      <div className="search-box">
        <Search size={15} aria-hidden="true" />
        <select
          id="repository"
          value={selectedRepositoryId}
          onChange={(event) => onChange(Number(event.target.value))}
        >
          {repositories.map((repository) => (
            <option key={repository.id} value={repository.id}>
              {repository.fullName}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default RepositorySelector;
