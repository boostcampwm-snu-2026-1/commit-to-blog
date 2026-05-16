const DEFAULT_MAX_DIFF_LENGTH = 12_000

export function truncateDiff(diff: string, maxLength = DEFAULT_MAX_DIFF_LENGTH) {
  if (diff.length <= maxLength) {
    return diff
  }

  return `${diff.slice(0, maxLength)}\n\n[Diff truncated for prompt safety]`
}
