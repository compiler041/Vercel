import express from "express";
import cors from "cors";
import { simpleGit } from "simple-git";
import generate from "./utils.js";
import { getAllFiles } from "./file.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { createClient } from "redis";

// Fix __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Redis
const publisher = createClient();
const subscriber = createClient();

await publisher.connect();
await subscriber.connect();

const app = express();
app.use(cors());
app.use(express.json());

// Dummy upload (replace later)
async function uploadFile(key: string, filePath: string) {
    console.log("Uploading:", key);
}

app.post("/deploy", async (req, res) => {
    const repoUrl = req.body.repoUrl;
    const id = generate();

    await simpleGit().clone(repoUrl, path.join(__dirname, `output/${id}`));

    const files = getAllFiles(path.join(__dirname, `output/${id}`));

    for (const file of files) {
        await uploadFile(file.slice(__dirname.length + 1), file);
    }

    await new Promise((resolve) => setTimeout(resolve, 5000));

    publisher.lPush("build-queue", id);
    publisher.hSet("status", id, "uploaded");

    res.json({ id });
});

app.get("/status", async (req, res) => {
    const id = req.query.id as string;
    const response = await subscriber.hGet("status", id);

    res.json({ status: response });
});

app.listen(3000);