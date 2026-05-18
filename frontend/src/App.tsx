import { useEffect, useMemo, useState } from "react";

import { BranchSelector } from "./components/BranchSelector";
import { RepositorySelector } from "./components/RepositorySelector";
import {
  fetchBranches,
  fetchRepositories,
  type BranchSummary,
  type RepositorySummary,
} from "./lib/github";

function App() {
  const [repositories, setRepositories] = useState<RepositorySummary[]>([]);
  const [selectedRepositoryId, setSelectedRepositoryId] = useState<number | null>(
    null,
  );
  const [branches, setBranches] = useState<BranchSummary[]>([]);
  const [selectedBranchName, setSelectedBranchName] = useState<string | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [branchLoading, setBranchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [branchError, setBranchError] = useState<string | null>(null);

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

        if (nextRepository !== null) {
          setBranches([]);
          setSelectedBranchName(null);
          setBranchError(null);
          setBranchLoading(true);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setError("Failed to load repositories.");
          setRepositories([]);
          setSelectedRepositoryId(null);
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
        setSelectedBranchName((currentSelection) => {
          if (
            currentSelection !== null &&
            items.some((item) => item.name === currentSelection)
          ) {
            return currentSelection;
          }

          return items.some(
            (branch) => branch.name === selectedRepository.defaultBranch,
          )
            ? selectedRepository.defaultBranch
            : items[0]?.name ?? null;
        });
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setBranchError("Failed to load branches.");
          setBranches([]);
          setSelectedBranchName(null);
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
              setBranches([]);
              setSelectedBranchName(null);
              setBranchError(null);
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

                  if (nextRepository !== null) {
                    setBranches([]);
                    setSelectedBranchName(null);
                    setBranchError(null);
                    setBranchLoading(true);
                  } else {
                    setBranches([]);
                    setSelectedBranchName(null);
                    setBranchError(null);
                    setBranchLoading(false);
                  }
                })
                .catch(() => {
                  setError("Failed to load repositories.");
                  setRepositories([]);
                  setSelectedRepositoryId(null);
                  setBranches([]);
                  setSelectedBranchName(null);
                  setBranchError(null);
                  setBranchLoading(false);
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
              onSelect={(branch) => setSelectedBranchName(branch.name)}
              onRetry={() => {
                if (selectedRepository === null) {
                  return;
                }

                setBranchLoading(true);
                setBranchError(null);
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
