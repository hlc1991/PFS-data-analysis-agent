import { access, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const viteCli = join(projectRoot, "node_modules", "vite", "bin", "vite.js");
const buildDir = await mkdtemp(join(tmpdir(), "pfs-build-check-"));

function runVite(args) {
  return new Promise((resolveRun, rejectRun) => {
    const child = spawn(process.execPath, [viteCli, ...args], {
      cwd: projectRoot,
      stdio: "inherit",
    });

    child.once("error", rejectRun);
    child.once("exit", (code) => {
      if (code === 0) {
        resolveRun();
        return;
      }
      rejectRun(new Error(`Vite exited with code ${code ?? "unknown"}.`));
    });
  });
}

try {
  await runVite(["build", "--outDir", join(buildDir, "dashboard")]);
  await runVite([
    "build",
    "--config",
    "vite.chat-app.config.js",
    "--outDir",
    join(buildDir, "chat"),
  ]);
  await access(join(buildDir, "dashboard", ".vite", "manifest.json"));
  await access(join(buildDir, "chat", "chat-app.js"));
} finally {
  await rm(buildDir, { force: true, recursive: true });
}
