import { Octokit } from "@octokit/rest";
import { env } from "../config/env.js";
import type {
  Branch,
  Commit,
  CommitDetail,
  CommitFile,
  Repo,
} from "../types/index.js";

const octokit = new Octokit({ auth: env.GITHUB_TOKEN });

const shortSha = (sha: string) => sha.slice(0, 7);

const splitMessage = (raw: string) => {
  const [first, ...rest] = raw.split("\n");
  return {
    message: first ?? "",
    body: rest.join("\n").trim() || undefined,
  };
};

export async function listRepos(): Promise<Repo[]> {
  const { data } = await octokit.repos.listForAuthenticatedUser({
    per_page: 100,
    sort: "updated",
  });

  return data.map((r) => ({
    id: r.id,
    fullName: r.full_name,
    defaultBranch: r.default_branch,
    private: r.private,
    updatedAt: r.updated_at ?? r.pushed_at ?? new Date().toISOString(),
  }));
}

export async function listBranches(
  owner: string,
  repo: string,
): Promise<Branch[]> {
  const { data } = await octokit.repos.listBranches({
    owner,
    repo,
    per_page: 100,
  });

  return data.map((b) => ({ name: b.name, sha: b.commit.sha }));
}

export async function listCommits(
  owner: string,
  repo: string,
  branch: string,
  limit = 30,
): Promise<Commit[]> {
  const { data } = await octokit.repos.listCommits({
    owner,
    repo,
    sha: branch,
    per_page: limit,
  });

  return data.map((c) => {
    const { message, body } = splitMessage(c.commit.message);
    return {
      sha: c.sha,
      shortSha: shortSha(c.sha),
      message,
      body,
      author: {
        name: c.commit.author?.name ?? "unknown",
        login: c.author?.login,
        avatarUrl: c.author?.avatar_url,
      },
      date: c.commit.author?.date ?? new Date().toISOString(),
      url: c.html_url,
    };
  });
}

const MAX_PATCH_CHARS = 4000;

export async function getCommitDetail(
  owner: string,
  repo: string,
  sha: string,
): Promise<CommitDetail> {
  const { data } = await octokit.repos.getCommit({ owner, repo, ref: sha });
  const { message, body } = splitMessage(data.commit.message);

  const files: CommitFile[] = (data.files ?? []).map((f) => ({
    filename: f.filename,
    status: (f.status ?? "modified") as CommitFile["status"],
    additions: f.additions,
    deletions: f.deletions,
    patch: f.patch ? f.patch.slice(0, MAX_PATCH_CHARS) : undefined,
  }));

  return {
    sha: data.sha,
    shortSha: shortSha(data.sha),
    message,
    body,
    author: {
      name: data.commit.author?.name ?? "unknown",
      login: data.author?.login,
      avatarUrl: data.author?.avatar_url,
    },
    date: data.commit.author?.date ?? new Date().toISOString(),
    url: data.html_url,
    stats: {
      additions: data.stats?.additions ?? 0,
      deletions: data.stats?.deletions ?? 0,
      total: data.stats?.total ?? 0,
    },
    files,
  };
}
