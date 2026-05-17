export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 text-xs text-slate-500">
        <div>
          <div className="font-semibold tracking-wider text-slate-700">
            Smart Blog Automation
          </div>
          <div>© 2024 Smart Blog Automation. Optimized for developers.</div>
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-slate-900">Documentation</a>
          <a href="#" className="hover:text-slate-900">GitHub Support</a>
          <a href="#" className="hover:text-slate-900">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
}
