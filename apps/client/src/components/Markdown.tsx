import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  body: string;
  className?: string;
};

export function Markdown({ body, className = "" }: Props) {
  return (
    <div
      className={`prose prose-sm max-w-none prose-slate dark:prose-invert ${className}`}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
    </div>
  );
}
