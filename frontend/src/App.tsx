import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";

import { CommitList } from "./components/CommitList";
import { BranchSelector } from "./components/BranchSelector";
import { RepositorySelector } from "./components/RepositorySelector";
import {
  fetchBranches,
  fetchCommits,
  fetchRepositories,
  type BranchSummary,
  type CommitSummary,
  type RepositorySummary,
} from "./lib/github";

function clearBranchState(
  setBranches: Dispatch<SetStateAction<BranchSummary[]>>,
  setSelectedBranchName: Dispatch<SetStateAction<string | null>>,
  setBranchError: Dispatch<SetStateAction<string | null>>,
  setBranchLoading: Dispatch<SetStateAction<boolean>>,
) {
  setBranches([]);
  setSelectedBranchName(null);
  setBranchError(null);
  setBranchLoading(false);
}

function clearCommitState(
  setCommits: Dispatch<SetStateAction<CommitSummary[]>>,
  setSelectedCommitShas: Dispatch<SetStateAction<string[]>>,
  setCommitError: Dispatch<SetStateAction<string | null>>,
  setCommitLoading: Dispatch<SetStateAction<boolean>>,
) {
  setCommits([]);
  setSelectedCommitShas([]);
  setCommitError(null);
  setCommitLoading(false);
}

function App() {
  const [repositories, setRepositories] = useState<RepositorySummary[]>([]);
  const [selectedRepositoryId, setSelectedRepositoryId] = useState<number | null>(
    null,
  );
  const [branches, setBranches] = useState<BranchSummary[]>([]);
  const [selectedBranchName, setSelectedBranchName] = useState<string | null>(
    null,
  );
  const [commits, setCommits] = useState<CommitSummary[]>([]);
  const [selectedCommitShas, setSelectedCommitShas] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [branchLoading, setBranchLoading] = useState(false);
  const [commitLoading, setCommitLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [branchError, setBranchError] = useState<string | null>(null);
  const [commitError, setCommitError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    void fetchRepositories(controller.signal)
      .then((items) => {
        if (controller.signal.aborted) {
          return;
        }

        setRepositories(items);
        const nextRepository = items[0] ?? null;

        setSelectedRepositoryId(nextRepository?.id ?? null);
        clearCommitState(
          setCommits,
          setSelectedCommitShas,
          setCommitError,
          setCommitLoading,
        );

        if (nextRepository !== null) {
          clearBranchState(
            setBranches,
            setSelectedBranchName,
            setBranchError,
            setBranchLoading,
          );
          setBranchLoading(true);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setError("Failed to load repositories.");
          setRepositories([]);
          setSelectedRepositoryId(null);
          clearBranchState(
            setBranches,
            setSelectedBranchName,
            setBranchError,
            setBranchLoading,
          );
          clearCommitState(
            setCommits,
            setSelectedCommitShas,
            setCommitError,
            setCommitLoading,
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, []);

  const selectedRepository = useMemo(
    () =>
      repositories.find((repository) => repository.id === selectedRepositoryId) ??
      null,
    [repositories, selectedRepositoryId],
  );

  const selectedBranch = useMemo(
    () =>
      branches.find((branch) => branch.name === selectedBranchName) ?? null,
    [branches, selectedBranchName],
  );

  function toggleCommit(commit: CommitSummary) {
    setSelectedCommitShas((currentSelection) =>
      currentSelection.includes(commit.sha)
        ? currentSelection.filter((sha) => sha !== commit.sha)
        : [...currentSelection, commit.sha],
    );
  }

  useEffect(() => {
    if (selectedRepository === null || !branchLoading) {
      return;
    }

    const controller = new AbortController();

    void fetchBranches(
      selectedRepository.owner,
      selectedRepository.name,
      controller.signal,
    )
      .then((items) => {
        if (controller.signal.aborted) {
          return;
        }

        setBranches(items);
        setBranchError(null);
        setSelectedBranchName((currentSelection) => {
          const nextBranchName = items.some(
            (branch) => branch.name === selectedRepository.defaultBranch,
          )
            ? selectedRepository.defaultBranch
            : items[0]?.name ?? null;

          if (
            currentSelection !== null &&
            items.some((item) => item.name === currentSelection)
          ) {
            return currentSelection;
          }

          return nextBranchName;
        });
        clearCommitState(
          setCommits,
          setSelectedCommitShas,
          setCommitError,
          setCommitLoading,
        );
        setCommitLoading(items.length > 0);
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setBranchError("Failed to load branches.");
          setBranches([]);
          setSelectedBranchName(null);
          clearCommitState(
            setCommits,
            setSelectedCommitShas,
            setCommitError,
            setCommitLoading,
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setBranchLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [branchLoading, selectedRepository]);

  useEffect(() => {
    if (
      selectedRepository === null ||
      selectedBranchName === null ||
      !commitLoading
    ) {
      return;
    }

    const controller = new AbortController();

    void fetchCommits(
      selectedRepository.owner,
      selectedRepository.name,
      selectedBranchName,
      controller.signal,
    )
      .then((items) => {
        if (controller.signal.aborted) {
          return;
        }

        setCommits(items);
        setCommitError(null);
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setCommitError("Failed to load commits.");
          setCommits([]);
          setSelectedCommitShas([]);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setCommitLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [commitLoading, selectedBranchName, selectedRepository]);

  return (
    <main className="min-h-screen bg-background text-primary">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-6 md:px-6 md:py-8">
        <header className="rounded-lg border border-default bg-surface px-6 py-5 text-left shadow-elevated">
          <p className="text-sm font-medium uppercase tracking-wide text-muted">
            Commit to Blog
          </p>
          <h1 className="mt-2 text-2xl font-semibold">
            Select a repository to start a blog draft
          </h1>
          <p className="mt-3 max-w-3xl text-sm text-secondary">
            Choose the GitHub repository that contains the work you want to turn
            into a development blog post. Branch and commit selection comes next.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]">
          <RepositorySelector
            repositories={repositories}
            selectedRepositoryId={selectedRepositoryId}
            loading={loading}
            error={error}
            onSelect={(repository) => {
              setSelectedRepositoryId(repository.id);
              clearBranchState(
                setBranches,
                setSelectedBranchName,
                setBranchError,
                setBranchLoading,
              );
              clearCommitState(
                setCommits,
                setSelectedCommitShas,
                setCommitError,
                setCommitLoading,
              );
              setBranchLoading(true);
            }}
            onRetry={() => {
              setLoading(true);
              setError(null);

              void fetchRepositories()
                .then((items) => {
                  setRepositories(items);
                  const nextRepository = items[0] ?? null;

                  setSelectedRepositoryId(nextRepository?.id ?? null);
                  clearCommitState(
                    setCommits,
                    setSelectedCommitShas,
                    setCommitError,
                    setCommitLoading,
                  );

                  if (nextRepository !== null) {
                    clearBranchState(
                      setBranches,
                      setSelectedBranchName,
                      setBranchError,
                      setBranchLoading,
                    );
                    setBranchLoading(true);
                  } else {
                    clearBranchState(
                      setBranches,
                      setSelectedBranchName,
                      setBranchError,
                      setBranchLoading,
                    );
                  }
                })
                .catch(() => {
                  setError("Failed to load repositories.");
                  setRepositories([]);
                  setSelectedRepositoryId(null);
                  clearBranchState(
                    setBranches,
                    setSelectedBranchName,
                    setBranchError,
                    setBranchLoading,
                  );
                  clearCommitState(
                    setCommits,
                    setSelectedCommitShas,
                    setCommitError,
                    setCommitLoading,
                  );
                })
                .finally(() => {
                  setLoading(false);
                });
            }}
          />

          <div className="flex flex-col gap-6">
            <aside className="rounded-lg border border-default bg-surface p-6 text-left shadow-elevated">
              <p className="text-sm font-medium uppercase tracking-wide text-muted">
                Current selection
              </p>

              {selectedRepository ? (
                <div className="mt-4 space-y-4">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {selectedRepository.name}
                    </h2>
                    <p className="mt-1 text-sm text-secondary">
                      {selectedRepository.fullName}
                    </p>
                  </div>

                  <dl className="grid gap-3 text-sm">
                    <div className="rounded-lg bg-surface-muted px-4 py-3">
                      <dt className="text-muted">Owner</dt>
                      <dd className="mt-1 text-primary">
                        {selectedRepository.owner}
                      </dd>
                    </div>
                    <div className="rounded-lg bg-surface-muted px-4 py-3">
                      <dt className="text-muted">Default branch</dt>
                      <dd className="mt-1 text-primary">
                        {selectedRepository.defaultBranch}
                      </dd>
                    </div>
                    <div className="rounded-lg bg-surface-muted px-4 py-3">
                      <dt className="text-muted">Visibility</dt>
                      <dd className="mt-1 text-primary">
                        {selectedRepository.private ? "Private" : "Public"}
                      </dd>
                    </div>
                    <div className="rounded-lg bg-surface-muted px-4 py-3">
                      <dt className="text-muted">Selected branch</dt>
                      <dd className="mt-1 text-primary">
                        {selectedBranch?.name ?? "None"}
                      </dd>
                    </div>
                    <div className="rounded-lg bg-surface-muted px-4 py-3">
                      <dt className="text-muted">Selected commits</dt>
                      <dd className="mt-1 text-primary">
                        {selectedCommitShas.length}
                      </dd>
                    </div>
                  </dl>

                  <a
                    href={selectedRepository.htmlUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-md bg-action-secondary px-3 py-2 text-sm font-medium text-action-secondary-text hover:bg-action-secondary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                  >
                    Open on GitHub
                  </a>
                </div>
              ) : (
                <p className="mt-4 text-sm text-secondary">
                  Select a repository to see its details here.
                </p>
              )}

              <div className="mt-6 rounded-lg border border-border-muted bg-surface-muted px-4 py-3 text-sm text-secondary">
                Branch and commit selection will unlock after a repository is chosen.
              </div>
            </aside>

            <BranchSelector
              repository={selectedRepository}
              branches={branches}
              selectedBranchName={selectedBranchName}
              loading={branchLoading}
              error={branchError}
              disabled={selectedRepository === null}
              onSelect={(branch) => {
                setSelectedBranchName(branch.name);
                clearCommitState(
                  setCommits,
                  setSelectedCommitShas,
                  setCommitError,
                  setCommitLoading,
                );
                setCommitLoading(true);
              }}
              onRetry={() => {
                if (selectedRepository === null) {
                  return;
                }

                setBranchLoading(true);
                setBranchError(null);
                clearCommitState(
                  setCommits,
                  setSelectedCommitShas,
                  setCommitError,
                  setCommitLoading,
                );
              }}
            />

            <CommitList
              repository={selectedRepository}
              branchName={selectedBranchName}
              commits={commits}
              selectedCommitShas={selectedCommitShas}
              loading={commitLoading}
              error={commitError}
              disabled={selectedRepository === null || selectedBranchName === null}
              onToggle={toggleCommit}
              onRetry={() => {
                if (selectedRepository === null || selectedBranchName === null) {
                  return;
                }

                setCommitLoading(true);
                setCommitError(null);
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
