const { Octokit } = require('@octokit/rest');
let octokit = null;

function getOctokit() {
  if (!octokit) {
    if (!process.env.GITHUB_TOKEN) throw new Error('GITHUB_TOKEN is not set in environment');
    octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  }
  return octokit;
}

async function getUserRepos() {
  const { data } = await getOctokit().rest.repos.listForAuthenticatedUser({ sort: 'updated', per_page: 50 });
  return data.map(r => ({ id: r.id, name: r.name, fullName: r.full_name, description: r.description || '', defaultBranch: r.default_branch, private: r.private }));
}

async function getBranches(owner, repo) {
  const { data } = await getOctokit().rest.repos.listBranches({ owner, repo, per_page: 50 });
  return data.map(b => ({ name: b.name, sha: b.commit.sha }));
}

async function getCommits(owner, repo, branch, per_page = 30) {
  const { data } = await getOctokit().rest.repos.listCommits({ owner, repo, sha: branch, per_page });
  return data.map(c => ({ sha: c.sha, message: c.commit.message, author: c.commit.author.name, date: c.commit.author.date }));
}

async function getCommitDetail(owner, repo, sha) {
  const { data } = await getOctokit().rest.repos.getCommit({ owner, repo, ref: sha });
  return {
    sha: data.sha,
    message: data.commit.message,
    author: data.commit.author.name,
    date: data.commit.author.date,
    files: (data.files || []).map(f => ({ filename: f.filename, status: f.status, additions: f.additions, deletions: f.deletions, patch: (f.patch || '').substring(0, 500) })),
  };
}

module.exports = { getUserRepos, getBranches, getCommits, getCommitDetail };
