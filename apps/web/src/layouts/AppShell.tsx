import { useEffect, useState } from "react";
import { NavLink, Outlet, useOutletContext } from "react-router-dom";

import { api } from "../api/client";
import type { AppMeta } from "../api/types";
import { ModePill } from "../components/ModePill";

interface AppShellContextValue {
  meta: AppMeta | null;
}

export function AppShell() {
  const [meta, setMeta] = useState<AppMeta | null>(null);

  useEffect(() => {
    let active = true;

    void api
      .getMeta()
      .then((nextMeta) => {
        if (active) {
          setMeta(nextMeta);
        }
      })
      .catch((error: Error) => {
        console.error(error);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="app-shell">
      <aside className="app-shell__sidebar surface">
        <p className="eyebrow">AI Writing Workflow</p>
        <h1>Commit to Blog</h1>
        <p className="hero-copy">
          GitHub 활동을 선택하고, 변경 맥락을 읽고, 편집 가능한 개발 블로그 초안으로 전환하는 2주 MVP 입니다.
        </p>

        <div className="mode-pill-group">
          <ModePill label="GitHub" mode={meta?.githubMode ?? "demo"} />
          <ModePill label="OpenAI" mode={meta?.openAIMode ?? "demo"} />
        </div>

        <nav className="main-nav">
          <NavLink
            to="/create"
            className={({ isActive }) => `main-nav__link${isActive ? " main-nav__link--active" : ""}`}
          >
            Create Blog
          </NavLink>
          <NavLink
            to="/posts"
            className={({ isActive }) => `main-nav__link${isActive ? " main-nav__link--active" : ""}`}
          >
            Saved Posts
          </NavLink>
        </nav>

        <div className="sidebar-note">
          <h2>이번 범위</h2>
          <ul>
            <li>저장소, 브랜치, 커밋 선택</li>
            <li>AI 초안 생성과 마크다운 편집</li>
            <li>SQLite 기반 저장과 발행 상태 관리</li>
          </ul>
        </div>
      </aside>

      <main className="app-shell__main">
        <Outlet context={{ meta }} />
      </main>
    </div>
  );
}

export function useAppShellContext() {
  return useOutletContext<AppShellContextValue>();
}

