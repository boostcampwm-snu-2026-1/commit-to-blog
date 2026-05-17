import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { api } from "../api/client";
import type { PostRecord } from "../api/types";
import { StatusBadge } from "../components/StatusBadge";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export function SavedPostsPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<PostRecord[]>([]);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const deferredSearchText = useDeferredValue(searchText);

  useEffect(() => {
    let active = true;

    void api
      .listPosts()
      .then((nextPosts) => {
        if (active) {
          setPosts(nextPosts);
        }
      })
      .catch((nextError: Error) => {
        if (active) {
          setError(nextError.message);
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const filteredPosts = useMemo(() => {
    const keyword = deferredSearchText.trim().toLowerCase();

    if (!keyword) {
      return posts;
    }

    return posts.filter((post) =>
      [post.title, post.summary, post.repositoryName, post.branch].some((value) => value.toLowerCase().includes(keyword))
    );
  }, [deferredSearchText, posts]);

  return (
    <section className="page-stack">
      <div className="page-hero surface">
        <p className="eyebrow">Saved Posts</p>
        <h2>저장된 포스트 보기</h2>
        <p>생성된 글을 카드형으로 확인하고, 다시 열어 수정하거나 발행 상태를 관리할 수 있습니다.</p>
      </div>

      <article className="surface panel">
        <header className="panel__header">
          <div>
            <p className="eyebrow">Archive</p>
            <h3>{posts.length}개의 저장된 글</h3>
          </div>
        </header>

        <label className="field">
          <span>검색</span>
          <input
            type="search"
            placeholder="제목, 저장소, 브랜치로 찾기"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
          />
        </label>

        {error ? <p className="error-message">{error}</p> : null}
        {isLoading ? <p className="placeholder-text">저장된 글을 불러오는 중입니다.</p> : null}

        {!isLoading && filteredPosts.length === 0 ? (
          <p className="placeholder-text">아직 저장된 글이 없습니다. 먼저 Create Blog 에서 초안을 생성해보세요.</p>
        ) : (
          <div className="post-grid">
            {filteredPosts.map((post) => (
              <button
                key={post.id}
                type="button"
                className="post-card"
                onClick={() => navigate(`/posts/${post.id}`)}
              >
                <div className="post-card__topline">
                  <span className="muted-chip">{post.branch}</span>
                  <StatusBadge status={post.status} />
                </div>
                <h3>{post.title}</h3>
                <p>{post.summary}</p>
                <div className="post-card__footer">
                  <span>
                    {post.repositoryOwner}/{post.repositoryName}
                  </span>
                  <span>{formatDate(post.updatedAt)}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </article>
    </section>
  );
}

