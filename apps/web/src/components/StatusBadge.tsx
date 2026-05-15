import type { PostStatus } from "../api/types";

interface StatusBadgeProps {
  status: PostStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return <span className={`status-badge status-badge--${status}`}>{status === "draft" ? "Draft" : "Published"}</span>;
}

