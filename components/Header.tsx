'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useAuthStore } from '@/stores/useAuthStore';

const NAV_TABS = [
  { label: 'My Blog', href: '/my-blog' },
  { label: 'Saved Posts', href: '/saved-posts' },
  { label: 'Settings', href: '/settings' },
];

export default function Header() {
  const pathname = usePathname();
  const { user, signInWithGitHub, signOut } = useAuthStore();

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-14 border-b border-gray-800 bg-gray-950">
      <div className="flex h-full items-center px-6 gap-8">
        <span className="text-white font-semibold text-lg">Smart Blog</span>

        <nav aria-label="메인 네비게이션">
          <ul className="flex gap-1">
            {NAV_TABS.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    'rounded-md px-3 py-1.5 text-sm transition-colors',
                    'outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950',
                    pathname === href
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  )}
                  aria-current={pathname === href ? 'page' : undefined}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto">
          {user ? (
            <button
              type="button"
              onClick={signOut}
              className="flex items-center gap-2 rounded-full p-1.5 text-gray-400 hover:text-white outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label="로그아웃"
            >
              <User className="h-5 w-5" aria-hidden="true" />
            </button>
          ) : (
            <button
              type="button"
              onClick={signInWithGitHub}
              className="rounded-md bg-gray-800 px-3 py-1.5 text-sm text-white hover:bg-gray-700 outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              GitHub 로그인
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
