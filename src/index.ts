import express from "express";
import cors from "cors";
import { simpleGit } from "simple-git";
import generate from "./utils.js";
import { getAllFiles } from "./file.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { createClient } from "redis";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const OUTPUT_DIR = path.join(process.cwd(), "src", "output");

const publisher = createClient();
const subscriber = createClient();

await publisher.connect();
await subscriber.connect();

const app = express();
app.use(cors());
app.use(express.json());

async function uploadFile(key: string, filePath: string) {
    console.log("Uploading:", key);
}

app.post("/deploy", async (req, res) => {
    const repoUrl = req.body.repoUrl;

    if (!repoUrl || typeof repoUrl !== "string") {
        res.status(400).json({ error: "repoUrl is required" });
        return;
    }

    const id = generate();

    try {
        await simpleGit().clone(repoUrl, path.join(OUTPUT_DIR, id));

        const files = getAllFiles(path.join(OUTPUT_DIR, id));
        for (const file of files) {
            await uploadFile(file.slice(OUTPUT_DIR.length + 1), file);
        }

        await publisher.hSet("status", id, "uploaded");
        await publisher.lPush("build-queue", id);

        res.json({ id });
    } catch (error) {
        console.error(error);
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