import { NavLink } from 'react-router-dom';

const tabs = [
  { to: '/', label: 'My Blog', end: true },
  { to: '/saved', label: 'Saved Posts', end: false },
  { to: '/settings', label: 'Settings', end: false },
] as const;

function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-8">
        <div className="flex items-center gap-12">
          <span className="text-xl font-bold tracking-tight text-gray-900">Smart Blog</span>
          <nav className="flex items-center gap-8">
            {tabs.map((tab) => (
              <NavLink
                key={tab.to}
                to={tab.to}
                end={tab.end}
                className={({ isActive }) =>
                  [
                    'text-base transition-colors',
                    isActive
                      ? 'font-semibold text-gray-900 underline underline-offset-8'
                      : 'text-gray-500 hover:text-gray-800',
                  ].join(' ')
                }
              >
                {tab.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <button
          type="button"
          aria-label="account menu"
          className="grid h-9 w-9 place-items-center rounded-full border border-gray-300 text-gray-500 hover:bg-gray-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="10" r="3" />
            <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
          </svg>
        </button>
      </div>
    </header>
  );
}

export default Header;
