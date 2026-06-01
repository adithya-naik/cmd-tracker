<div align="center">

# 📟 cmd-tracker

### A developer tool that auto-captures, categorizes and saves terminal commands per project for easy revision

[![npm version](https://img.shields.io/npm/v/@adithya-naik/cmd-tracker.svg)](https://www.npmjs.com/package/@adithya-naik/cmd-tracker)
[![npm downloads](https://img.shields.io/npm/dm/@adithya-naik/cmd-tracker.svg)](https://www.npmjs.com/package/@adithya-naik/cmd-tracker)
[![npm total downloads](https://img.shields.io/npm/dt/@adithya-naik/cmd-tracker.svg)](https://www.npmjs.com/package/@adithya-naik/cmd-tracker)
[![GitHub stars](https://img.shields.io/github/stars/adithya-naik/cmd-tracker.svg)](https://github.com/adithya-naik/cmd-tracker/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/adithya-naik/cmd-tracker.svg)](https://github.com/adithya-naik/cmd-tracker/issues)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v14%2B-green.svg)](https://nodejs.org)

</div>

---

## 🎯 What is cmd-tracker?

**cmd-tracker** is an npm package that automatically captures, categorizes and saves every terminal command you type in a project.

Perfect for:
- 🎓 **Students** learning Linux, Git, Docker, Angular etc.
- 👨‍💻 **Developers** who want to track commands used in a project
- 📝 **Anyone** who wants to revise terminal commands they've used

### How it works

```
You work normally in terminal
         ↓
Commands auto-captured in background
         ↓
Saved to .tracker/commands.json in your project
         ↓
Run tracker list → see entire command history
```

---

## 📦 Installation

Install in your learning/project repo:

```bash
npm install @adithya-naik/cmd-tracker
```

---

## 🚀 Quick Start

**Step 1 — Initialize in your repo:**
```bash
npx tracker init
```

**Step 2 — Enable automatic capture:**
```bash
npx tracker hook
source ~/.bashrc  # or source ~/.zshrc on Mac
```

**Step 3 — Work normally! Then revise:**
```bash
npx tracker list
```

That's it! Every command you type is now saved automatically 🪄

---

## 📋 All Commands

| Command | Description |
|---|---|
| `tracker init` | Initialize tracker in your project |
| `tracker hook` | Enable automatic command capture |
| `tracker unhook` | Disable automatic command capture |
| `tracker list` | Show all saved commands |
| `tracker list <category>` | Filter by category |
| `tracker search <query>` | Search through commands |
| `tracker stats` | Show statistics by category |
| `tracker favorite <cmd>` | Toggle command as favorite |
| `tracker favorites` | Show all favorites |
| `tracker export` | Export as JSON |
| `tracker export --csv` | Export as CSV (opens in Excel) |
| `tracker clear` | Clear all commands |
| `tracker clear <category>` | Clear specific category |

---

## 🗂️ Categories

Commands are automatically categorized into:

| Category | Commands |
|---|---|
| 🔀 `git` | git status, git push, git commit... |
| 📦 `npm` | npm install, npx, npm run... |
| 🐳 `docker` | docker ps, docker build... |
| 🐧 `linux` | ls, cd, mkdir, chmod... |
| 🟢 `node` | node, nodemon... |
| 🔴 `angular` | ng new, ng serve, ng generate... |
| 🐍 `python` | python, pip install... |
| 🔷 `go` | go build, go run, go get... |
| ☕ `java` | java, javac, mvn, gradle... |
| 🦀 `rust` | cargo build, cargo run, rustc... |
| 🔷 `dotnet` | dotnet run, dotnet build... |
| ☸️ `kubernetes` | kubectl get pods, helm install... |
| 🗄️ `database` | mysql, psql, mongosh, redis-cli... |
| ☁️ `cloud` | aws s3 ls, gcloud, az login... |
| 📥 `packageManagers` | yarn, pnpm, brew, snap... |
| 🧪 `testing` | jest, vitest, playwright, cypress... |
| 🤖 `ai` | claude, gemini, opencode, aider... |
| 📌 `others` | everything else |

---

## 💡 Usage Examples

**Filter by category:**
```bash
tracker list git      # see all git commands
tracker list linux    # see all linux commands
tracker list npm      # see all npm commands
```

**Search commands:**
```bash
tracker search "install"   # find all install commands
tracker search "git"       # find all git related commands
```

**Save favorites for quick revision:**
```bash
tracker favorite "git rebase -i HEAD~3"
tracker favorites   # see all starred commands
```

**Export for sharing/backup:**
```bash
tracker export          # creates tracker-export.json
tracker export --csv    # creates tracker-export.csv (opens in Excel!)
```

---

## 📁 Project Structure

After running `tracker init`, a `.tracker` folder is created:

```
your-project/
├── .tracker/
│   └── commands.json   ← your personal command history
├── your-files...
└── package.json
```

> ✅ `.tracker/` is automatically added to `.gitignore`
> Your command history stays local — never pushed to GitHub

---

## 🖥️ Platform Support

| Platform | Support |
|---|---|
| Mac (zsh) | ✅ Full support |
| Linux (bash) | ✅ Full support |
| Windows (Git Bash) | ✅ Supported |
| Windows (PowerShell) | ⚠️ Manual save only |

> Windows CMD/PowerShell users: use `tracker save "command"` manually
> or use Git Bash / WSL for automatic capture

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Open an issue for bugs or feature requests
- Submit a pull request

---

## 📄 License

MIT © [Jatoth Adithya Naik](https://github.com/adithya-naik)

---

<div align="center">

⭐ **Star this repo if you find it useful!**

[GitHub](https://github.com/adithya-naik/cmd-tracker) • [npm](https://www.npmjs.com/package/@adithya-naik/cmd-tracker) • [Issues](https://github.com/adithya-naik/cmd-tracker/issues)

</div
