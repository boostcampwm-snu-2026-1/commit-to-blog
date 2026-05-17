import type { Repo } from "@commit-to-blog/shared";
import { hasGithubToken } from "../../config/env.js";
import { githubGraphQL } from "./client.js";
import { MOCK_REPOS } from "./mockData.js";

type RepoNode = {
  id: string;
  name: string;
  nameWithOwner: string;
  description: string | null;
  updatedAt: string;
  defaultBranchRef: { name: string } | null;
  owner: { login: string; avatarUrl: string };
};

type ViewerReposResponse = {
  viewer: {
    repositories: {
      nodes: RepoNode[];
    };
  };
};

const QUERY = /* GraphQL */ `
  query ViewerRepos($first: Int!) {
    viewer {
      repositories(
        first: $first
        orderBy: { field: UPDATED_AT, direction: DESC }
        ownerAffiliations: [OWNER]
      ) {
        nodes {
          id
          name
          nameWithOwner
          description
          updatedAt
          defaultBranchRef {
            name
          }
          owner {
            login
            avatarUrl
          }
        }
      }
    }
  }
`;

function toRepo(node: RepoNode): Repo {
  return {
    id: node.id,
    fullName: node.nameWithOwner,
    name: node.name,
    owner: {
      login: node.owner.login,
      avatarUrl: node.owner.avatarUrl,
    },
    defaultBranch: node.defaultBranchRef?.name ?? "main",
    description: node.description,
    updatedAt: node.updatedAt,
  };
}

function filterByQuery(repos: Repo[], q?: string): Repo[] {
  if (!q) return repos;
  const needle = q.toLowerCase();
  return repos.filter(
    (r) =>
      r.name.toLowerCase().includes(needle) ||
      r.fullName.toLowerCase().includes(needle),
  );
}

export async function listRepos(q?: string): Promise<Repo[]> {
  if (!hasGithubToken()) {
    return filterByQuery(MOCK_REPOS, q);
  }
  const data = await githubGraphQL()<ViewerReposResponse>(QUERY, { first: 30 });
  const repos = data.viewer.repositories.nodes.map(toRepo);
  return filterByQuery(repos, q);
}
