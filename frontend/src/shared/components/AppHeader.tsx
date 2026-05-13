"use client";

import { BookOpenText, FilePlus2, Home as HomeIcon, Search } from "lucide-react";
import { AuthStatus, authLoginUrl } from "@/shared/api/client";

type Tab = "saved" | "create";

type Props = {
  tab: Tab;
  onTabChange: (tab: Tab) => void;
  auth: AuthStatus | null;
  onLogout: () => void;
};

export function AppHeader({ tab, onTabChange, auth, onLogout }: Props) {
  return (
    <header className="topbar">
      <div className="brand">
        <span className="brandMark">
          <BookOpenText size={19} />
        </span>
        <span>Commitgram</span>
      </div>
      <div className="searchBox">
        <Search size={16} />
        <span>Search repositories, branches, posts</span>
      </div>
      <nav className="navTabs" aria-label="화면 선택">
        {auth?.authenticated ? (
          <>
            <button className={tab === "saved" ? "active" : ""} onClick={() => onTabChange("saved")}>
              <HomeIcon size={16} /> Feed
            </button>
            <button className={tab === "create" ? "active" : ""} onClick={() => onTabChange("create")}>
              <FilePlus2 size={16} /> Studio
            </button>
            <button onClick={onLogout}>{auth.user?.login ?? "Logout"}</button>
          </>
        ) : (
          <a className="buttonLink primary" href={authLoginUrl}>
            Continue with GitHub
          </a>
        )}
      </nav>
    </header>
  );
}
