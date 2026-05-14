function BranchSelector({ branches, selectedBranch, onChange }) {
  return (
    <div className="field-group">
      <label htmlFor="branch">브랜치 선택</label>
      <select id="branch" value={selectedBranch} onChange={(event) => onChange(event.target.value)}>
        {branches.map((branch) => (
          <option key={branch.name} value={branch.name}>
            {branch.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default BranchSelector;
