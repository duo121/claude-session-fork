---
sidebar_position: 1
---

# Introduction

**claude-session-fork** lets you fork Claude Code sessions at any conversation point.

## Why?

- **Explore alternatives** - Try different approaches from the same point
- **Undo mistakes** - Go back before an error and try again
- **Parallel development** - Work on multiple features simultaneously
- **Compare solutions** - Implement the same feature differently

## Quick Start

```bash
# Install
npm install -g claude-session-fork

# In Claude Code, run:
sfork
```

## Features

| Feature | Description |
|---------|-------------|
| Auto-detect | Uses current session in Claude Code |
| Session browser | Browse all sessions with `--list` |
| Visual history | See code changes with ◆ indicator |
| Multi-terminal | Terminal.app, iTerm2, VS Code, Cursor, Kiro |

## Commands

```bash
sfork           # Fork current session
sfork --list    # Choose from session list
sfork --help    # Show help
```
