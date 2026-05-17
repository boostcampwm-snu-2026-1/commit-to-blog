import { graphql } from "@octokit/graphql";
import { Octokit } from "@octokit/rest";
import { env, hasGithubToken } from "../../config/env.js";

let cachedGraphql: typeof graphql | null = null;
let cachedRest: Octokit | null = null;

export function githubGraphQL(): typeof graphql {
  if (!hasGithubToken()) {
    throw new Error("GITHUB_TOKEN_MISSING");
  }
  if (!cachedGraphql) {
    cachedGraphql = graphql.defaults({
      headers: {
        authorization: `token ${env.GITHUB_TOKEN}`,
      },
    });
  }
  return cachedGraphql;
}

export function githubRest(): Octokit {
  if (!hasGithubToken()) {
    throw new Error("GITHUB_TOKEN_MISSING");
  }
  if (!cachedRest) {
    cachedRest = new Octokit({ auth: env.GITHUB_TOKEN });
  }
  return cachedRest;
}
