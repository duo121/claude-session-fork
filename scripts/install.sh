#!/bin/bash

# sfork installer script
# Usage: curl -fsSL https://raw.githubusercontent.com/user/sfork/main/scripts/install.sh | bash

set -e

echo "Installing sfork..."

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

# Install via npm
npm install -g sfork

echo ""
echo "✅ sfork installed successfully!"
echo ""
echo "Usage:"
echo "  cd your-project"
echo "  sfork"
echo ""
echo "Docs: https://sfork.vercel.app"
