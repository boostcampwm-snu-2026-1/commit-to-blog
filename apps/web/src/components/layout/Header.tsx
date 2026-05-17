import { NavLink } from "react-router-dom";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm transition ${
    isActive
      ? "font-semibold text-slate-900 underline underline-offset-4"
      : "text-slate-600 hover:text-slate-900"
  }`;

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <h1 className="text-lg font-bold">Smart Blog</h1>
          <nav className="flex items-center gap-6">
            <NavLink to="/" end className={linkClass}>
              My Blog
            </NavLink>
            <NavLink to="/saved" className={linkClass}>
              Saved Posts
            </NavLink>
            <NavLink to="/settings" className={linkClass}>
              Settings
            </NavLink>
          </nav>
        </div>
        <div className="h-8 w-8 rounded-full bg-slate-100" aria-hidden />
      </div>
    </header>
  );
}
