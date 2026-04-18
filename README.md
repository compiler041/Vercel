# Mini Vercel Clone

This project is a simplified implementation of a deployment platform similar to Vercel. It allows users to provide a Git repository URL, automatically builds the project, and prepares it for deployment.

## Overview

The system follows a basic deployment pipeline:

1. Clone a GitHub repository
2. Install dependencies
3. Build the project
4. Collect build output
5. Upload build files to storage (e.g., AWS S3)

This project focuses on understanding how deployment systems work internally rather than providing a production-ready solution.

---

## Architecture

```
Client → API Server → Deployment Engine
                          ↓
                    Clone Repository
                          ↓
                    Install Dependencies
                          ↓
                    Build Project
                          ↓
                    Collect Build Files
                          ↓
                    Upload to Storage
```

### Directory Structure

```
repos/     # Cloned repositories (temporary workspace)
output/    # (Optional) local build outputs
src/       # Source code
```

* `repos/<id>`: Contains the cloned repository and build process
* `output/<id>`: Can be used for local testing or fallback serving

---

## Features

* Accepts a GitHub repository URL
* Clones repository into a local workspace
* Installs dependencies using npm
* Runs project build script
* Detects build output (`dist/` or `build/`)
* Prepares files for upload to storage
* Supports structured file traversal for deployment

---

## How It Works

### 1. Repository Cloning

The system clones the provided repository into:

```
repos/<deployment-id>
```

### 2. Build Process

Inside the cloned repository:

* `npm install` is executed
* `npm run build` is executed

The build output is generated inside the project directory, typically in:

* `dist/`
* `build/`

### 3. File Collection

All files inside the build directory are recursively collected while preserving their relative paths.

Example:

```
dist/
 ├── index.html
 ├── assets/
 │    ├── main.js
 │    ├── style.css
```

Becomes:

```
index.html
assets/main.js
assets/style.css
```

### 4. Deployment Storage

Each file is uploaded to storage using a structured key:

```
<deployment-id>/index.html
<deployment-id>/assets/main.js
<deployment-id>/assets/style.css
```

---

## Technologies Used

* Node.js
* TypeScript
* child_process (for running build commands)
* File System (fs, path)
* AWS S3 (for storage)

---

## Limitations

* Only supports npm-based projects
* Assumes presence of a `build` script
* Does not support server-side frameworks (e.g., Next.js SSR)
* No containerization or sandboxing
* No authentication or rate limiting

---

## Future Improvements

* Support for multiple package managers (yarn, pnpm)
* Deployment status tracking
* Live logs using WebSockets
* CDN integration for faster delivery
* Custom domain support
* Build sandboxing using containers

---

## Getting Started

1. Clone the repository
2. Install dependencies
3. Run the server
4. Send a deployment request with a GitHub repository URL

---

## Learning Goals

This project helps in understanding:

* How deployment pipelines work
* Running shell commands programmatically
* Managing file systems for builds
* Uploading structured assets to cloud storage
* Backend orchestration and automation

---

## License

This project is for educational purposes.
