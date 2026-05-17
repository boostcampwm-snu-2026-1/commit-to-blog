import { useEffect, useState } from 'react';
import { api } from './api/client.js';
import './App.css';

function App() {
  const [health, setHealth] = useState({ state: 'loading' });

  useEffect(() => {
    api
      .getHealth()
      .then((data) => setHealth({ state: 'ok', data }))
      .catch((err) => setHealth({ state: 'error', message: err.message }));
  }, []);

  return (
    <main className="app">
      <header className="app-header">
        <h1>Smart Blog</h1>
        <p className="subtitle">
          GitHub 활동을 분석해 개발 블로그 초안을 자동으로 생성합니다.
        </p>
      </header>
      <section className="app-body">
        <h2>서버 연결 상태</h2>
        {health.state === 'loading' && <p>확인 중...</p>}
        {health.state === 'ok' && (
          <pre className="health-ok">{JSON.stringify(health.data, null, 2)}</pre>
        )}
        {health.state === 'error' && (
          <p className="health-error">
            서버에 연결할 수 없습니다: {health.message}
          </p>
        )}
      </section>
    </main>
  );
}

export default App;
