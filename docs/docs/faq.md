---
sidebar_position: 5
---

# FAQ

## General

### Does sfork work on Windows/Linux?

Currently, sfork only supports macOS because it uses AppleScript to control terminal windows. Linux/Windows support is planned for future releases.

### Does forking affect my original session?

No. Forking creates a completely independent copy. Your original session remains unchanged.

### Can I fork from a fork?

Yes! Each forked session is a regular Claude Code session, so you can fork it again.

## Troubleshooting

### "No session found for this directory"

This means Claude Code hasn't been used in this directory yet. Make sure you:

1. Are in the correct directory
2. Have used Claude Code here before
3. Sessions exist in `~/.claude/projects/`

### The new terminal doesn't open

Check that:

1. Terminal.app or iTerm2 is installed
2. You've granted terminal automation permissions in System Preferences > Security & Privacy > Privacy > Automation

### Messages are missing from the list

sfork filters out system messages and some internal Claude Code messages. Only user and assistant messages with meaningful content are shown.

## Usage Tips

### Best Practices

1. **Fork before major decisions** - Create a branch before trying something risky
2. **Use descriptive first messages** - Makes it easier to identify sessions later
3. **Clean up old forks** - Delete unused session files to save space

### Finding Session Files

```bash
# List all sessions for current directory
ls -la ~/.claude/projects/$(pwd | sed 's/^\///' | tr '/' '-')/

# Find sessions by content
grep -l "your search term" ~/.claude/projects/*/*.jsonl
```

## Contributing

Found a bug or have a feature request? Please open an issue on [GitHub](https://github.com/user/sfork/issues).
