import axios from 'axios';
import type { Repository, Branch, CommitRef } from '../types';

export async function getRepos(): Promise<Repository[]> {
  const { data } = await axios.get('/api/github/repos');
  return data;
}

export async function getBranches(owner: string, repo: string): Promise<Branch[]> {
  const { data } = await axios.get(`/api/github/repos/${owner}/${repo}/branches`);
  return data;
}

export async function getCommits(owner: string, repo: string, branch: string): Promise<CommitRef[]> {
  const { data } = await axios.get(`/api/github/repos/${owner}/${repo}/commits`, { params: { branch } });
  return data;
}
