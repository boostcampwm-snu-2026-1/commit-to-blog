"use client";

import { Edit3, Send } from "lucide-react";
import { BlogPost, api } from "@/lib/api";

type Props = {
  posts: BlogPost[];
  onChanged: (post: BlogPost) => void;
  onEdit: (post: BlogPost) => void;
};

export function SavedPosts({ posts, onChanged, onEdit }: Props) {
  async function publish(id: number) {
    const updated = await api.publishPost(id);
    onChanged(updated);
  }

  if (posts.length === 0) {
    return (
      <section className="panel">
        <h2>저장된 포스트</h2>
        <p className="muted">저장된 글이 없습니다. 포스트 작성 탭에서 AI 초안을 생성하고 저장하세요.</p>
      </section>
    );
  }

  return (
    <section aria-label="저장된 포스트">
      <div className="postsGrid">
        {posts.map((post) => (
          <article className="postCard" key={post.id}>
            <div className="tagRow">
              <span className="tag">{post.branch}</span>
              <span className="status">{post.status}</span>
            </div>
            <h3>{post.title}</h3>
            <p>{post.summary}</p>
            <p className="muted">{new Date(post.updated_at).toLocaleString("ko-KR")}</p>
            <div className="actions">
              <button onClick={() => onEdit(post)} title="수정">
                <Edit3 size={16} /> 수정
              </button>
              <button className="primary" onClick={() => publish(post.id)} disabled={post.status === "published"} title="발행">
                <Send size={16} /> 발행
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
