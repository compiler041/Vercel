import fs from "fs";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

// local upload function
export async function uploadFile(
  key: string,
  filePath: string
) {

  // final destination path
  const uploadPath = path.join(
    UPLOAD_DIR,
    key
  );

  // create folders recursively
  await fs.promises.mkdir(
    path.dirname(uploadPath),
    { recursive: true }
  );

  // copy built file into uploads folder
  await fs.promises.copyFile(
    filePath,
    uploadPath
  );

  console.log(`Uploaded locally: ${key}`);
}