---
sidebar_position: 1
---

# Introduction

**sfork** is a CLI tool that lets you fork Claude Code sessions at any conversation point.

## Why sfork?

When working with Claude Code, you often want to:

- **Explore alternatives** - Try different approaches from the same starting point
- **Undo mistakes** - Go back to before an error and try again
- **Parallel development** - Work on multiple features simultaneously
- **Compare solutions** - Implement the same feature differently

sfork makes this easy by letting you select any message in your conversation history and create a new session branch from that point.

## Quick Start

```bash
# Install globally
npm install -g sfork

# Run in any directory with Claude Code sessions
sfork
```

## Features

| Feature | Description |
|---------|-------------|
| Visual History | Browse all messages with timestamps |
| Code Change Indicators | See which messages modified code |
| Flexible Filtering | Show all messages or user-only |
| Terminal Support | Works with Terminal.app and iTerm2 |
