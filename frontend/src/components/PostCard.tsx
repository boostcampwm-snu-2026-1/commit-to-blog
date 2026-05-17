import { Link } from 'react-router-dom';
import type { Post } from '../types';

export default function PostCard({ post }: { post: Post }) {
  const date = new Date(post.created_at).toLocaleDateString('ko-KR');
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-mono">{post.branch}</span>
        {post.published && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">발행됨</span>}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{post.title}</h3>
      <p className="text-gray-500 text-sm mb-4 line-clamp-3">{post.summary}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">{date}</span>
        <Link to={`/edit/${post.id}`} className="text-sm text-blue-600 hover:text-blue-800 font-medium">편집 →</Link>
      </div>
    </div>
  );
}
