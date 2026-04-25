import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { readFile } from "node:fs/promises";
import path from "path";

const S3 = new S3Client({
  region: "auto",
  endpoint: `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: "<ACCESS_KEY_ID>",
    secretAccessKey: "<SECRET_ACCESS_KEY>",
  },
});

//content-type helper
function getContentType(filePath: string) {
  const ext = path.extname(filePath);

  switch (ext) {
    case ".html":
      return "text/html";
    case ".js":
      return "application/javascript";
    case ".css":
      return "text/css";
    case ".json":
      return "application/json";
    case ".png":
      return "image/png";
    case ".svg":
      return "image/svg+xml";
    default:
      return "application/octet-stream";
  }
}

export async function uploadFile(key: string, filePath: string) {
  // read actual file
  const fileContent = await readFile(filePath);

  //dynamic content-type
  const contentType = getContentType(filePath);

  //upload to R2
  const response = await S3.send(
    new PutObjectCommand({
      Bucket: "my-bucket",
      Key: key, // VERY IMPORTANT
      Body: fileContent,
      ContentType: contentType,
    })
  );

  console.log(`Uploaded: ${key}`);
}