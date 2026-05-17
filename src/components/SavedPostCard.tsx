import type { BlogPost } from "../types/blog";

type SavedPostCardProps = {
  post: BlogPost;
  isActive: boolean;
  onOpen: (post: BlogPost) => void;
  onPublish: (post: BlogPost) => void;
};

const formatDate = (value: string) => new Intl.DateTimeFormat("ko-KR", {
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
}).format(new Date(value));

export const SavedPostCard = ({ post, isActive, onOpen, onPublish }: SavedPostCardProps) => (
  <article className={`saved-post-card${isActive ? " active" : ""}`}>
    <div className="saved-post-card-header">
      <span className={`tag${post.status === "published" ? " success" : ""}`}>
        {post.status}
      </span>
      <span className="post-date">{formatDate(post.updatedAt)}</span>
    </div>

    <h3>{post.title}</h3>
    <p>{post.summary}</p>

    <div className="post-meta">
      <span>{post.repositoryFullName}</span>
      <span>{post.branchName}</span>
    </div>

    <div className="card-actions">
      <button className="secondary-button" type="button" onClick={() => onOpen(post)}>
        다시 편집
      </button>
      <button
        className="secondary-button"
        type="button"
        onClick={() => onPublish(post)}
        disabled={post.status === "published"}
      >
        발행
      </button>
    </div>
  </article>
);
