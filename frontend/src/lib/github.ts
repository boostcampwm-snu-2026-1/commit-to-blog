export type RepositorySummary = {
  id: number;
  name: string;
  fullName: string;
  owner: string;
  private: boolean;
  defaultBranch: string;
  htmlUrl: string;
};

type RepositoriesResponse = {
  repositories: RepositorySummary[];
};

export async function fetchRepositories(signal?: AbortSignal) {
  const response = await fetch("/api/github/repos", {
    signal,
  });

  if (!response.ok) {
    throw new Error("Failed to load repositories.");
  }

  const body = (await response.json()) as RepositoriesResponse;

  return body.repositories;
}
