"use client";

import { useState } from "react";
import { BlogPost, Draft } from "@/shared/api/client";

type Props = {
  post: BlogPost;
  onCancel: () => void;
  onSave: (draft: Draft) => void;
};

export function EditPost({ post, onCancel, onSave }: Props) {
  const [draft, setDraft] = useState<Draft>({
    title: post.title,
    repository_full_name: post.repository_full_name,
    branch: post.branch,
    summary: post.summary,
    content: post.content,
    hero_emoji: post.hero_emoji,
    author: post.author,
    reading_minutes: post.reading_minutes,
  });

  return (
    <section className="panel editorGrid" aria-label="포스트 수정">
      <div className="composerPreview">
        <span className="emoji">{draft.hero_emoji}</span>
        <strong>{draft.title}</strong>
        <span>{draft.summary}</span>
      </div>
      <div className="field">
        <label htmlFor="edit-title">Title</label>
        <input
          id="edit-title"
          value={draft.title}
          onChange={(event) => setDraft({ ...draft, title: event.target.value })}
        />
      </div>
      <div className="field">
        <label htmlFor="edit-summary">Caption</label>
        <textarea
          id="edit-summary"
          rows={3}
          value={draft.summary}
          onChange={(event) => setDraft({ ...draft, summary: event.target.value })}
        />
      </div>
      <div className="field">
        <label htmlFor="edit-content">Markdown Body</label>
        <textarea
          id="edit-content"
          rows={18}
          value={draft.content}
          onChange={(event) => setDraft({ ...draft, content: event.target.value })}
        />
      </div>
      <div className="actions">
        <button onClick={onCancel}>취소</button>
        <button className="primary" onClick={() => onSave(draft)}>
          저장
        </button>
      </div>
    </section>
  );
}
