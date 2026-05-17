import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import { closeDb } from '../db/index.js';

const { default: app } = await import('../app.js');

const originalDbPath = process.env.DATABASE_PATH;

beforeEach(() => {
  process.env.DATABASE_PATH = ':memory:';
});

afterEach(() => {
  closeDb();
  if (originalDbPath === undefined) {
    delete process.env.DATABASE_PATH;
  } else {
    process.env.DATABASE_PATH = originalDbPath;
  }
});

describe('POST /api/posts', () => {
  it('returns 400 when body is empty', async () => {
    const res = await request(app).post('/api/posts').send({});

    expect(res.status).toBe(400);
    expect(typeof res.body.error).toBe('string');
    expect(res.body.error.length).toBeGreaterThan(0);
  });

  it('returns 400 when title is missing', async () => {
    const res = await request(app).post('/api/posts').send({
      content: 'hello body',
      branch: 'main',
    });

    expect(res.status).toBe(400);
    expect(typeof res.body.error).toBe('string');
    expect(res.body.error.length).toBeGreaterThan(0);
  });

  it('returns 400 when branch is missing', async () => {
    const res = await request(app).post('/api/posts').send({
      title: 'My title',
      content: 'hello body',
    });

    expect(res.status).toBe(400);
    expect(typeof res.body.error).toBe('string');
    expect(res.body.error.length).toBeGreaterThan(0);
  });

  it("creates a post with default status 'draft' when status is omitted (201)", async () => {
    const res = await request(app).post('/api/posts').send({
      title: 'My title',
      content: '# hello\nbody',
      branch: 'main',
    });

    expect(res.status).toBe(201);
    expect(typeof res.body.id).toBe('number');
    expect(res.body.id).toBeGreaterThan(0);
    expect(res.body.title).toBe('My title');
    expect(res.body.content).toBe('# hello\nbody');
    expect(res.body.branch).toBe('main');
    expect(res.body.status).toBe('draft');
    expect(typeof res.body.created_at).toBe('string');
    expect(res.body.created_at.length).toBeGreaterThan(0);
    expect(typeof res.body.updated_at).toBe('string');
    expect(res.body.updated_at.length).toBeGreaterThan(0);
  });

  it("creates a post with status 'published' when explicitly provided (201)", async () => {
    const res = await request(app).post('/api/posts').send({
      title: 'Published title',
      content: 'shipping it',
      branch: 'feature/x',
      status: 'published',
    });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe('published');
    expect(res.body.title).toBe('Published title');
    expect(res.body.branch).toBe('feature/x');
  });

  it('assigns distinct ids across multiple inserts', async () => {
    const first = await request(app).post('/api/posts').send({
      title: 'A',
      content: 'a',
      branch: 'main',
    });
    const second = await request(app).post('/api/posts').send({
      title: 'B',
      content: 'b',
      branch: 'main',
    });

    expect(first.status).toBe(201);
    expect(second.status).toBe(201);
    expect(typeof first.body.id).toBe('number');
    expect(typeof second.body.id).toBe('number');
    expect(second.body.id).not.toBe(first.body.id);
  });
});
