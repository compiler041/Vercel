import { Clock, CheckCircle2, AlertCircle, Loader2, ExternalLink } from "lucide-react";

// Deployments history is maintained in the parent App via context/query
// This page is shown for completeness — in the Vercel server there is no
// list endpoint, so we manage a local session history stored in localStorage.

interface HistoryEntry {
  id: string;
  repoUrl: string;
  status: string;
  url: string | null;
  createdAt: string;
}

function statusIcon(s: string) {
  if (s === "uploaded") return <CheckCircle2 className="w-4 h-4 text-[#AAFF00]" />;
  if (s === "failed") return <AlertCircle className="w-4 h-4 text-red-400" />;
  if (s === "building" || s === "queued")
    return <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />;
  return <Clock className="w-4 h-4 text-[#555]" />;
}

function statusText(s: string) {
  if (s === "uploaded") return "text-[#AAFF00]";
  if (s === "failed") return "text-red-400";
  if (s === "building") return "text-amber-400";
  if (s === "queued") return "text-blue-400";
  return "text-[#888]";
}

export default function History() {
  const raw = localStorage.getItem("deployify_history");
  const entries: HistoryEntry[] = raw ? (JSON.parse(raw) as HistoryEntry[]) : [];

  if (entries.length === 0) {
    return (
      <div className="animate-in space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#f0f0f0]">
            History
          </h1>
          <p className="text-[#888] mt-1 text-sm">Your past deployments this session.</p>
        </div>
        <div className="bg-[#111] border border-dashed border-[#2a2a2a] rounded-xl p-12 text-center text-[#555] text-sm">
          No deployments yet. Head to <span className="text-[#AAFF00]">Deploy</span> to get started.
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#f0f0f0]">
          History
        </h1>
        <p className="text-[#888] mt-1 text-sm">Your past deployments this session.</p>
      </div>

      <div className="space-y-3">
        {[...entries].reverse().map((d) => (
          <div
            key={d.id}
            className={`bg-[#111] border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4 ${
              d.status === "failed" ? "border-red-500/20" : "border-[#1e1e1e]"
            }`}
          >
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                {statusIcon(d.status)}
                <span className={`text-xs font-medium capitalize ${statusText(d.status)}`}>
                  {d.status}
                </span>
                <span className="text-xs text-[#555] font-mono ml-2">{d.id}</span>
              </div>
              <div className="font-mono text-xs text-[#555] truncate">{d.repoUrl}</div>
              <div className="text-xs text-[#444]">
                {new Date(d.createdAt).toLocaleString()}
              </div>
            </div>

            {d.url && (
              <a
                href={d.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 border border-[#AAFF00]/40 text-[#AAFF00] hover:bg-[#AAFF00] hover:text-black text-xs px-3 py-1.5 rounded-md transition-colors shrink-0"
              >
                <ExternalLink className="w-3 h-3" />
                Visit
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
