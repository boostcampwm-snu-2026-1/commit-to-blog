export function SettingsPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-10">
      <h2 className="text-2xl font-bold">Settings</h2>
      <p className="mt-2 text-sm text-slate-500">
        API 키는 클라이언트가 아니라 <code className="rounded bg-slate-100 px-1">apps/server/.env</code>
        에 직접 등록합니다. (보안상 브라우저에서는 입력받지 않습니다.)
      </p>
      <div className="mt-6 space-y-4 rounded-md border border-slate-200 bg-white p-6 text-sm">
        <div>
          <div className="font-semibold">GITHUB_TOKEN</div>
          <div className="text-slate-500">
            Personal Access Token (scope: <code>repo</code>, <code>read:user</code>)
          </div>
        </div>
        <div>
          <div className="font-semibold">OPENAI_API_KEY</div>
          <div className="text-slate-500">OpenAI API Key (sk-...)</div>
        </div>
      </div>
    </section>
  );
}
