"use client";

import { Sparkles } from "lucide-react";
import { BlogPost, PostAnalytics } from "@/lib/api";

type Props = {
  posts: BlogPost[];
  analytics: PostAnalytics | null;
};

export function InsightRail({ posts, analytics }: Props) {
  const published = analytics?.published_posts ?? posts.filter((post) => post.status === "published").length;

  return (
    <aside className="rail">
      <section className="panel">
        <h3>MVP Scope</h3>
        <p className="muted">GitHub 활동을 선택하고 Claude 형식의 LLM 요약을 거쳐 바로 공유 가능한 개발 포스트로 저장합니다.</p>
      </section>
      <section className="panel">
        <h3>Mock Safe</h3>
        <p className="muted">키가 없어도 Repository, Commit, Diff summary, AI draft, Publish 흐름이 동작합니다.</p>
      </section>
      <section className="panel">
        <h3>
          <Sparkles size={16} /> Signal
        </h3>
        <div className="metricGrid">
          <div className="metric">
            <strong>{posts.length}</strong>
            <span>posts</span>
          </div>
          <div className="metric">
            <strong>{published}</strong>
            <span>live</span>
          </div>
          <div className="metric">
            <strong>{analytics?.total_likes ?? 0}</strong>
            <span>likes</span>
          </div>
          <div className="metric">
            <strong>{analytics?.average_reading_minutes ?? 0}</strong>
            <span>avg min</span>
          </div>
        </div>
      </section>
    </aside>
  );
}
