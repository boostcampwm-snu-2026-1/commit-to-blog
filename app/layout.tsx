import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/Providers';
import Header from '@/components/Header';
import { Toaster } from '@/components/ui/Toast';

export const metadata: Metadata = {
  title: 'commit-to-blog',
  description: 'GitHub 커밋을 AI 블로그 포스트로 변환',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-gray-50 text-gray-900 antialiased">
        <Providers>
          <Header />
          <main className="pt-14">{children}</main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
