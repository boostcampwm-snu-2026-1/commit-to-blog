import React from 'react';
import ReactDOM from 'react-dom/client';

import './styles/globals.css';

function App() {
  return (
    <main className="min-h-screen bg-background text-foreground p-8">
      <h1 className="text-3xl font-bold">Smart Blog - AI Tutor</h1>
      <p className="mt-3 text-muted-foreground">Vite + React + Tailwind + Shadcn base setup</p>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
