---
sidebar_position: 3
---

# Usage

## Quick Start

```bash
# In Claude Code, fork current session
sfork

# Or show session list to choose
sfork --list
```

## Commands

All three commands are equivalent:

```bash
sfork                    # Short (recommended)
csfork                   # Alternative
claude-session-fork      # Full name
```

## Modes

### Default Mode (Current Session)

```bash
sfork
```

Automatically detects and uses the current session (most recently modified). Best for use inside Claude Code.

### List Mode

```bash
sfork --list
sfork -l
```

Shows all sessions for the current directory. Select one to fork.

### Specific Session

```bash
sfork --session=<session-id>
```

Fork a specific session by ID.

## Workflow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Session List   │ ──► │  Message List   │ ──► │  New Terminal   │
│  (--list mode)  │     │  (select fork   │     │  (forked        │
│                 │     │   point)        │     │   session)      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │
        │ Esc                   │ Esc
        ▼                       ▼
      Exit                Back to Sessions
```

## Controls

### Session List

| Key | Action |
|-----|--------|
| `↑↓` | Navigate |
| `Enter` | Select |
| `Esc` | Exit |

### Message List

| Key | Action |
|-----|--------|
| `↑↓` | Navigate |
| `+/-` | Expand/collapse preview (1-10 lines) |
| `Space` | Toggle user-only filter |
| `Enter` | Fork |
| `Esc` | Back / Exit |

## Terminal Options

```bash
sfork --terminal=auto      # Auto-detect (default)
sfork --terminal=iterm     # iTerm2
sfork --terminal=terminal  # Terminal.app
sfork --terminal=vscode    # VS Code (copies command)
sfork --terminal=cursor    # Cursor (copies command)
sfork --terminal=kiro      # Kiro (copies command)
```

For VS Code/Cursor/Kiro, the command is copied to clipboard. Paste it in the integrated terminal.

## All Options

```bash
sfork                      # Fork current session
sfork --list, -l           # Show session list
sfork --session=<id>       # Fork specific session
sfork --cwd=<path>         # Working directory
sfork --terminal=<type>    # Terminal type
sfork --help, -h           # Help
sfork --version, -v        # Version
```
