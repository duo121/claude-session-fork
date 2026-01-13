---
sidebar_position: 3
---

# Usage

## Basic Usage

Run in any directory with Claude Code sessions:

```bash
csfork
```

This opens the session browser. Select a session, then select a message to fork from.

## Workflow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Session List   │ ──► │  Message List   │ ──► │  New Terminal   │
│  (select one)   │     │  (select fork   │     │  (forked        │
│                 │     │   point)        │     │   session)      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │
        │ Esc                   │ Esc
        ▼                       ▼
      Exit                Back to Sessions
```

## Session List Controls

| Key | Action |
|-----|--------|
| `↑` `↓` | Navigate through sessions |
| `Enter` | Select session |
| `Esc` | Exit |

## Message List Controls

| Key | Action |
|-----|--------|
| `↑` `↓` | Navigate through messages |
| `+` `-` | Expand/collapse message preview (1-10 lines) |
| `Space` | Toggle user-only message filter |
| `Enter` | Fork at selected message |
| `Esc` | Back to session list |

## Interface

### Session List

```
Sessions (1/5)
Select a session to fork from

❯ Help me build a REST API...
    2m ago · a1b2c3d4
  Add authentication to the project...
    1h ago · e5f6g7h8
  Fix the login bug...
    2d ago · i9j0k1l2

↑↓ Move · Enter Select · Esc Exit
```

### Message List

```
Fork (3/15) [2行]
Select the point to fork from · Esc to go back

  ↑ 2 more above
   You  ◆ Help me build a REST API
❯  AI   ◆ I'll help you create a REST API with Express...
   You    Add authentication
   AI   ◆ Let's add JWT authentication... (current)
  ↓ 8 more below

↑↓ Move · +/- Lines · Space Filter · Enter Fork · Esc Back
```

### Interface Elements

- **◆ indicator**: Yellow diamond marks messages with code changes
- **(latest)**: Marks the most recent session
- **(current)**: Marks the most recent message
- **Scroll hints**: Shows items above/below visible area

## Command Line Options

```bash
csfork --help              # Show help
csfork --version           # Show version
csfork --session=<id>      # Fork specific session directly
csfork --cwd=/path         # Specify working directory
csfork --terminal=iterm    # Force iTerm2
csfork --terminal=terminal # Force Terminal.app
```
