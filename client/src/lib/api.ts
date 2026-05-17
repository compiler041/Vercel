/**
 * API client — talks to the Vercel Express backend at port 3000.
 * In dev, Vite proxies /deploy, /status, /deployments → localhost:3000.
 * In production, point VITE_API_BASE to your server URL.
 */

const API_BASE = import.meta.env.VITE_API_BASE ?? "";

export interface DeployResponse {
  id: string;
  url: string;
  error?: string;
}

export interface StatusResponse {
  status: "queued" | "building" | "uploaded" | "failed" | null;
}

// POST /deploy  { repoUrl }
export async function deployRepo(repoUrl: string): Promise<DeployResponse> {
  const res = await fetch(`${API_BASE}/deploy`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ repoUrl }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error ?? "Deployment failed");
  }

  return data as DeployResponse;
}

// GET /status?id=<id>
export async function getStatus(id: string): Promise<StatusResponse> {
  const res = await fetch(`${API_BASE}/status?id=${encodeURIComponent(id)}`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error ?? "Failed to fetch status");
  }

  return data as StatusResponse;
}
