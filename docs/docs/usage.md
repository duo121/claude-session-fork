---
sidebar_position: 3
---

# Usage

## Basic Usage

Run sfork in any directory with Claude Code sessions:

```bash
sfork
```

## Keyboard Controls

| Key | Action |
|-----|--------|
| `↑` `↓` | Navigate through messages |
| `+` `-` | Expand/collapse message preview (1-10 lines) |
| `Space` | Toggle user-only message filter |
| `Enter` | Fork at selected message |
| `Esc` | Exit without forking |

## Interface

```
Fork (3/15) [2行]
Select the point to fork from

  ↑ 2 more above
   You  ◆ Help me build a REST API
❯  AI   ◆ I'll help you create a REST API with Express...
   You    Add authentication
   AI   ◆ Let's add JWT authentication...
  ↓ 8 more below

↑↓ Move · +/- Lines · Space Filter · Enter Fork · Esc Exit
```

### Interface Elements

- **Position indicator**: `(3/15)` shows current position
- **Line count**: `[2行]` shows expanded preview lines
- **◆ indicator**: Yellow diamond marks messages with code changes
- **Scroll hints**: Shows messages above/below visible area

## Options

### Terminal Selection

Force a specific terminal:

```bash
sfork --terminal=terminal  # Use Terminal.app
sfork --terminal=iterm     # Use iTerm2
sfork --terminal=auto      # Auto-detect (default)
```

### Specify Working Directory

```bash
sfork --cwd=/path/to/project
```

## Workflow Example

1. You're working on a feature and want to try a different approach
2. Run `sfork` in your project directory
3. Navigate to the message before you want to diverge
4. Press `Enter` to create the fork
5. A new terminal opens with the forked session
6. Continue with your alternative approach

Both sessions are now independent - you can compare results or continue both paths.
