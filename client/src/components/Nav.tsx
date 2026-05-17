import { Link, NavLink } from 'react-router-dom';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 text-sm rounded ${
    isActive ? 'text-black font-semibold bg-gray-100' : 'text-gray-600 hover:text-black'
  }`;

export default function Nav() {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-lg font-bold">
          Smart Blog
        </Link>
        <nav className="flex items-center gap-1">
          <NavLink to="/posts" className={linkClass}>
            Saved Posts
          </NavLink>
          <NavLink to="/create" className={linkClass}>
            Create
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
