"use client";

import { Bookmark, Edit3, Heart, MessageCircle, MoreHorizontal, Send, Share2 } from "lucide-react";
import { BlogPost, api } from "@/shared/api/client";

type Props = {
  posts: BlogPost[];
  onChanged: (post: BlogPost) => void;
  onEdit: (post: BlogPost) => void;
  onLike: (id: number) => void;
  onComment: (id: number) => void;
};

export function SavedPosts({ posts, onChanged, onEdit, onLike, onComment }: Props) {
  async function publish(id: number) {
    const updated = await api.publishPost(id);
    onChanged(updated);
  }

  if (posts.length === 0) {
    return (
      <section className="panel">
        <h2>Feed</h2>
        <p className="muted">
          아직 저장된 포스트가 없습니다. Post Studio에서 커밋을 선택하고 첫 개발 포스트를 생성하세요.
        </p>
      </section>
    );
  }

  return (
    <section className="feed" aria-label="저장된 포스트">
      {posts.map((post) => (
        <article className="postCard" key={post.id}>
          <header className="postHeader">
            <div className="profile">
              <div className="miniAvatar">{post.repository_full_name?.slice(0, 1).toUpperCase() || "D"}</div>
              <div>
                <strong>{post.repository_full_name || "local/mock"}</strong>
                <div className="muted">
                  {post.branch} · {post.reading_minutes} min read
                </div>
              </div>
            </div>
            <button className="ghost" title="더보기">
              <MoreHorizontal size={18} />
            </button>
          </header>

          <div className="postHero">
            <span className="emoji">{post.hero_emoji}</span>
            <h3>{post.title}</h3>
          </div>

          <div className="postFooter">
            <div className="actions">
              <button className="ghost" title="좋아요" onClick={() => onLike(post.id)}>
                <Heart size={19} /> {post.likes}
              </button>
              <button className="ghost" title="댓글" onClick={() => onComment(post.id)}>
                <MessageCircle size={19} /> {post.comments}
              </button>
              <button className="ghost" title="공유">
                <Share2 size={19} />
              </button>
            </div>
            <button className="ghost" title="북마크">
              <Bookmark size={19} />
            </button>
          </div>

          <div className="postBody">
            <div className="tagRow">
              <span className="tag">{post.branch}</span>
              <span className={`status ${post.status}`}>{post.status}</span>
              <span className="muted">{new Date(post.updated_at).toLocaleString("ko-KR")}</span>
            </div>
            <p>
              <strong>{post.author}</strong> {post.summary}
            </p>
            <div className="actions">
              <button onClick={() => onEdit(post)} title="수정">
                <Edit3 size={16} /> 수정
              </button>
              <button
                className="primary"
                onClick={() => publish(post.id)}
                disabled={post.status === "published"}
                title="발행"
              >
                <Send size={16} /> 발행
              </button>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
