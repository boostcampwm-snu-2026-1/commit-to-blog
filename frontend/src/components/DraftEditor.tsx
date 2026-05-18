import type { GeneratedDraft } from "../lib/blog";
import type { CommitSummary, RepositorySummary } from "../lib/github";
import type { Post } from "../lib/posts";

type DraftEditorProps = {
  draft: GeneratedDraft | null;
  repository: RepositorySummary | null;
  branchName: string | null;
  selectedCommits: CommitSummary[];
  loading: boolean;
  error: string | null;
  savedDraft: Post | null;
  hasUnsavedChanges: boolean;
  saving: boolean;
  saveError: string | null;
  onGenerate: () => void;
  onDraftChange: (field: keyof GeneratedDraft, value: string) => void;
  onSave: () => void;
};

function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: string;
}) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium text-primary">
      {children}
    </label>
  );
}

export function DraftEditor({
  draft,
  repository,
  branchName,
  selectedCommits,
  loading,
  error,
  savedDraft,
  hasUnsavedChanges,
  saving,
  saveError,
  onGenerate,
  onDraftChange,
  onSave,
}: DraftEditorProps) {
  const canGenerate =
    repository !== null && branchName !== null && selectedCommits.length > 0;
  const canSave =
    draft !== null &&
    draft.title.trim() !== "" &&
    draft.summary.trim() !== "" &&
    draft.content.trim() !== "";

  return (
    <section className="rounded-lg border border-default bg-surface shadow-elevated">
      <div className="flex flex-col gap-4 border-b border-default px-6 py-5 text-left md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-muted">
            Step 4
          </p>
          <h2 className="mt-2 text-xl font-semibold">Edit generated draft</h2>
          <p className="mt-2 text-sm text-secondary">
            Generate a draft from the selected commits, then review the title,
            summary, and content before saving.
          </p>
        </div>

        <button
          type="button"
          disabled={!canGenerate || loading}
          onClick={onGenerate}
          className="inline-flex shrink-0 items-center justify-center rounded-md bg-action-primary px-4 py-2 text-sm font-medium text-action-primary-text hover:bg-action-primary-hover disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
          {loading ? "Generating..." : draft ? "Regenerate draft" : "Generate draft"}
        </button>
      </div>

      <div className="p-6 text-left">
        {!canGenerate ? (
          <p className="text-sm text-secondary">
            Select at least one commit to generate a draft.
          </p>
        ) : loading ? (
          <p
            role="status"
            aria-live="polite"
            className="text-sm text-secondary"
          >
            Generating draft...
          </p>
        ) : error ? (
          <div
            role="alert"
            className="flex items-start justify-between gap-4 rounded-lg border border-status-danger-subtle bg-status-danger-subtle px-4 py-3"
          >
            <p className="text-sm text-status-danger-text">{error}</p>
            <button
              type="button"
              onClick={onGenerate}
              className="rounded-md bg-action-secondary px-3 py-2 text-sm font-medium text-action-secondary-text hover:bg-action-secondary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
              Retry
            </button>
          </div>
        ) : draft ? (
          <form
            className="grid gap-5"
            onSubmit={(event) => event.preventDefault()}
          >
            <div className="grid gap-2">
              <FieldLabel htmlFor="draft-title">Title</FieldLabel>
              <input
                id="draft-title"
                name="title"
                type="text"
                value={draft.title}
                onChange={(event) =>
                  onDraftChange("title", event.currentTarget.value)
                }
                className="min-h-11 rounded-md border border-default bg-surface px-3 py-2 text-sm text-primary shadow-none outline-none transition placeholder:text-muted focus:border-focus focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
              />
            </div>

            <div className="grid gap-2">
              <FieldLabel htmlFor="draft-summary">Summary</FieldLabel>
              <textarea
                id="draft-summary"
                name="summary"
                value={draft.summary}
                onChange={(event) =>
                  onDraftChange("summary", event.currentTarget.value)
                }
                rows={4}
                className="min-h-28 resize-y rounded-md border border-default bg-surface px-3 py-2 text-sm text-primary shadow-none outline-none transition placeholder:text-muted focus:border-focus focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
              />
            </div>

            <div className="grid gap-2">
              <FieldLabel htmlFor="draft-content">Content</FieldLabel>
              <textarea
                id="draft-content"
                name="content"
                value={draft.content}
                onChange={(event) =>
                  onDraftChange("content", event.currentTarget.value)
                }
                rows={14}
                className="min-h-80 resize-y rounded-md border border-default bg-surface px-3 py-2 font-mono text-sm text-primary shadow-none outline-none transition placeholder:text-muted focus:border-focus focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
              />
            </div>

            <div className="flex flex-col gap-3 rounded-lg border border-border-muted bg-surface-muted px-4 py-3 md:flex-row md:items-center md:justify-between">
              <div className="text-sm">
                {saveError ? (
                  <p role="alert" className="text-status-danger-text">
                    {saveError}
                  </p>
                ) : saving ? (
                  <p
                    role="status"
                    aria-live="polite"
                    className="text-secondary"
                  >
                    Saving draft...
                  </p>
                ) : savedDraft && !hasUnsavedChanges ? (
                  <p
                    role="status"
                    aria-live="polite"
                    className="text-status-success-text"
                  >
                    Draft saved.
                  </p>
                ) : savedDraft && hasUnsavedChanges ? (
                  <p className="text-status-warning-text">
                    Draft has unsaved changes.
                  </p>
                ) : (
                  <p className="text-secondary">Draft is not saved yet.</p>
                )}
              </div>

              <button
                type="button"
                disabled={!canSave || saving}
                onClick={onSave}
                className="inline-flex shrink-0 items-center justify-center rounded-md bg-action-primary px-4 py-2 text-sm font-medium text-action-primary-text hover:bg-action-primary-hover disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
              >
                {saving ? "Saving..." : "Save draft"}
              </button>
            </div>
          </form>
        ) : (
          <div className="rounded-lg border border-border-muted bg-surface-muted px-4 py-3 text-sm text-secondary">
            {selectedCommits.length} selected commits are ready for draft
            generation.
          </div>
        )}
      </div>
    </section>
  );
}
