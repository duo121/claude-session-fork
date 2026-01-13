import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { spawn, execSync } from 'child_process';

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
  const projectDir = getProjectDir(dir);

  if (!fs.existsSync(projectDir)) {
    return null;
  }

  const files = fs.readdirSync(projectDir)
    .filter(f => f.endsWith('.jsonl') && !f.startsWith('agent-'))
    .map(f => ({
      id: f.replace('.jsonl', ''),
      file: path.join(projectDir, f),
      mtime: fs.statSync(path.join(projectDir, f)).mtime
    }))
    .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());

  return files[0] || null;
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

export function launchClaudeSession(sessionId: string, cwd: string, terminal?: string): void {
  const isIterm = terminal === 'iTerm.app' || 
    (terminal !== 'Terminal.app' && fs.existsSync('/Applications/iTerm.app'));

  const cmd = `cd '${cwd}' && claude --resume '${sessionId}'`;

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
  } else {
    const script = `
      tell application "Terminal"
        activate
        do script "${cmd}"
      end tell
    `;
    execSync(`osascript -e '${script}'`);
  }
}

export function openTerminalWithUI(cwd: string, sessionId: string, terminal?: string): void {
  const sforkPath = process.argv[1];
  const cmd = `node '${sforkPath}' --interactive --session='${sessionId}' --cwd='${cwd}'`;

  const isIterm = terminal === 'iTerm.app' ||
    (terminal !== 'Terminal.app' && fs.existsSync('/Applications/iTerm.app'));

  if (isIterm) {
    const script = `
      tell application "iTerm"
        activate
        tell current window
          create tab with default profile
          tell current session
            write text "cd '${cwd}' && ${cmd}"
          end tell
        end tell
      end tell
    `;
    spawn('osascript', ['-e', script], { detached: true, stdio: 'ignore' }).unref();
  } else {
    const script = `
      tell application "Terminal"
        activate
        tell application "System Events" to keystroke "t" using command down
        delay 0.3
        do script "cd '${cwd}' && ${cmd}" in front window
      end tell
    `;
    spawn('osascript', ['-e', script], { detached: true, stdio: 'ignore' }).unref();
  }
}
