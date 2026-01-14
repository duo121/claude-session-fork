import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { spawn, execSync, spawnSync } from 'child_process';

export interface Message {
  uuid: string;
  type: 'user' | 'assistant';
  content: string;
  hasCodeChanges: boolean;
}

export interface Session {
  id: string;
  file: string;
  mtime: Date;
  firstMessage?: string;
}

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

function getProjectHash(dir: string): string {
  return dir.replace(/^\//g, '-').replace(/\//g, '-');
}

export function getProjectDir(dir: string = process.cwd()): string {
  const projectHash = getProjectHash(dir);
  return path.join(os.homedir(), '.claude', 'projects', projectHash);
}

export function findLatestSession(dir: string = process.cwd()): Session | null {
  const sessions = findAllSessions(dir);
  return sessions[0] || null;
}

export function findAllSessions(dir: string = process.cwd()): Session[] {
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
          if (!line) continue;
          try {
            const data = JSON.parse(line);
            if (data.type === 'user' && data.message) {
              const msg = typeof data.message.content === 'string'
                ? data.message.content
                : data.message.content?.filter?.((c: any) => c.type === 'text')?.map?.((c: any) => c.text)?.join(' ') || '';
              const cleaned = msg.replace(/^[\s\n\r]+/, '').replace(/\s+/g, ' ').trim();
              if (cleaned && cleaned !== '[Request interrupted by user]') {
                firstMessage = cleaned.slice(0, 60);
                break;
              }
            }
          } catch {}
        }
      } catch {}

      return {
        id,
        file: filePath,
        mtime: stat.mtime,
        firstMessage
      };
    })
    .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
}

export function parseSession(sessionFile: string): Message[] {
  const messagesMap = new Map<string, Message>();
  const codeChangesByUuid = new Set<string>();
  const content = fs.readFileSync(sessionFile, 'utf-8');

  for (const line of content.split('\n')) {
    if (!line) continue;
    try {
      const data = JSON.parse(line);

      // Track tool uses for code changes
      if (data.type === 'assistant' && data.message?.content) {
        const hasToolUse = Array.isArray(data.message.content) &&
          data.message.content.some((c: any) =>
            c.type === 'tool_use' &&
            ['Edit', 'Write', 'Bash', 'MultiEdit'].includes(c.name)
          );
        if (hasToolUse && data.uuid) {
          codeChangesByUuid.add(data.uuid);
        }
      }

      if ((data.type === 'user' || data.type === 'assistant') && data.uuid) {
        let msg = '';
        if (data.message) {
          msg = typeof data.message.content === 'string'
            ? data.message.content
            : data.message.content?.filter?.((c: any) => c.type === 'text')?.map?.((c: any) => c.text)?.join(' ') || '';
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
    } catch {}
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

export function forkSession(sessionFile: string, forkUuid: string): string {
  const projectDir = path.dirname(sessionFile);
  const newId = crypto.randomUUID();
  const newFile = path.join(projectDir, `${newId}.jsonl`);

  const content = fs.readFileSync(sessionFile, 'utf-8');
  const lines = content.split('\n').filter(Boolean);
  const newLines: string[] = [];

  for (const line of lines) {
    try {
      const data = JSON.parse(line);
      if (data.sessionId) data.sessionId = newId;
      newLines.push(JSON.stringify(data));
      if (data.uuid === forkUuid) break;
    } catch {
      newLines.push(line);
    }
  }

  fs.writeFileSync(newFile, newLines.join('\n') + '\n');
  return newId;
}

export function launchClaudeSession(sessionId: string, cwd: string, _terminal?: string): void {
  // Clear screen
  process.stdout.write('\x1Bc');

  // Change to the working directory
  process.chdir(cwd);

  // Use spawnSync with inherit to properly handle TTY
  const result = spawnSync('claude', ['--resume', sessionId], {
    stdio: 'inherit',
    cwd: cwd,
    shell: true
  });

  process.exit(result.status || 0);
}

export function openTerminalWithUI(cwd: string, sessionId: string, terminal?: string): void {
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

  // Detect current terminal from TERM_PROGRAM environment variable
  const termProgram = process.env.TERM_PROGRAM?.toLowerCase() || '';

  // Use iTerm2 only if:
  // 1. Explicitly requested via --terminal=iterm
  // 2. Currently running in iTerm2 (TERM_PROGRAM=iTerm.app)
  const isIterm = terminalLower === 'iterm' || terminalLower === 'iterm.app' ||
    (terminalLower !== 'terminal' && terminalLower !== 'terminal.app' &&
     termProgram === 'iterm.app');

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
  } else {
    // Terminal.app (default for Apple_Terminal and others)
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
