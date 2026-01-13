---
sidebar_position: 4
---

# How It Works

## Architecture

sfork works by manipulating Claude Code's session files directly.

```
┌─────────────────────────────────────────────────────────────┐
│                    Original Session                          │
├─────────────────────────────────────────────────────────────┤
│  [0] You: "Help me build a REST API"                        │
│  [1] Claude: "I'll help you create a REST API..."           │
│  [2] You: "Add authentication"                              │
│  [3] Claude: "Let's add JWT authentication..."              │
│  [4] You: "Use OAuth instead"          ◄── Fork Point       │
│  [5] Claude: "Switching to OAuth..."                        │
│  [6] You: "Add rate limiting"                               │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼ sfork (select turn 4)
                           │
        ┌──────────────────┴──────────────────┐
        ▼                                      ▼
┌───────────────────┐                ┌───────────────────┐
│  Original Window  │                │   New Terminal    │
│  (continues with  │                │  (forked session) │
│   OAuth + rate    │                │  starts at turn 4 │
│   limiting)       │                │  try different    │
│                   │                │  approach)        │
└───────────────────┘                └───────────────────┘
```

## Technical Details

### Session Discovery

Claude Code stores sessions in:

```
~/.claude/projects/<project-hash>/<session-id>.jsonl
```

The project hash is derived from your working directory path.

### Session Format

Sessions are stored as JSONL (JSON Lines) files:

```json
{"type":"user","uuid":"abc123","message":{"content":"Hello"}}
{"type":"assistant","uuid":"def456","message":{"content":"Hi!"}}
```

### Fork Process

1. **Read** the original session file
2. **Copy** all messages up to and including the fork point
3. **Generate** a new session UUID
4. **Write** the new session file
5. **Launch** a new terminal with `claude --resume <new-session-id>`

### Terminal Integration

sfork uses AppleScript to control terminals:

- **iTerm2**: Creates a new tab in the current window
- **Terminal.app**: Opens a new window

## File Locations

| File | Location |
|------|----------|
| Sessions | `~/.claude/projects/<hash>/*.jsonl` |
| Config | `~/.claude/` |
