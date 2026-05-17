# Deployify — Self-hosted Vercel Clone

A self-hosted deployment platform. Paste a GitHub URL → clone → build → serve.

## Project structure

```
Vercel/
├── server/          Express + TypeScript backend (port 3000)
│   └── src/
│       ├── index.ts     Routes: POST /deploy, GET /status, static /deployments
│       ├── build.ts     npm install + npm run build runner
│       ├── upload.ts    Copies build output to uploads/
│       ├── file.ts      Recursive file walker
│       └── utils.ts     Random ID generator
└── client/          React + Vite frontend (port 5173)
    └── src/
        ├── App.tsx        Routing + sidebar layout
        ├── lib/api.ts     Typed fetch wrappers → server API
        └── pages/
            ├── Landing.tsx   Public marketing page
            ├── Deploy.tsx    Deployment form + live status polling
            └── History.tsx   Session deployment history
```

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 18+ |
| npm | any |
| Redis | 7+ (must be running on localhost:6379) |

Start Redis:
```bash
redis-server
# or with Docker:
docker run -d -p 6379:6379 redis:7
```

## Running locally

### 1. Start the server

```bash
cd server
npm install
npm run build        # tsc → dist/
node dist/index.js   # or: npm start
```

Server runs at **http://localhost:3000**

### 2. Start the client

```bash
cd client
npm install
npm run dev
```

Frontend runs at **http://localhost:5173**

Vite proxies `/deploy`, `/status`, `/deployments` → `localhost:3000` automatically.

## API

| Method | Path | Body / Query | Description |
|--------|------|-------------|-------------|
| POST | `/deploy` | `{ repoUrl: string }` | Start a deployment (returns immediately with `id` + final `url`) |
| GET | `/status` | `?id=<id>` | Poll status: `queued` → `building` → `uploaded` \| `failed` |
| GET | `/deployments/:id/index.html` | — | Serves the built static site |

## How it works

1. Client POSTs `repoUrl` → server responds instantly with `{ id, url }`
2. Server runs clone + build in the background, updating Redis status
3. Client polls `GET /status?id=<id>` every 2 seconds
4. When status is `uploaded`, the live URL is shown and polling stops

## Notes

- Only public GitHub repos are supported
- Target repo must have a `build` npm script producing `dist/` or `build/`
- Vite projects should set `base: "./"` in `vite.config.ts` for sub-path serving
