function SavedPostCard({ post, onEdit, onPublish }) {
  return (
    <article className="post-card">
      <div className="card-meta">
        <span>{post.branch}</span>
        <time>{post.createdAt}</time>
      </div>
      <h2>{post.title}</h2>
      <div className="image-placeholder" aria-hidden="true" />
      <p>{post.summary}</p>
      <div className="card-actions">
        <button className="secondary-button" onClick={() => onEdit(post)}>
          수정하기
        </button>
        <button className="primary-button" onClick={() => onPublish(post.id)}>
          {post.status === "published" ? "발행완료" : "발행하기"}
        </button>
      </div>
    </article>
  );
}

export default SavedPostCard;
