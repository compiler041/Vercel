import { Link } from "wouter";
import { Terminal, Zap, GitBranch, Globe, ArrowRight, CheckCircle } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f0f0f0] flex flex-col overflow-x-hidden">
      {/* NAV */}
      <header className="sticky top-0 z-50 border-b border-[#1a1a1a] bg-[#0a0a0a]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[#AAFF00] font-bold text-lg">
            <Terminal className="w-5 h-5" />
            Deployify
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/app"
              className="text-sm font-semibold bg-[#AAFF00] hover:bg-[#88cc00] text-black px-4 py-1.5 rounded-md transition-colors"
            >
              Launch App
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* HERO */}
        <section className="relative py-24 sm:py-36 px-4 overflow-hidden">
          <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="w-[600px] h-[600px] rounded-full bg-[#AAFF00]/5 blur-[120px]" />
          </div>

          <div className="relative max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-[#AAFF00]/10 border border-[#AAFF00]/20 text-[#AAFF00] text-xs font-mono px-3 py-1 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#AAFF00] animate-pulse" />
              Self-hosted · Open source · No limits
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight tracking-tight mb-6">
              Deploy your frontend{" "}
              <span className="text-[#AAFF00]">in seconds</span>
            </h1>

            <p className="text-lg sm:text-xl text-[#888] max-w-2xl mx-auto mb-10 leading-relaxed">
              Paste a GitHub URL. We clone it, build it, and serve it — instantly.
              A self-hosted Vercel alternative with real-time build status.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/app"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#AAFF00] hover:bg-[#88cc00] text-black font-bold px-8 py-3 rounded-lg transition-colors text-base"
              >
                Start deploying free
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="py-20 px-4 border-t border-[#1a1a1a]">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
              Everything you need to ship fast
            </h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                {
                  icon: <GitBranch className="w-6 h-6 text-[#AAFF00]" />,
                  title: "Git-powered",
                  desc: "Point to any public GitHub repo. We clone and build automatically.",
                },
                {
                  icon: <Zap className="w-6 h-6 text-[#AAFF00]" />,
                  title: "Instant builds",
                  desc: "npm install + npm run build. Build output is served immediately.",
                },
                {
                  icon: <Globe className="w-6 h-6 text-[#AAFF00]" />,
                  title: "Live URLs",
                  desc: "Each deployment gets a unique URL. Share it, visit it, done.",
                },
              ].map((f) => (
                <div key={f.title} className="bg-[#111] border border-[#1e1e1e] rounded-xl p-6">
                  <div className="mb-4">{f.icon}</div>
                  <h3 className="font-semibold text-[#f0f0f0] mb-2">{f.title}</h3>
                  <p className="text-sm text-[#888] leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-20 px-4 border-t border-[#1a1a1a]">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-12">How it works</h2>
            <div className="space-y-6 text-left">
              {[
                { step: "1", text: "Paste your GitHub repo URL into the deploy box" },
                { step: "2", text: "The server clones the repo and runs npm install + build" },
                { step: "3", text: "Build output is copied and served as a static site" },
                { step: "4", text: "You get a live URL — instantly shareable" },
              ].map((s) => (
                <div key={s.step} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#AAFF00]/10 border border-[#AAFF00]/30 text-[#AAFF00] flex items-center justify-center text-sm font-bold shrink-0">
                    {s.step}
                  </div>
                  <p className="text-[#ccc] pt-1">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4 border-t border-[#1a1a1a]">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to deploy?</h2>
            <p className="text-[#888] mb-8">No sign-up required. Just a GitHub URL.</p>
            <div className="flex items-center justify-center gap-3 text-sm text-[#555] mb-8">
              {["React", "Vite", "Next.js", "CRA"].map((t) => (
                <span key={t} className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-[#AAFF00]" /> {t}
                </span>
              ))}
            </div>
            <Link
              href="/app"
              className="inline-flex items-center gap-2 bg-[#AAFF00] hover:bg-[#88cc00] text-black font-bold px-8 py-3 rounded-lg transition-colors"
            >
              Open the app <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#1a1a1a] py-6 px-4 text-center text-xs text-[#555]">
        Deployify — self-hosted Vercel alternative
      </footer>
    </div>
  );
}
