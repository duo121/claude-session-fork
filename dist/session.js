import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { spawn, execSync } from 'child_process';
// Patterns to filter out system messages
const filterPatterns = [
    /^Caveat:/,
    /^<bash-input>/,
    /^<bash-stdout>/,
    /^<bash-stderr>/,
    /^<system-reminder>/,
    /^\[Request interrupted/,
    /^ERROR\s/,
    /^!\s*sfork/,
    /^Last login:/,
];
function getProjectHash(dir) {
    return dir.replace(/^\//g, '-').replace(/\//g, '-');
}
export function getProjectDir(dir = process.cwd()) {
    const projectHash = getProjectHash(dir);
    return path.join(os.homedir(), '.claude', 'projects', projectHash);
}
export function findLatestSession(dir = process.cwd()) {
    const sessions = findAllSessions(dir);
    return sessions[0] || null;
}
export function findAllSessions(dir = process.cwd()) {
    const projectDir = getProjectDir(dir);
    if (!fs.existsSync(projectDir)) {
        return [];
    }
    return fs.readdirSync(projectDir)
        .filter(f => f.endsWith('.jsonl') && !f.startsWith('agent-'))
        .map(f => {
        const filePath = path.join(projectDir, f);
        const id = f.replace('.jsonl', '');
        const stat = fs.statSync(filePath);
        // Get first user message as preview
        let firstMessage = '';
        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            for (const line of content.split('\n')) {
                if (!line)
                    continue;
                try {
                    const data = JSON.parse(line);
                    if (data.type === 'user' && data.message) {
                        const msg = typeof data.message.content === 'string'
                            ? data.message.content
                            : data.message.content?.filter?.((c) => c.type === 'text')?.map?.((c) => c.text)?.join(' ') || '';
                        const cleaned = msg.replace(/^[\s\n\r]+/, '').replace(/\s+/g, ' ').trim();
                        if (cleaned && cleaned !== '[Request interrupted by user]') {
                            firstMessage = cleaned.slice(0, 60);
                            break;
                        }
                    }
                }
                catch { }
            }
        }
        catch { }
        return {
            id,
            file: filePath,
            mtime: stat.mtime,
            firstMessage
        };
    })
        .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
}
export function parseSession(sessionFile) {
    const messagesMap = new Map();
    const codeChangesByUuid = new Set();
    const content = fs.readFileSync(sessionFile, 'utf-8');
    for (const line of content.split('\n')) {
        if (!line)
            continue;
        try {
            const data = JSON.parse(line);
            // Track tool uses for code changes
            if (data.type === 'assistant' && data.message?.content) {
                const hasToolUse = Array.isArray(data.message.content) &&
                    data.message.content.some((c) => c.type === 'tool_use' &&
                        ['Edit', 'Write', 'Bash', 'MultiEdit'].includes(c.name));
                if (hasToolUse && data.uuid) {
                    codeChangesByUuid.add(data.uuid);
                }
            }
            if ((data.type === 'user' || data.type === 'assistant') && data.uuid) {
                let msg = '';
                if (data.message) {
                    msg = typeof data.message.content === 'string'
                        ? data.message.content
                        : data.message.content?.filter?.((c) => c.type === 'text')?.map?.((c) => c.text)?.join(' ') || '';
                }
                // Clean up message
                msg = msg.replace(/^[\s\n\r]+/, '').replace(/\s+/g, ' ').trim();
                // Filter out system messages
                const shouldFilter = filterPatterns.some(pattern => pattern.test(msg));
                if (msg && !shouldFilter && msg !== '[Request interrupted by user]' && msg !== 'No response requested.') {
                    if (!messagesMap.has(data.uuid)) {
                        messagesMap.set(data.uuid, {
                            uuid: data.uuid,
                            type: data.type,
                            content: msg,
                            hasCodeChanges: false
                        });
                    }
                }
            }
        }
        catch { }
    }
    // Mark code changes
    for (const uuid of codeChangesByUuid) {
        const msg = messagesMap.get(uuid);
        if (msg) {
            msg.hasCodeChanges = true;
        }
    }
    return Array.from(messagesMap.values());
}
export function forkSession(sessionFile, forkUuid) {
    const projectDir = path.dirname(sessionFile);
    const newId = crypto.randomUUID();
    const newFile = path.join(projectDir, `${newId}.jsonl`);
    const content = fs.readFileSync(sessionFile, 'utf-8');
    const lines = content.split('\n').filter(Boolean);
    const newLines = [];
    for (const line of lines) {
        try {
            const data = JSON.parse(line);
            if (data.sessionId)
                data.sessionId = newId;
            newLines.push(JSON.stringify(data));
            if (data.uuid === forkUuid)
                break;
        }
        catch {
            newLines.push(line);
        }
    }
    fs.writeFileSync(newFile, newLines.join('\n') + '\n');
    return newId;
}
export function launchClaudeSession(sessionId, cwd, terminal) {
    const cmd = `cd '${cwd}' && claude --resume '${sessionId}'`;
    const terminalLower = terminal?.toLowerCase() || '';
    // VS Code / Cursor / Kiro - use code CLI to open terminal
    if (terminalLower.includes('vscode') || terminalLower === 'code') {
        execSync(`code --folder-uri "file://${cwd}" -r`);
        // VS Code doesn't have a direct way to run command in terminal via CLI
        // Copy command to clipboard and notify user
        execSync(`echo "${cmd}" | pbcopy`);
        console.log('Command copied to clipboard. Paste in VS Code terminal.');
        return;
    }
    if (terminalLower.includes('cursor')) {
        execSync(`cursor --folder-uri "file://${cwd}" -r`);
        execSync(`echo "${cmd}" | pbcopy`);
        console.log('Command copied to clipboard. Paste in Cursor terminal.');
        return;
    }
    if (terminalLower.includes('kiro')) {
        execSync(`kiro "${cwd}"`);
        execSync(`echo "${cmd}" | pbcopy`);
        console.log('Command copied to clipboard. Paste in Kiro terminal.');
        return;
    }
    // iTerm2
    const isIterm = terminalLower === 'iterm' || terminalLower === 'iterm.app' ||
        (terminalLower !== 'terminal' && terminalLower !== 'terminal.app' && fs.existsSync('/Applications/iTerm.app'));
    if (isIterm) {
        const script = `
      tell application "iTerm"
        activate
        create window with default profile
        tell current session of current window
          write text "${cmd}"
        end tell
      end tell
    `;
        execSync(`osascript -e '${script}'`);
    }
    else {
        // Terminal.app
        const script = `
      tell application "Terminal"
        activate
        do script "${cmd}"
      end tell
    `;
        execSync(`osascript -e '${script}'`);
    }
}
export function openTerminalWithUI(cwd, sessionId, terminal) {
    const sforkPath = process.argv[1];
    const cmd = `node '${sforkPath}' --interactive --session='${sessionId}' --cwd='${cwd}'`;
    const fullCmd = `cd '${cwd}' && ${cmd}`;
    const terminalLower = terminal?.toLowerCase() || '';
    // VS Code / Cursor / Kiro - copy command to clipboard
    if (terminalLower.includes('vscode') || terminalLower === 'code' ||
        terminalLower.includes('cursor') || terminalLower.includes('kiro')) {
        execSync(`echo "${fullCmd}" | pbcopy`);
        console.log('Command copied to clipboard. Open a terminal and paste to run.');
        return;
    }
    // iTerm2
    const isIterm = terminalLower === 'iterm' || terminalLower === 'iterm.app' ||
        (terminalLower !== 'terminal' && terminalLower !== 'terminal.app' && fs.existsSync('/Applications/iTerm.app'));
    if (isIterm) {
        const script = `
      tell application "iTerm"
        activate
        tell current window
          create tab with default profile
          tell current session
            write text "${fullCmd}"
          end tell
        end tell
      end tell
    `;
        spawn('osascript', ['-e', script], { detached: true, stdio: 'ignore' }).unref();
    }
    else {
        // Terminal.app
        const script = `
      tell application "Terminal"
        activate
        tell application "System Events" to keystroke "t" using command down
        delay 0.3
        do script "${fullCmd}" in front window
      end tell
    `;
        spawn('osascript', ['-e', script], { detached: true, stdio: 'ignore' }).unref();
    }
}
