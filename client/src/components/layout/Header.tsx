import { NavLink } from 'react-router-dom';

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <span className="font-bold text-lg text-gray-900">Smart Blog</span>
        <nav className="flex gap-6 text-sm font-medium">
          <NavLink
            to="/create"
            className={({ isActive }) =>
              isActive ? 'text-gray-900 border-b-2 border-gray-900 pb-0.5' : 'text-gray-500 hover:text-gray-900'
            }
          >
            My Blog
          </NavLink>
          <NavLink
            to="/saved"
            className={({ isActive }) =>
              isActive ? 'text-gray-900 border-b-2 border-gray-900 pb-0.5' : 'text-gray-500 hover:text-gray-900'
            }
          >
            Saved Posts
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              isActive ? 'text-gray-900 border-b-2 border-gray-900 pb-0.5' : 'text-gray-500 hover:text-gray-900'
            }
          >
            Settings
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
