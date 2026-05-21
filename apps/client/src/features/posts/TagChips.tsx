type Props = {
  tags: string[];
  activeTag?: string | null;
  onToggle?: (tag: string) => void;
  size?: "sm" | "md";
};

export function TagChips({ tags, activeTag, onToggle, size = "sm" }: Props) {
  if (tags.length === 0) return null;
  const padding = size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-1 text-xs";
  return (
    <div className="flex flex-wrap gap-1">
      {tags.map((t) => {
        const active = activeTag === t;
        const clickable = Boolean(onToggle);
        const base = `${padding} rounded font-medium ${
          active
            ? "bg-brand text-white"
            : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200"
        }`;
        const Cls = `${base} ${clickable ? "cursor-pointer hover:ring-1 hover:ring-brand/40" : ""}`;
        return clickable ? (
          <button key={t} type="button" onClick={() => onToggle!(t)} className={Cls}>
            #{t}
          </button>
        ) : (
          <span key={t} className={Cls}>
            #{t}
          </span>
        );
      })}
    </div>
  );
}
