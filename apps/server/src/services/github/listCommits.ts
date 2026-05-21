import type { Commit } from "@commit-to-blog/shared";
import { hasGithubToken } from "../../config/env.js";
import { githubGraphQL } from "./client.js";
import { mockCommitsFor } from "./mockData.js";

type HistoryNode = {
  oid: string;
  message: string;
  committedDate: string;
  author: {
    name: string | null;
    user: { login: string; avatarUrl: string } | null;
    avatarUrl?: string | null;
  };
};

type CommitsQueryResponse = {
  repository: {
    ref: {
      target: {
        history: { nodes: HistoryNode[] };
      } | null;
    } | null;
  } | null;
};

const QUERY = /* GraphQL */ `
  query Commits(
    $owner: String!
    $name: String!
    $branch: String!
    $first: Int!
  ) {
    repository(owner: $owner, name: $name) {
      ref(qualifiedName: $branch) {
        target {
          ... on Commit {
            history(first: $first) {
              nodes {
                oid
                message
                committedDate
                author {
                  name
                  user {
                    login
                    avatarUrl
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

function takeSubject(message: string): string {
  const firstLine = message.split("\n", 1)[0] ?? message;
  return firstLine.slice(0, 200);
}

export async function listCommits(
  owner: string,
  repo: string,
  branch: string,
  limit = 20,
): Promise<Commit[]> {
  const safeLimit = Math.min(Math.max(limit, 1), 50);

  if (!hasGithubToken()) {
    return mockCommitsFor(`${owner}/${repo}`, branch).slice(0, safeLimit);
  }

  const data = await githubGraphQL()<CommitsQueryResponse>(QUERY, {
    owner,
    name: repo,
    branch: `refs/heads/${branch}`,
    first: safeLimit,
  });

  const nodes = data.repository?.ref?.target?.history.nodes ?? [];

  return nodes.map<Commit>((n) => ({
    sha: n.oid,
    shortSha: n.oid.slice(0, 7),
    message: takeSubject(n.message),
    author: {
      name: n.author.user?.login ?? n.author.name ?? "unknown",
      login: n.author.user?.login ?? null,
      avatarUrl: n.author.user?.avatarUrl ?? null,
    },
    committedAt: n.committedDate,
  }));
}
