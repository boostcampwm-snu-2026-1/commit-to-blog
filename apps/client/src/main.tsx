import React from 'react';
import ReactDOM from 'react-dom/client';

import './styles/globals.css';

type Step = 'select' | 'interview';

function App() {
  const [step, setStep] = React.useState<Step>('select');
  const [selectedRepo, setSelectedRepo] = React.useState('minja/smart-blog');
  const [selectedCommit, setSelectedCommit] = React.useState('a1b2c3d');
  const [answer, setAnswer] = React.useState('');

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-5xl p-8">
        <h1 className="text-3xl font-bold">Smart Blog - AI Tutor</h1>
        <p className="mt-2 text-muted-foreground">Commit 선택 -> AI 인터뷰 목업 연결</p>

        {step === 'select' ? (
          <section className="mt-8 rounded-xl border p-6">
            <h2 className="text-xl font-semibold">1. 저장소/커밋 선택</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium">Repository</span>
                <select
                  className="w-full rounded-md border bg-white px-3 py-2"
                  value={selectedRepo}
                  onChange={(e) => setSelectedRepo(e.target.value)}
                >
                  <option value="minja/smart-blog">minja/smart-blog</option>
                  <option value="minja/commit-to-blog">minja/commit-to-blog</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium">Commit</span>
                <select
                  className="w-full rounded-md border bg-white px-3 py-2"
                  value={selectedCommit}
                  onChange={(e) => setSelectedCommit(e.target.value)}
                >
                  <option value="a1b2c3d">a1b2c3d - feat: interview route scaffold</option>
                  <option value="d4e5f6g">d4e5f6g - chore: ts config setup</option>
                </select>
              </label>
            </div>
            <button
              className="mt-6 rounded-md bg-primary px-4 py-2 text-primary-foreground"
              onClick={() => setStep('interview')}
            >
              인터뷰 시작
            </button>
          </section>
        ) : (
          <section className="mt-8 rounded-xl border p-6">
            <h2 className="text-xl font-semibold">2. AI 튜터 인터뷰 룸</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {selectedRepo} / {selectedCommit}
            </p>

            <div className="mt-4 rounded-md bg-muted p-4">
              <p className="font-medium">Q. 왜 이 커밋에서 이 구현 방식을 선택했나요?</p>
            </div>

            <textarea
              className="mt-4 h-36 w-full rounded-md border bg-white px-3 py-2"
              placeholder="답변을 입력하세요"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />

            <div className="mt-4 grid gap-2 md:grid-cols-4">
              <button className="rounded-md border px-3 py-2">답변 제출</button>
              <button className="rounded-md border px-3 py-2">힌트 보기</button>
              <button className="rounded-md border px-3 py-2">모르겠어요(해설)</button>
              <button className="rounded-md border px-3 py-2">질문 스킵</button>
            </div>

            <button className="mt-4 text-sm underline" onClick={() => setStep('select')}>
              커밋 선택으로 돌아가기
            </button>
          </section>
        )}
      </div>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
