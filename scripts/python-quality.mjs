import { access } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const python =
  process.platform === "win32"
    ? join(projectRoot, ".venv", "Scripts", "python.exe")
    : join(projectRoot, ".venv", "bin", "python");

await access(python);

function runPython(args) {
  return new Promise((resolveRun, rejectRun) => {
    const child = spawn(python, args, {
      cwd: projectRoot,
      env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1", PYTHONUTF8: "1" },
      stdio: "inherit",
    });

    child.once("error", rejectRun);
    child.once("exit", (code) => {
      if (code === 0) {
        resolveRun();
        return;
      }
      rejectRun(new Error(`Python exited with code ${code ?? "unknown"}.`));
    });
  });
}

await runPython(["-B", "-m", "unittest", "discover", "-s", "tests", "-p", "test_*.py"]);
await runPython(["-m", "ruff", "check", "."]);
await runPython([
  "-m",
  "ruff",
  "format",
  "--check",
  "app.py",
  "infrastructure/startup_requirements.py",
  "tests/test_startup_requirements.py",
  "tests/test_startup_scripts.py",
]);
