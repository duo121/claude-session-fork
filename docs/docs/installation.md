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

The easiest way to install sfork:

```bash
npm install -g sfork
```

Verify installation:

```bash
sfork --version
```

### Homebrew (macOS)

```bash
brew tap user/sfork
brew install sfork
```

### From Source

For development or customization:

```bash
# Clone the repository
git clone https://github.com/user/sfork.git
cd sfork

# Install dependencies
npm install

# Link globally
npm link
```

### npx (No Install)

Run without installing:

```bash
npx sfork
```

## Post-Installation

After installation, navigate to any directory where you've used Claude Code:

```bash
cd your-project
sfork
```

The tool will automatically find your session files.

## Troubleshooting

### "No session found"

Make sure you're in a directory where you've previously used Claude Code. Sessions are stored in `~/.claude/projects/`.

### Permission Denied

If you get permission errors with npm global install:

```bash
# Option 1: Use sudo (not recommended)
sudo npm install -g sfork

# Option 2: Fix npm permissions (recommended)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
source ~/.zshrc
npm install -g sfork
```
