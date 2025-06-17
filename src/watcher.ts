import fs from "fs";
import path from "path";
import { spawn } from "child_process";

interface WatcherOptions {
  dir: string;
  extensions: string[];
  exec: string;
  ignore?: string[];
  verbose?: boolean;
}

export function startWatcher(options: WatcherOptions) {
  const { dir, extensions, exec, ignore = [], verbose = false } = options;

  const seenFiles = new Set<string>();
  let debounceTimer: NodeJS.Timeout | null = null;

  const log = (msg: string) => {
    if (verbose) console.log(msg);
  };

  const shouldIgnore = (filePath: string): boolean =>
    ignore.some((pattern) => filePath.includes(pattern));

  const runCommand = () => {
    if (!exec.trim()) return;

    const [command, ...args] = exec.split(" ");
    const proc = spawn(command, args, {
      stdio: "inherit",
      shell: true,
    });

    proc.on("exit", (code) => {
      log(`⚙️  Command exited with code ${code}`);
    });
  };

  const debounce = (fn: () => void, delay: number = 200) => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(fn, delay);
  };

  const watchFile = (filePath: string) => {
    if (seenFiles.has(filePath)) return;
    seenFiles.add(filePath);

    try {
      fs.watch(filePath, () => {
        log(`🔄 File changed: ${filePath}`);
        debounce(runCommand);
      });

      log(`👀 Watching file: ${filePath}`);
    } catch (err) {
      log(`❌ Failed to watch file: ${filePath}\n${(err as Error).message}`);
    }
  };

  const traverseDirectory = (currentPath: string) => {
    if (shouldIgnore(currentPath)) {
      log(`🚫 Ignoring path: ${currentPath}`);
      return;
    }

    let items: string[] = [];
    try {
      items = fs.readdirSync(currentPath);
    } catch (err) {
      log(
        `❌ Failed to read directory: ${currentPath}\n${(err as Error).message}`
      );
      return;
    }

    for (const item of items) {
      const fullPath = path.join(currentPath, item);

      try {
        const stats = fs.statSync(fullPath);

        if (stats.isDirectory()) {
          traverseDirectory(fullPath);
        } else if (stats.isFile()) {
          const ext = path.extname(fullPath).slice(1).toLowerCase();
          if (extensions.includes(ext)) {
            watchFile(fullPath);
          }
        }
      } catch (err) {
        log(`❌ Error accessing: ${fullPath}\n${(err as Error).message}`);
      }
    }
  };

  const absoluteDir = path.resolve(dir);
  log(`📁 Starting to watch directory: ${absoluteDir}`);
  traverseDirectory(absoluteDir);
}