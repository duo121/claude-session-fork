---
sidebar_position: 2
---

# Installation

## Requirements

- **macOS** (uses AppleScript for terminal control)
- **Node.js 18+**
- **Claude Code CLI** installed and configured

## Install

### npm (Recommended)

```bash
npm install -g claude-session-fork
```

Verify installation:

```bash
sfork --version
```

### Homebrew (macOS)

```bash
brew tap duo121/claude-session-fork
brew install claude-session-fork
```

### From Source

```bash
git clone https://github.com/duo121/claude-session-fork.git
cd claude-session-fork
npm install && npm run build && npm link
```

### npx (No Install)

```bash
npx claude-session-fork
```

## Uninstall

### npm

```bash
npm uninstall -g claude-session-fork
```

### Homebrew

```bash
brew uninstall claude-session-fork
brew untap duo121/claude-session-fork
```

### From Source

```bash
cd claude-session-fork
npm unlink -g claude-session-fork
```

## Troubleshooting

### "No session found"

Make sure you're in a directory where you've previously used Claude Code. Sessions are stored in `~/.claude/projects/`.

### Permission Denied

```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
source ~/.zshrc
npm install -g claude-session-fork
```

### Command not found after npm link

```bash
npm link --force
```
