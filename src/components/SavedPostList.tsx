import { SavedPostCard } from "./SavedPostCard";
import type { BlogPost } from "../types/blog";

type SavedPostListProps = {
  posts: BlogPost[];
  activePostId: string | null;
  isLoading: boolean;
  errorMessage: string | null;
  onOpen: (post: BlogPost) => void;
  onPublish: (post: BlogPost) => void;
  onRefresh: () => void;
};

export const SavedPostList = ({
  posts,
  activePostId,
  isLoading,
  errorMessage,
  onOpen,
  onPublish,
  onRefresh,
}: SavedPostListProps) => (
  <section className="panel saved-posts-panel">
    <div className="section-header">
      <div>
        <p className="section-kicker">Saved</p>
        <h2>Posts</h2>
      </div>
      <button className="icon-button" type="button" onClick={onRefresh} title="저장된 포스트 다시 불러오기">
        R
      </button>
    </div>

    {isLoading && <p className="state-text">저장된 포스트를 불러오는 중입니다.</p>}
    {errorMessage && <p className="error-text">{errorMessage}</p>}
    {!isLoading && !errorMessage && posts.length === 0 && (
      <p className="state-text">저장된 포스트가 없습니다.</p>
    )}

    <div className="saved-post-list">
      {posts.map((post) => (
        <SavedPostCard
          key={post.id}
          post={post}
          isActive={post.id === activePostId}
          onOpen={onOpen}
          onPublish={onPublish}
        />
      ))}
    </div>
  </section>
);
