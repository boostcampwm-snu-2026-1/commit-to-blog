import axios from 'axios';
import type { Post, BlogDraft } from '../types';

export async function getPosts(): Promise<Post[]> {
  const { data } = await axios.get('/api/posts');
  return data;
}

export async function getPost(id: number): Promise<Post> {
  const { data } = await axios.get(`/api/posts/${id}`);
  return data;
}

export async function createPost(post: {
  title: string; body: string; summary: string;
  repo_name: string; branch: string; commits: any[]; tags: string[];
}): Promise<{ id: number }> {
  const { data } = await axios.post('/api/posts', post);
  return data;
}

export async function updatePost(id: number, updates: Partial<Post>): Promise<void> {
  await axios.put(`/api/posts/${id}`, updates);
}

export async function publishPost(id: number): Promise<void> {
  await axios.post(`/api/posts/${id}/publish`);
}

export async function generateBlog(params: {
  repoFullName: string; branch: string; commitShas: string[]; additionalContext?: string;
}): Promise<BlogDraft> {
  const { data } = await axios.post('/api/blog/generate', params);
  return data;
}
