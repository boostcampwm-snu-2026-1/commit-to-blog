import { useTheme } from "./useTheme.js";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      title={isDark ? "라이트 모드로 전환" : "다크 모드로 전환"}
      aria-label={isDark ? "라이트 모드로 전환" : "다크 모드로 전환"}
      className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700"
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}
