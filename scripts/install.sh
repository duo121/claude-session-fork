#!/bin/bash

# claude-session-fork installer script
# Usage: curl -fsSL https://raw.githubusercontent.com/duo121/claude-session-fork/main/scripts/install.sh | bash

set -e

echo "Installing claude-session-fork..."

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is required but not installed."
    echo "Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "Error: Node.js 18+ is required. Current version: $(node -v)"
    exit 1
fi

# Check if already installed and uninstall first
if npm list -g claude-session-fork &> /dev/null; then
    echo "Detected existing installation, uninstalling first..."
    npm uninstall -g claude-session-fork
fi

# Install via npm
npm install -g claude-session-fork

echo ""
echo "✅ claude-session-fork installed successfully!"
echo ""
echo "Usage:"
echo "  cd your-project"
echo "  sfork              # Fork current session"
echo "  sfork --list       # Browse all sessions"
echo ""
echo "In Claude Code, use /sfork or !sfork to fork the current session."
echo ""
echo "Docs: https://claude-session-fork.vercel.app"
