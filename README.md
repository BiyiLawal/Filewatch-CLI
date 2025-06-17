
````md
# 📁 Filewatch CLI

A lightweight, configurable file-watcher CLI tool — similar to [nodemon] — built with **Node.js**, **TypeScript**, and the native **fs API**. It watches a directory recursively and executes a command when matching files change.

---

## ✨ Features

- 📂 Recursive directory watching
- 🎯 Filter by file extension(s)
- ⚙️ Custom command execution on change
- 🙈 Ignore specific paths or folders
- 🗣️ Verbose mode for detailed logs
- 🧱 Written in TypeScript with clean architecture
- ✅ No external dependencies (core Node.js only)

---

## 🚀 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/filewatch-cli.git
cd filewatch-cli
````

### 2. Install Dependencies

```bash
npm install
```

### 3. Build the CLI

```bash
npm run build
```

### 4. Run the CLI

```bash
node dist/bin/index.js --dir ./src --ext ts --exec "echo File changed" --verbose
```

Or directly via `ts-node` (for development):

```bash
npx ts-node bin/index.ts --dir ./src --ext ts --exec "echo File changed" --verbose
```

---

## 🛠️ CLI Options

| Option      | Description                         | Example                      |
| ----------- | ----------------------------------- | ---------------------------- |
| `--dir`     | Directory to watch                  | `--dir ./src`                |
| `--ext`     | File extension(s) to watch (no dot) | `--ext ts,js,json`           |
| `--exec`    | Command to run on file change       | `--exec "npm run build"`     |
| `--ignore`  | Comma-separated paths to ignore     | `--ignore node_modules,.git` |
| `--verbose` | Enable logging                      | `--verbose`                  |

---

## 📦 NPM Usage (Optional)

To use the CLI globally after building:

1. Add this to `package.json`:

```json
"bin": {
  "filewatch": "./dist/bin/index.js"
}
```

2. Run:

```bash
npm link
```

3. Use anywhere:

```bash
filewatch --dir ./src --ext ts --exec "echo Hello"
```

---

## 📁 Project Structure

```
filewatch-cli/
├── bin/               # CLI entry point
│   └── index.ts
├── src/               # Watcher logic
│   └── watcher.ts
├── dist/              # Compiled output (auto-generated)
├── tsconfig.json
├── package.json
└── README.md
```

---

## 🧠 Learning Goals

This project was built to explore:

* The Node.js `fs.watch()` API
* CLI design and argument parsing
* NPM packaging and global installs
* TypeScript project structuring
* Building tools from scratch

---

## 🔌 Planned Enhancements

* [ ] Support for config files (`.filewatchrc`)
* [ ] Plugin system for custom events
* [ ] File addition/removal detection
* [ ] Fallback to `chokidar` for better cross-platform support

---

## 📄 License

MIT

---

## 💡 Author

**\[Biyi Lawal]** – [@BiyiLawal](https://github.com/BiyiLawal)

---

> Built for learning. Inspired by tools like `nodemon`, `watchman`, and `chokidar`.
