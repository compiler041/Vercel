import { useEffect, useState } from "react";
import { Switch, Route, Router as WouterRouter, Link, useLocation } from "wouter";
import { Terminal, Clock, Menu, X } from "lucide-react";
import Landing from "@/pages/Landing";
import Deploy from "@/pages/Deploy";
import History from "@/pages/History";

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [location] = useLocation();
  const [serverOk, setServerOk] = useState<boolean | null>(null);

  // Poll the server health via /status?id=ping — if it responds at all, it's up
  useEffect(() => {
    let alive = true;
    async function check() {
      try {
        const res = await fetch("/status?id=__health__");
        if (alive) setServerOk(res.ok || res.status === 400); // 400 means server is up but id invalid
      } catch {
        if (alive) setServerOk(false);
      }
    }
    check();
    const t = setInterval(check, 10_000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  const links = [
    { href: "/app", label: "Deploy", icon: <Terminal className="w-4 h-4" /> },
    { href: "/app/history", label: "History", icon: <Clock className="w-4 h-4" /> },
  ];

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/60 md:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed left-0 top-0 z-30 h-screen w-64 border-r border-[#1e1e1e] bg-[#111] flex flex-col transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Logo */}
        <div className="p-6 flex items-center justify-between">
          <h1 className="text-xl font-bold text-[#AAFF00] flex items-center gap-2">
            <Terminal className="w-6 h-6" /> Deployify
          </h1>
          <button
            className="md:hidden text-[#555] hover:text-[#f0f0f0]"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-4 space-y-1">
          {links.map((link) => {
            const active = location === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                  active
                    ? "bg-[#AAFF00]/10 text-[#AAFF00]"
                    : "text-[#888] hover:bg-[#1a1a1a] hover:text-[#f0f0f0]"
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer: server status */}
        <div className="p-4 border-t border-[#1e1e1e]">
          <div className="flex items-center gap-2 text-xs text-[#555]">
            <div
              className={`w-2 h-2 rounded-full shrink-0 ${
                serverOk === null
                  ? "bg-[#333] animate-pulse"
                  : serverOk
                  ? "bg-[#AAFF00]"
                  : "bg-red-500"
              }`}
            />
            <span>
              {serverOk === null
                ? "Connecting…"
                : serverOk
                ? "Server operational"
                : "Server unreachable"}
            </span>
          </div>
          <div className="text-xs text-[#333] mt-1 font-mono">localhost:3000</div>
        </div>
      </aside>
    </>
  );
}

// ─── App layout ───────────────────────────────────────────────────────────────

function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f0f0f0] flex">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 md:ml-64 flex flex-col min-w-0">
        {/* Mobile topbar */}
        <header className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-[#1e1e1e] bg-[#111] sticky top-0 z-10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-[#555] hover:text-[#f0f0f0]"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-[#AAFF00] font-bold flex items-center gap-2 text-sm">
            <Terminal className="w-4 h-4" /> Deployify
          </span>
        </header>

        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-3xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}

// ─── Router ───────────────────────────────────────────────────────────────────

function AppRouter() {
  return (
    <Switch>
      <Route path="/" component={Landing} />

      <Route path="/app">
        <Layout>
          <Deploy />
        </Layout>
      </Route>

      <Route path="/app/history">
        <Layout>
          <History />
        </Layout>
      </Route>

      {/* Fallback */}
      <Route>
        <div className="min-h-screen flex items-center justify-center text-center p-8">
          <div>
            <h1 className="text-4xl font-bold text-[#AAFF00] mb-4">404</h1>
            <p className="text-[#888] mb-6">Page not found</p>
            <Link href="/" className="text-[#AAFF00] underline">
              Go home
            </Link>
          </div>
        </div>
      </Route>
    </Switch>
  );
}

export default function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <WouterRouter>
      <AppRouter />
    </WouterRouter>
  );
}
