import express from "express";
import cors from "cors";
import { simpleGit } from "simple-git";
import generate from "./utils.js";
import { getAllFiles } from "./file.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { createClient } from "redis";
import fs from "fs";
import { build } from "./build.js";
import { uploadFile } from "./upload.js"; //R2 upload

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//folders
const REPO_DIR = path.join(process.cwd(), "repos");

//redis
const publisher = createClient();
const subscriber = createClient();

await publisher.connect();
await subscriber.connect();

//express setup
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


//DEPLOY ROUTE
app.post("/deploy", async (req, res) => {
    const repoUrl = req.body.repoUrl;

    if (!repoUrl || typeof repoUrl !== "string") {
        return res.status(400).json({ error: "repoUrl is required" });
    }

    const id = generate();
    const repoPath = path.join(REPO_DIR, id);

    try {
        console.log("Cloning repo...");
        await simpleGit().clone(repoUrl, repoPath);

        console.log("Building project...");
        await build(id); // must build inside repos/<id>

        const buildFolder = getBuildFolder(repoPath);
        console.log("Build folder:", buildFolder);

        const files = getAllFiles(buildFolder);

        console.log("Uploading files to R2...");

        for (const file of files) {
            const relativePath = file.slice(buildFolder.length + 1);
            const key = `${id}/${relativePath}`;

            await uploadFile(key, file);
        }

        //update redis
        await publisher.hSet("status", id, "uploaded");
        await publisher.lPush("build-queue", id);

        //return deployment URL
        const url = `https://<your-bucket>.r2.dev/${id}/index.html`;

        res.json({
            id,
            url
        });

    } catch (error) {
        console.error(error);

        await publisher.hSet("status", id, "failed");

        res.status(500).json({
            error: (error as Error).message
        });
    }
});


//STATUS ROUTE
app.get("/status", async (req, res) => {
    const id = req.query.id as string;

    if (!id) {
        return res.status(400).json({ error: "id query parameter is required" });
    }

    const status = await subscriber.hGet("status", id);

    res.json({ status });
});


//START SERVER
app.listen(3000, () => {
    console.log("Server running on port 3000");
});