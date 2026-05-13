"use client";

import { BookOpenText, FilePlus2, Home as HomeIcon, Search } from "lucide-react";

type Tab = "saved" | "create";

type Props = {
  tab: Tab;
  onTabChange: (tab: Tab) => void;
};

export function AppHeader({ tab, onTabChange }: Props) {
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
        <button className={tab === "saved" ? "active" : ""} onClick={() => onTabChange("saved")}>
          <HomeIcon size={16} /> Feed
        </button>
        <button className={tab === "create" ? "active" : ""} onClick={() => onTabChange("create")}>
          <FilePlus2 size={16} /> Studio
        </button>
      </nav>
    </header>
  );
}
