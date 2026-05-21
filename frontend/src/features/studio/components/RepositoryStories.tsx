"use client";

import { Repository } from "@/shared/api/client";

type Props = {
  repositories: Repository[];
  onSelect: () => void;
};

export function RepositoryStories({ repositories, onSelect }: Props) {
  return (
    <section className="stories" aria-label="저장소 스토리">
      {repositories.map((repo) => (
        <button className="story" key={repo.id} onClick={onSelect}>
          <span className="avatarRing">
            <span className="avatarInner">{repo.name.slice(0, 1).toUpperCase()}</span>
          </span>
          <span>{repo.name}</span>
        </button>
      ))}
    </section>
  );
}
