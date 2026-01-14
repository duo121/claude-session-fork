# claude-session-fork

[中文文档](./README_CN.md)

Fork Claude Code sessions at any conversation point and continue in a new terminal.

## Quick Start

### Mode 1: Inside Claude Code (type `!sfork`)

While chatting with Claude, just type `!sfork`:

```
> !sfork
```

A new terminal tab opens with the fork UI:

```
Fork (3/8) [1行]
Select the point to fork from

  ↑ 2 more above
   You  ◆ Help me build a REST API with Express
   AI      I'll create a REST API with Express. Let me start by...
❯  You  ◆ Add authentication
   AI   ◆ Adding JWT authentication to your API...
  ↓ 2 more below

↑↓ Move · +/- Lines · Space Filter · Enter Fork · Esc Exit
```

Select a message and press `Enter` → Opens new terminal with forked session

---

### Mode 2: From Terminal (`sfork --list`)

Browse and select from all your Claude Code sessions:

```bash
sfork --list
```

```
Sessions (1/42)
Select a session to fork from

❯ Help me build a REST API with Express...
    2h ago · abc12345
  Fix the login bug in the auth module...
    5h ago · def45678
  Refactor database layer for better perf...
    1d ago · ghi78901
  ↓ 39 more below

↑↓ Move · Enter Select · Esc Exit
```

Press `Enter` → Shows message list → Select fork point → Opens new terminal

---

## Features

- **Fork at any point** - Select any message to create a branch from
- **Session browser** - Browse all sessions with preview
- **Visual history** - Browse conversation with code change indicators (◆)
- **Multi-terminal** - Supports Terminal.app, iTerm2, VS Code, Cursor, Kiro
- **Auto-detect** - Automatically uses current session in Claude Code

## Installation

### npm (Recommended)

```bash
npm install -g claude-session-fork
```

### Homebrew (macOS)

```bash
brew tap duo121/claude-session-fork
brew install claude-session-fork
```

### From source

```bash
git clone https://github.com/duo121/claude-session-fork.git
cd claude-session-fork
npm install && npm run build && npm link
```

## Uninstall

### npm

```bash
npm uninstall -g claude-session-fork
```

### Homebrew

```bash
brew uninstall claude-session-fork
brew untap duo121/claude-session-fork
```

### From source

```bash
npm unlink -g claude-session-fork
```

## Usage

```bash
# Fork current session (auto-detect in Claude Code)
sfork

# Show session list to choose from
sfork --list
sfork -l

# Fork specific session
sfork --session=<session-id>

# Specify terminal
sfork --terminal=iterm
sfork --terminal=vscode
```

**Commands:** `sfork`, `csfork`, `claude-session-fork`

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

### Session List (--list mode)
| Key | Action |
|-----|--------|
| `↑↓` | Navigate sessions |
| `Enter` | Select session |
| `Esc` | Exit |

### Message List
| Key | Action |
|-----|--------|
| `↑↓` | Navigate messages |
| `+/-` | Expand/collapse preview (1-10 lines) |
| `Space` | Toggle user-only filter |
| `Enter` | Fork at selected point |
| `Esc` | Back (list mode) / Exit |

## Command Line Options

```bash
sfork                      # Fork current session
sfork --list, -l           # Show session list
sfork --session=<id>       # Fork specific session
sfork --cwd=<path>         # Specify working directory
sfork --terminal=<type>    # Terminal: auto, iterm, terminal, vscode, cursor, kiro
sfork --help, -h           # Show help
sfork --version, -v        # Show version
```

## How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                    Original Session                          │
├─────────────────────────────────────────────────────────────┤
│  [0] You: "Help me build a REST API"                        │
│  [1] Claude: "I'll help you create a REST API..."           │
│  [2] You: "Add authentication"         ◄── Fork Point       │
│  [3] Claude: "Let's add JWT authentication..."              │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼ sfork (select message 2)
                           │
        ┌──────────────────┴──────────────────┐
        ▼                                      ▼
┌───────────────────┐                ┌───────────────────┐
│  Original Window  │                │   New Terminal    │
│  (continues)      │                │  (forked from     │
│                   │                │   message 2)      │
└───────────────────┘                └───────────────────┘
```

## Requirements

- macOS (uses AppleScript for terminal control)
- Claude Code CLI
- Node.js 18+

## Documentation

https://claude-session-fork.vercel.app

## License

MIT
