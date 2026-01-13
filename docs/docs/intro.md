---
sidebar_position: 1
---

# Introduction

**claude-session-fork** is a CLI tool that lets you fork Claude Code sessions at any conversation point.

## Why claude-session-fork?

When working with Claude Code, you often want to:

- **Explore alternatives** - Try different approaches from the same starting point
- **Undo mistakes** - Go back to before an error and try again
- **Parallel development** - Work on multiple features simultaneously
- **Compare solutions** - Implement the same feature differently

claude-session-fork makes this easy by letting you browse your sessions and select any message to create a new session branch from that point.

## Quick Start

```bash
# Install globally
npm install -g claude-session-fork

# Run in any directory with Claude Code sessions
csfork
```

## Commands

| Command | Description |
|---------|-------------|
| `csfork` | Recommended short command |
| `sfork` | Even shorter alias |
| `claude-session-fork` | Full command name |

## Features

| Feature | Description |
|---------|-------------|
| Session Browser | Browse all sessions with preview |
| Visual History | Browse all messages with timestamps |
| Code Change Indicators | See which messages modified code |
| Flexible Filtering | Show all messages or user-only |
| Terminal Support | Works with Terminal.app and iTerm2 |
