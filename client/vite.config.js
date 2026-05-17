import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // /api/* 요청을 Express 서버(4000)로 프록시.
      // 이렇게 하면 브라우저에서 보면 same-origin이라 CORS 회피 + production-like 경로.
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
});
