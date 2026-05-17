import Link from "next/link";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header className="border-b">
        <nav className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-4">
          <Link href="/" className="font-semibold">
            Commit to Blog
          </Link>
          <Link href="/" className="text-sm">
            My Blog
          </Link>
          <Link href="/saved" className="text-sm">
            Saved Posts
          </Link>
          <Link href="/settings" className="text-sm">
            Settings
          </Link>
        </nav>
      </header>
      <div className="flex flex-1 flex-col">{children}</div>
    </>
  );
}
