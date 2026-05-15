import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { api } from "../api/client";
import type { PostRecord } from "../api/types";
import { MarkdownPreview } from "../components/MarkdownPreview";
import { ModePill } from "../components/ModePill";
import { StatusBadge } from "../components/StatusBadge";

function formatDate(value: string | null) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export function PostEditorPage() {
  const { postId = "" } = useParams();
  const [post, setPost] = useState<PostRecord | null>(null);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setIsLoading(true);

    void api
      .getPost(postId)
      .then((nextPost) => {
        if (!active) {
          return;
        }

        setPost(nextPost);
        setTitle(nextPost.title);
        setSummary(nextPost.summary);
        setContent(nextPost.content);
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
  }, [postId]);

  async function handleSave() {
    if (!post) {
      return;
    }

    setIsSaving(true);
    setError(null);
    setNotice(null);

    try {
      const updatedPost = await api.updatePost(post.id, { title, summary, content });
      setPost(updatedPost);
      setTitle(updatedPost.title);
      setSummary(updatedPost.summary);
      setContent(updatedPost.content);
      setNotice("초안을 저장했습니다.");
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "저장 중 오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handlePublish() {
    if (!post) {
      return;
    }

    setIsPublishing(true);
    setError(null);
    setNotice(null);

    try {
      const savedPost = await api.updatePost(post.id, { title, summary, content });
      const publishedPost = await api.publishPost(savedPost.id);
      setPost(publishedPost);
      setNotice("포스트를 발행 상태로 저장했습니다.");
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "발행 처리 중 오류가 발생했습니다.");
    } finally {
      setIsPublishing(false);
    }
  }

  if (isLoading) {
    return (
      <section className="page-stack">
        <article className="surface panel">
          <p className="placeholder-text">포스트를 불러오는 중입니다.</p>
        </article>
      </section>
    );
  }

  if (!post) {
    return (
      <section className="page-stack">
        <article className="surface panel">
          <p className="error-message">{error ?? "포스트를 찾을 수 없습니다."}</p>
        </article>
      </section>
    );
  }

  return (
    <section className="page-stack">
      <div className="page-hero surface">
        <p className="eyebrow">Post Editor</p>
        <h2>{post.title}</h2>
        <p>
          생성된 초안을 사용자가 직접 다듬을 수 있도록 제목, 요약, 본문을 모두 편집 가능하게 열어 둡니다.
        </p>
        <div className="hero-meta-row">
          <StatusBadge status={post.status} />
          <ModePill label="Generation" mode={post.generationMode} />
          <span className="muted-chip">{post.branch}</span>
        </div>
      </div>

      <div className="editor-layout">
        <article className="surface panel">
          <header className="panel__header">
            <div>
              <p className="eyebrow">Edit</p>
              <h3>초안 수정</h3>
            </div>
          </header>

          <label className="field">
            <span>제목</span>
            <input value={title} onChange={(event) => setTitle(event.target.value)} />
          </label>

          <label className="field">
            <span>요약</span>
            <textarea
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
              rows={4}
            />
          </label>

          <label className="field">
            <span>본문 (Markdown)</span>
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              rows={18}
              className="editor-textarea"
            />
          </label>

          <div className="button-row">
            <button type="button" className="secondary-button" onClick={handleSave} disabled={isSaving || isPublishing}>
              {isSaving ? "저장 중..." : "Save Draft"}
            </button>
            <button type="button" className="primary-button" onClick={handlePublish} disabled={isSaving || isPublishing}>
              {isPublishing ? "발행 처리 중..." : "Publish"}
            </button>
          </div>

          {notice ? <p className="success-message">{notice}</p> : null}
          {error ? <p className="error-message">{error}</p> : null}
        </article>

        <article className="surface panel">
          <header className="panel__header">
            <div>
              <p className="eyebrow">Preview</p>
              <h3>마크다운 미리보기</h3>
            </div>
          </header>
          <MarkdownPreview content={content} />
        </article>
      </div>

      <article className="surface panel">
        <header className="panel__header">
          <div>
            <p className="eyebrow">Source</p>
            <h3>생성 근거 커밋</h3>
          </div>
        </header>

        <div className="source-commit-list">
          {post.sourceCommits.map((commit) => (
            <a key={commit.sha} href={commit.url} target="_blank" rel="noreferrer" className="source-commit-card">
              <div className="commit-card__topline">
                <span className="commit-card__sha">{commit.sha.slice(0, 7)}</span>
                <span>{formatDate(commit.committedAt)}</span>
              </div>
              <strong>{commit.message}</strong>
              <p>{commit.authorName}</p>
            </a>
          ))}
        </div>

        <div className="meta-grid">
          <div>
            <span className="meta-label">Repository</span>
            <strong>
              {post.repositoryOwner}/{post.repositoryName}
            </strong>
          </div>
          <div>
            <span className="meta-label">Created</span>
            <strong>{formatDate(post.createdAt)}</strong>
          </div>
          <div>
            <span className="meta-label">Updated</span>
            <strong>{formatDate(post.updatedAt)}</strong>
          </div>
          <div>
            <span className="meta-label">Published</span>
            <strong>{formatDate(post.publishedAt)}</strong>
          </div>
        </div>
      </article>
    </section>
  );
}

