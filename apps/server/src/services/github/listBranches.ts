import type { Branch } from "@commit-to-blog/shared";
import { hasGithubToken } from "../../config/env.js";
import { githubGraphQL } from "./client.js";
import { mockBranchesFor } from "./mockData.js";

type BranchNode = {
  name: string;
  target: { oid: string } | null;
};

type BranchesQueryResponse = {
  repository: {
    defaultBranchRef: { name: string } | null;
    refs: {
      nodes: BranchNode[];
    };
  } | null;
};

const QUERY = /* GraphQL */ `
  query Branches($owner: String!, $name: String!, $first: Int!) {
    repository(owner: $owner, name: $name) {
      defaultBranchRef {
        name
      }
      refs(
        refPrefix: "refs/heads/"
        first: $first
        orderBy: { field: TAG_COMMIT_DATE, direction: DESC }
      ) {
        nodes {
          name
          target {
            ... on Commit {
              oid
            }
          }
        }
      }
    }
  }
`;

export async function listBranches(
  owner: string,
  repo: string,
): Promise<Branch[]> {
  if (!hasGithubToken()) {
    return mockBranchesFor(`${owner}/${repo}`);
  }

  const data = await githubGraphQL()<BranchesQueryResponse>(QUERY, {
    owner,
    name: repo,
    first: 50,
  });

  if (!data.repository) return [];

  const defaultName = data.repository.defaultBranchRef?.name ?? null;
  return data.repository.refs.nodes
    .filter((n): n is BranchNode & { target: { oid: string } } =>
      Boolean(n.target),
    )
    .map((n) => ({
      name: n.name,
      isDefault: n.name === defaultName,
      headSha: n.target.oid,
    }));
}
