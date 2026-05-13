import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Commit to Blog",
  description: "Generate development blog drafts from GitHub activity",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
