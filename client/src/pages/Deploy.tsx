import { useState, useCallback, useRef } from "react";
import { deployRepo, getStatus } from "@/lib/api";
import {
  Loader2,
  Rocket,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Terminal,
} from "lucide-react";

type Status = "idle" | "deploying" | "queued" | "building" | "uploaded" | "failed";

interface DeploymentState {
  id: string;
  url: string | null;
  status: Status;
  error: string | null;
}

function statusBadgeClass(s: Status) {
  if (s === "building") return "border-amber-500/50 text-amber-400";
  if (s === "uploaded") return "border-[#AAFF00]/50 text-[#AAFF00]";
  if (s === "failed") return "border-red-500/50 text-red-400";
  if (s === "queued") return "border-blue-500/50 text-blue-400";
  return "border-[#333] text-[#888]";
}

const POLL_INTERVAL_MS = 2000;

export default function Deploy() {
  const [repoUrl, setRepoUrl] = useState("");
  const [deployment, setDeployment] = useState<DeploymentState | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const startPolling = useCallback(
    (id: string) => {
      stopPolling();

      pollRef.current = setInterval(async () => {
        try {
          const { status } = await getStatus(id);

          const resolved = status === "uploaded" || status === "failed";

          setDeployment((prev) =>
            prev ? { ...prev, status: status ?? "queued" } : prev
          );

          if (resolved) stopPolling();
        } catch {
          // keep polling on transient errors
        }
      }, POLL_INTERVAL_MS);
    },
    [stopPolling]
  );

  const handleDeploy = async () => {
    const url = repoUrl.trim();
    if (!url || isSubmitting) return;

    setIsSubmitting(true);
    stopPolling();

    setDeployment({
      id: "",
      url: null,
      status: "deploying",
      error: null,
    });

    try {
      const res = await deployRepo(url);

      setDeployment({
        id: res.id,
        url: res.url,
        status: "queued",
        error: null,
      });

      setRepoUrl("");
      startPolling(res.id);
    } catch (err) {
      setDeployment({
        id: "",
        url: null,
        status: "failed",
        error: (err as Error).message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleDeploy();
  };

  const isActive =
    deployment?.status === "deploying" ||
    deployment?.status === "queued" ||
    deployment?.status === "building";

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#f0f0f0]">
          Deploy
        </h1>
        <p className="text-[#888] mt-1 text-sm md:text-base">
          Ship your static site. Paste a GitHub repo URL and hit Deploy.
        </p>
      </div>

      {/* Deploy form */}
      <div className="bg-[#111] border border-[#1e1e1e] rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-[#f0f0f0]">New Deployment</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="url"
            placeholder="https://github.com/user/repo"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSubmitting}
            className="flex-1 font-mono text-sm bg-[#0a0a0a] border border-[#2a2a2a] text-[#f0f0f0] placeholder-[#444] rounded-lg px-4 py-2.5 outline-none focus:border-[#AAFF00]/50 transition-colors disabled:opacity-50"
          />
          <button
            onClick={handleDeploy}
            disabled={!repoUrl.trim() || isSubmitting}
            className="flex items-center justify-center gap-2 bg-[#AAFF00] hover:bg-[#88cc00] disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold px-6 py-2.5 rounded-lg transition-colors sm:min-w-[130px]"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Rocket className="w-4 h-4" />
                Deploy
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-[#555]">
          Supports any public React / Vite / Next.js repo with a{" "}
          <code className="bg-[#1e1e1e] px-1 rounded text-[#888]">build</code>{" "}
          script producing a{" "}
          <code className="bg-[#1e1e1e] px-1 rounded text-[#888]">dist/</code>{" "}
          or{" "}
          <code className="bg-[#1e1e1e] px-1 rounded text-[#888]">build/</code>{" "}
          folder.
        </p>
      </div>

      {/* Status card */}
      {deployment && (
        <div
          className={`bg-[#111] border rounded-xl overflow-hidden transition-colors ${
            deployment.status === "failed"
              ? "border-red-500/30"
              : deployment.status === "uploaded"
              ? "border-[#AAFF00]/25"
              : "border-[#1e1e1e]"
          }`}
        >
          {/* Progress bar while active */}
          {isActive && (
            <div className="h-0.5 bg-amber-500/20 overflow-hidden">
              <div className="h-full w-1/3 bg-amber-500 animate-progress-bar" />
            </div>
          )}

          <div className="p-5 space-y-4">
            {/* ID + badge row */}
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-xs text-[#555] mb-1">Deployment ID</div>
                <div className="font-mono text-sm text-[#f0f0f0]">
                  {deployment.id || "—"}
                </div>
              </div>

              <span
                className={`inline-flex items-center gap-1.5 border text-xs py-1 px-3 rounded-full capitalize font-medium ${statusBadgeClass(
                  deployment.status
                )}`}
              >
                {isActive && (
                  <Loader2 className="w-3 h-3 animate-spin" />
                )}
                {deployment.status === "uploaded" && (
                  <CheckCircle2 className="w-3 h-3" />
                )}
                {deployment.status === "failed" && (
                  <AlertCircle className="w-3 h-3" />
                )}
                {deployment.status}
              </span>
            </div>

            {/* Success: live URL */}
            {deployment.status === "uploaded" && deployment.url && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 rounded-lg bg-[#AAFF00]/10 border border-[#AAFF00]/20">
                <CheckCircle2 className="w-4 h-4 text-[#AAFF00] shrink-0 hidden sm:block" />
                <span className="font-mono text-[#AAFF00] text-xs break-all flex-1">
                  {deployment.url}
                </span>
                <a
                  href={deployment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 border border-[#AAFF00]/50 text-[#AAFF00] hover:bg-[#AAFF00] hover:text-black text-xs px-3 py-1.5 rounded-md transition-colors shrink-0"
                >
                  <ExternalLink className="w-3 h-3" />
                  Visit Site
                </a>
              </div>
            )}

            {/* Failed: error message */}
            {deployment.status === "failed" && deployment.error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2 bg-red-500/5 border-b border-red-500/10">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span className="text-sm font-semibold text-red-400">Build failed</span>
                </div>
                <pre className="px-4 py-3 text-xs text-red-400/80 font-mono whitespace-pre-wrap break-all">
                  {deployment.error}
                </pre>
              </div>
            )}

            {/* Build log hint */}
            {(deployment.status === "building" || deployment.status === "queued") && (
              <div className="flex items-center gap-2 text-xs text-[#555]">
                <Terminal className="w-3.5 h-3.5" />
                <span className="animate-pulse">
                  Polling for updates every {POLL_INTERVAL_MS / 1000}s…
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
