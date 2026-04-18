import { spawn } from "child_process";
import type { SpawnOptions } from "child_process";

export default function builder(){
const runCommand = (
  command: string,
  args: string[],
  options: SpawnOptions
): Promise<number> => {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      shell: true,
      ...options,
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve(code ?? 0);
      } else {
        reject(
          new Error(
            `Command "${command} ${args.join(" ")}" failed with code ${code}`
          )
        );
      }
    });

    child.on("error", (err) => reject(err));
  });
};

async function build(id: string): Promise<void> {
  const targetDir = `./repos/${id}`;

  try {
    console.log(`--- Starting Install in ${targetDir} ---`);
    await runCommand("npm", ["install"], { cwd: targetDir });
    console.log(" npm install success");

    console.log(`--- Starting Build in ${targetDir} ---`);
    await runCommand("npm", ["run", "build"], { cwd: targetDir });
    console.log(" build successful");
    
  } catch (error) {
    console.error(` Process Failed: ${(error as Error).message}`);
        throw error;
  }
}
}