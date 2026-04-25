import express from "express";
import cors from "cors";
import { simpleGit } from "simple-git";
import generate from "./utils.js";
import { getAllFiles } from "./file.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { createClient } from "redis";
import fs from "fs";
import { build } from "./build.js"; // your build function
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//FIXED STRUCTURE
const REPO_DIR = path.join(process.cwd(), "repos");

const publisher = createClient();
const subscriber = createClient();

await publisher.connect();
await subscriber.connect();

const app = express();
app.use(cors());
app.use(express.json());



//detect build folder
function getBuildFolder(repoPath: string) {
    const distPath = path.join(repoPath, "dist");
    const buildPath = path.join(repoPath, "build");

    if (fs.existsSync(distPath)) return distPath;
    if (fs.existsSync(buildPath)) return buildPath;

    throw new Error("No build folder found");
}

async function uploadFile(key: string, filePath: string) {
    const uploadPath = path.join(REPO_DIR, "uploads", key);
    await fs.promises.mkdir(path.dirname(uploadPath), { recursive: true });
    await fs.promises.copyFile(filePath, uploadPath);
}

app.post("/deploy", async (req, res) => {
    const repoUrl = req.body.repoUrl;

    if (!repoUrl || typeof repoUrl !== "string") {
        res.status(400).json({ error: "repoUrl is required" });
        return;
    }

    const id = generate();
    const repoPath = path.join(REPO_DIR, id);

    try {
        // clone
        await simpleGit().clone(repoUrl, repoPath);

        //  build
        await build(id);

        //detect build output
        const buildFolder = getBuildFolder(repoPath);

        //collect files
        const files = getAllFiles(buildFolder);

        //upload
        for (const file of files) {
            const relativePath = file.slice(buildFolder.length + 1);
            const key = `${id}/${relativePath}`;
            await uploadFile(key, file);
        }

        //update status + queue
        await publisher.hSet("status", id, "uploaded");
        await publisher.lPush("build-queue", id);

        res.json({ id });
    } catch (error) {
        console.error(error);
        await publisher.hSet("status", id, "failed");
        res.status(500).json({ error: (error as Error).message });
    }
});

app.get("/status", async (req, res) => {
    const id = req.query.id as string;

    if (!id) {
        res.status(400).json({ error: "id query parameter is required" });
        return;
    }

    const response = await subscriber.hGet("status", id);
    res.json({ status: response });
});

app.listen(3000, () => console.log("Server running on port 3000"));