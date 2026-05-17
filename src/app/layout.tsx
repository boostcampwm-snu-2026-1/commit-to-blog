import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Commit to Blog",
  description: "Turn your git commits into blog posts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
