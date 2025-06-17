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

  const shouldIgnore = (filePath: string): boolean => {
    return ignore.some((pattern) => filePath.includes(pattern));
  };

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

    fs.watch(filePath, () => {
      log(`🔄 File changed: ${filePath}`);
      debounce(runCommand);
    });

    log(`👀 Watching file: ${filePath}`);
  };

  const traverseDirectory = (currentPath: string) => {
    if (shouldIgnore(currentPath)) {
      log(`🚫 Ignoring path: ${currentPath}`);
      return;
    }

    try {
      const items = fs.readdirSync(currentPath);

      items.forEach((item) => {
        const fullPath = path.join(currentPath, item);
        const stats = fs.statSync(fullPath);

        if (stats.isDirectory()) {
          traverseDirectory(fullPath);
        } else if (stats.isFile()) {
          const ext = path.extname(fullPath).slice(1);

          if (extensions.includes(ext)) {
            watchFile(fullPath);
          }
        }
      });
    } catch (err) {
      log(`❌ Error reading directory: ${currentPath}\n${(err as Error).message}`);
    }
  };

  const absoluteDir = path.resolve(dir);
  log(`📁 Starting to watch directory: ${absoluteDir}`);
  traverseDirectory(absoluteDir);
}