---
sidebar_position: 2
---

# Installation

## Requirements

- **macOS** (uses AppleScript for terminal control)
- **Node.js 18+**
- **Claude Code CLI** installed and configured

## Install Methods

### npm (Recommended)

The easiest way to install:

```bash
npm install -g claude-session-fork
```

Verify installation:

```bash
csfork --version
```

### Homebrew (macOS)

```bash
brew tap duo121/claude-session-fork
brew install claude-session-fork
```

### From Source

For development or customization:

```bash
# Clone the repository
git clone https://github.com/duo121/claude-session-fork.git
cd claude-session-fork

# Install dependencies
npm install

# Build
npm run build

# Link globally
npm link
```

### npx (No Install)

Run without installing:

```bash
npx claude-session-fork
```

## Post-Installation

After installation, navigate to any directory where you've used Claude Code:

```bash
cd your-project
csfork
```

The tool will automatically find your session files.

## Troubleshooting

### "No session found"

Make sure you're in a directory where you've previously used Claude Code. Sessions are stored in `~/.claude/projects/`.

### Permission Denied

If you get permission errors with npm global install:

```bash
# Option 1: Fix npm permissions (recommended)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
source ~/.zshrc
npm install -g claude-session-fork
```
