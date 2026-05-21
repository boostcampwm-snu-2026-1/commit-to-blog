import type { Branch } from "@commit-to-blog/shared";

type Props = {
  branches: Branch[];
  value: string | null;
  onChange: (branch: string) => void;
  disabled?: boolean;
};

export function BranchSelect({ branches, value, onChange, disabled }: Props) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
        브랜치 선택
      </label>
      <select
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:disabled:bg-slate-900"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || branches.length === 0}
      >
        {branches.length === 0 && <option value="">브랜치 없음</option>}
        {branches.map((b) => (
          <option key={b.name} value={b.name}>
            {b.name}
            {b.isDefault ? " (default)" : ""}
          </option>
        ))}
      </select>
    </div>
  );
}
