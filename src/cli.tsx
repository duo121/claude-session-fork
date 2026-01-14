#!/usr/bin/env node
import React, { useState, useEffect } from 'react';
import { render, Box, Text, useApp } from 'ink';
import { 
  findAllSessions,
  parseSession, 
  forkSession, 
  launchClaudeSession,
  openTerminalWithUI,
  getProjectDir,
  type Message,
  type Session
} from './session.js';
import { SessionList, MessageList } from './components.js';

// Parse CLI arguments
const args = process.argv.slice(2);
const isInteractive = args.includes('--interactive');
const sessionArg = args.find(a => a.startsWith('--session='));
const cwdArg = args.find(a => a.startsWith('--cwd='));
const terminalArg = args.find(a => a.startsWith('--terminal='));
const showHelp = args.includes('--help') || args.includes('-h');
const showVersion = args.includes('--version') || args.includes('-v');
const showList = args.includes('--list') || args.includes('-l');

const cwd = cwdArg ? cwdArg.split('=')[1] : process.cwd();
const sessionId = sessionArg ? sessionArg.split('=')[1] : null;
const terminalType = terminalArg ? terminalArg.split('=')[1] : process.env.TERM_PROGRAM;

// Show help
if (showHelp) {
  console.log(`
claude-session-fork (csfork/sfork) - Fork Claude Code sessions

Usage:
  csfork                    Fork current session (latest modified)
  csfork --list             Open session list to choose
  csfork --session=<id>     Fork specific session

Options:
  --session=<id>    Specify session ID
  --list, -l        Show session list to choose from
  --cwd=<path>      Working directory (default: current)
  --terminal=<type> Terminal type: auto, iterm, terminal, vscode, cursor, kiro
  -h, --help        Show this help
  -v, --version     Show version

Controls:
  ↑↓        Navigate
  Enter     Select / Fork
  +/-       Expand/collapse message preview
  Space     Toggle user-only filter
  Esc       Back / Exit

Docs: https://claude-session-fork.vercel.app
`);
  process.exit(0);
}

// Show version
if (showVersion) {
  console.log('1.1.0');
  process.exit(0);
}

// Non-interactive mode: open UI in new terminal
if (!isInteractive) {
  const sessions = findAllSessions(cwd);

  if (sessions.length === 0) {
    console.error('No sessions found for:', cwd);
    process.exit(1);
  }

  console.log(`Found ${sessions.length} session(s)`);

  // --session=<id>: use specific session
  // --list or -l: show session list
  // default: use latest session (current session in Claude Code)
  let targetSession: string;
  if (sessionId) {
    targetSession = sessionId;
    console.log(`Using session: ${sessionId}`);
  } else if (showList) {
    targetSession = '__list__';
    console.log(`Opening session list...`);
  } else {
    // Latest session = current session (most recently modified)
    targetSession = sessions[0].id;
    console.log(`Using current session: ${targetSession.slice(0, 8)}...`);
  }

  console.log(`Opening fork UI...`);
  openTerminalWithUI(cwd, targetSession, terminalType);
  process.exit(0);
}

// Interactive mode
type Step = 'sessions' | 'messages' | 'forking' | 'done' | 'error';

function App() {
  const { exit } = useApp();
  const [step, setStep] = useState<Step>(sessionId && sessionId !== '__list__' ? 'messages' : 'sessions');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Clear screen
    process.stdout.write('\x1Bc');

    const allSessions = findAllSessions(cwd);
    setSessions(allSessions);

    // If session ID provided, go directly to messages
    if (sessionId && sessionId !== '__list__') {
      const projectDir = getProjectDir(cwd);
      const file = `${projectDir}/${sessionId}.jsonl`;
      
      try {
        const msgs = parseSession(file);
        if (msgs.length === 0) {
          setError('No messages found in session');
          setStep('error');
          return;
        }
        setSelectedSession({ id: sessionId, file, mtime: new Date() });
        setMessages(msgs);
        setStep('messages');
      } catch (e) {
        setError(`Failed to parse session: ${e}`);
        setStep('error');
      }
    } else if (allSessions.length === 0) {
      setError('No sessions found for this directory');
      setStep('error');
    }
  }, []);

  const handleSessionSelect = (session: Session) => {
    try {
      const msgs = parseSession(session.file);
      if (msgs.length === 0) {
        setError('No messages found in session');
        setStep('error');
        return;
      }
      setSelectedSession(session);
      setMessages(msgs);
      setStep('messages');
    } catch (e) {
      setError(`Failed to parse session: ${e}`);
      setStep('error');
    }
  };

  const handleMessageSelect = (uuid: string) => {
    if (!selectedSession) return;

    setStep('forking');

    setTimeout(() => {
      try {
        process.stdout.write('\x1Bc');
        
        const newId = forkSession(selectedSession.file, uuid);
        launchClaudeSession(newId, cwd, terminalType);
        
        setStep('done');
        setTimeout(() => {
          exit();
          process.exit(0);
        }, 100);
      } catch (e) {
        setError(`Failed to fork: ${e}`);
        setStep('error');
      }
    }, 100);
  };

  const handleBack = () => {
    // Only allow back if we started from session list
    if (!sessionId || sessionId === '__list__') {
      setStep('sessions');
      setSelectedSession(null);
      setMessages([]);
    }
  };

  const handleExit = () => {
    process.stdout.write('\x1Bc');
    exit();
    process.exit(0);
  };

  if (step === 'error') {
    return (
      <Box paddingX={1} flexDirection="column">
        <Text color="red">Error: {error}</Text>
        <Text dimColor>Press Esc to exit</Text>
      </Box>
    );
  }

  if (step === 'forking') {
    return (
      <Box paddingX={1}>
        <Text color="yellow">Creating fork...</Text>
      </Box>
    );
  }

  if (step === 'done') {
    return (
      <Box paddingX={1}>
        <Text color="green">✓ Fork created, launching Claude...</Text>
      </Box>
    );
  }

  if (step === 'sessions') {
    return (
      <SessionList
        sessions={sessions}
        onSelect={handleSessionSelect}
        onExit={handleExit}
      />
    );
  }

  if (step === 'messages') {
    // Allow back only if we came from session list
    const canGoBack = !sessionId || sessionId === '__list__';
    
    return (
      <MessageList
        messages={messages}
        onSelect={handleMessageSelect}
        onBack={canGoBack ? handleBack : undefined}
        onExit={handleExit}
      />
    );
  }

  return null;
}

render(<App />);
