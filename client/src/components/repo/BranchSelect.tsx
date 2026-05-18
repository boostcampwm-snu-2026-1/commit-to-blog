type Props = {
  branches: string[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

function BranchSelect({ branches, value, onChange, disabled = false }: Props) {
  const isEmpty = branches.length === 0;
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || isEmpty}
        aria-label="branch select"
        className="w-full appearance-none rounded-md border border-gray-300 bg-white py-2.5 pl-3 pr-10 text-sm text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400"
      >
        {isEmpty && <option value="">브랜치 없음</option>}
        {branches.map((b) => (
          <option key={b} value={b}>
            {b}
          </option>
        ))}
      </select>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
  );
}

export default BranchSelect;
