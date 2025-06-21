#!/usr/bin/env node

// filewatch_cli/src/bin/index.ts
console.log("Welcome to Filewatch CLI 🚀");

import { Command } from "commander";
import path from "path";
import { startWatcher } from "../watcher"; // Assuming watcher.ts is in the same directory

const program = new Command();

program
  .name("filewatch")
  .description("Watches files and reruns a command when they change")
  .version("1.0.0")
  .option("-d, --dir <path>", "Directory to watch", ".")
  .option("-e, --ext <extensions>", "File extensions to watch (comma-separated)", "js,ts")
  .option("-x, --exec <command>", "Command to execute on change", "")
  .option("-i, --ignore <paths>", "Comma-separated list of ignored paths", "")
  .option("-v, --verbose", "Enable verbose logging", false);

program.parse(process.argv);
const options = program.opts();

startWatcher({
  dir: options.dir,
  extensions: options.ext.split(","),
  exec: options.exec,
  ignore: options.ignore ? options.ignore.split(",") : [],
  verbose: options.verbose,
});

console.log("👀 Watching directory:", options.dir);
console.log("🔁 Command to run:", options.exec);
console.log("🧩 Extensions:", options.ext);
console.log("🚫 Ignored paths:", options.ignore || "None");
console.log("📢 Verbose mode:", options.verbose);
console.log("📂 Directory:", path.resolve(options.dir));