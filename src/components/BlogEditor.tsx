import type { EditablePost } from "../types/blog";

type BlogEditorProps = {
  post: EditablePost;
  isDraftReady: boolean;
  onChange: (post: EditablePost) => void;
};

export const BlogEditor = ({ post, isDraftReady, onChange }: BlogEditorProps) => (
  <section className="editor-surface">
    <div className="section-header">
      <div>
        <p className="section-kicker">Step 5</p>
        <h2>Draft editor</h2>
      </div>
      <span className={`tag${isDraftReady ? " success" : ""}`}>
        {isDraftReady ? "ready" : "waiting"}
      </span>
    </div>

    {!isDraftReady && (
      <p className="state-text">
        커밋을 선택하고 AI 초안 생성을 실행하면 편집 가능한 제목, 요약, 본문이 여기에 표시됩니다.
      </p>
    )}

    <label className="field">
      <span>제목</span>
      <input
        type="text"
        value={post.title}
        placeholder="블로그 제목"
        onChange={(event) => onChange({ ...post, title: event.target.value })}
      />
    </label>

    <label className="field">
      <span>요약</span>
      <textarea
        value={post.summary}
        placeholder="카드와 미리보기에 사용할 요약"
        rows={3}
        onChange={(event) => onChange({ ...post, summary: event.target.value })}
      />
    </label>

    <label className="field grow">
      <span>본문</span>
      <textarea
        value={post.content}
        placeholder="Markdown 형식의 개발 블로그 초안"
        onChange={(event) => onChange({ ...post, content: event.target.value })}
      />
    </label>
  </section>
);
