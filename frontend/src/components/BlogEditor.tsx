export default function BlogEditor({ title, body, onTitleChange, onBodyChange }: {
  title: string; body: string; onTitleChange: (t: string) => void; onBodyChange: (b: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
        <input
          type="text"
          value={title}
          onChange={e => onTitleChange(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="블로그 제목을 입력하세요"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">내용 (Markdown)</label>
        <textarea
          value={body}
          onChange={e => onBodyChange(e.target.value)}
          rows={20}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          placeholder="마크다운 형식으로 작성하세요..."
        />
      </div>
    </div>
  );
}
