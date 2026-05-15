import { Octokit } from "octokit";

import { env, integrationMode } from "../../config/env.js";
import type { BranchSummary, CommitDetail, CommitSummary, RepositorySummary } from "../../types.js";
import {
  getDemoCommitDetail,
  listDemoBranches,
  listDemoCommits,
  listDemoRepositories
} from "./github.demo.js";

const octokit = env.GITHUB_TOKEN ? new Octokit({ auth: env.GITHUB_TOKEN }) : null;

function firstLine(text: string) {
  return text.split("\n")[0]?.trim() ?? text.trim();
}

function fallbackBranch(owner: string, repo: string) {
  return listDemoBranches(owner, repo);
}

async function withGithubFallback<T>(liveTask: () => Promise<T>, fallbackTask: () => T | Promise<T>) {
  if (!octokit || integrationMode.github === "demo") {
    return fallbackTask();
  }

  try {
    return await liveTask();
  } catch (error) {
    console.error("GitHub API failed. Falling back to demo mode.", error);
    return fallbackTask();
  }
}

export async function listRepositories(): Promise<RepositorySummary[]> {
  return withGithubFallback(
    async () => {
      const response = await octokit!.rest.repos.listForAuthenticatedUser({
        per_page: 100,
        sort: "updated",
        affiliation: "owner,collaborator,organization_member"
      });

      return response.data.map((repository) => ({
        owner: repository.owner.login,
        name: repository.name,
        fullName: repository.full_name,
        description: repository.description,
        defaultBranch: repository.default_branch,
        updatedAt: repository.updated_at ?? new Date().toISOString(),
        isPrivate: repository.private
      }));
    },
    () => listDemoRepositories()
  );
}

export async function listBranches(owner: string, repo: string): Promise<BranchSummary[]> {
  return withGithubFallback(
    async () => {
      const response = await octokit!.rest.repos.listBranches({
        owner,
        repo,
        per_page: 100
      });

      return response.data.map((branch) => ({
        name: branch.name,
        protected: branch.protected,
        commitSha: branch.commit.sha
      }));
    },
    () => fallbackBranch(owner, repo)
  );
}

export async function listCommits(owner: string, repo: string, branch: string): Promise<CommitSummary[]> {
  return withGithubFallback(
    async () => {
      const response = await octokit!.rest.repos.listCommits({
        owner,
        repo,
        sha: branch,
        per_page: 30
      });

      return response.data.map((commit) => ({
        sha: commit.sha,
        message: firstLine(commit.commit.message),
        authorName: commit.commit.author?.name ?? commit.author?.login ?? "Unknown",
        committedAt: commit.commit.author?.date ?? new Date().toISOString(),
        url: commit.html_url
      }));
    },
    () => listDemoCommits(owner, repo, branch)
  );
}

export async function getCommitDetail(owner: string, repo: string, sha: string): Promise<CommitDetail> {
  return withGithubFallback(
    async () => {
      const response = await octokit!.rest.repos.getCommit({
        owner,
        repo,
        ref: sha
      });

      return {
        sha: response.data.sha,
        message: firstLine(response.data.commit.message),
        body: response.data.commit.message.includes("\n")
          ? response.data.commit.message.split("\n").slice(1).join("\n").trim() || null
          : null,
        authorName: response.data.commit.author?.name ?? response.data.author?.login ?? "Unknown",
        committedAt: response.data.commit.author?.date ?? new Date().toISOString(),
        url: response.data.html_url,
        files: (response.data.files ?? []).map((file) => ({
          filename: file.filename,
          status: file.status ?? "modified",
          additions: file.additions,
          deletions: file.deletions,
          patch: file.patch ?? null
        }))
      };
    },
    () => {
      const detail = getDemoCommitDetail(sha);

      if (!detail) {
        throw new Error(`Commit detail not found for sha: ${sha}`);
      }

      return detail;
    }
  );
}

export function getGithubMode() {
  return integrationMode.github;
}

