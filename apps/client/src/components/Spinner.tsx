export function Spinner({ size = 16 }: { size?: number }) {
  return (
    <span
      className="inline-block animate-spin rounded-full border-2 border-slate-300 border-t-brand"
      style={{ width: size, height: size }}
      aria-label="loading"
    />
  );
}
