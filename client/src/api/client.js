// 모든 서버 호출은 이 래퍼를 거친다.
// baseURL은 "/api"로 시작하므로 vite proxy가 자동으로 Express로 보냄.
const BASE_URL = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`API ${path} failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  getHealth: () => request('/health'),
};
