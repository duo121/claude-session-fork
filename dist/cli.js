#!/usr/bin/env node
import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { render, Box, Text, useApp } from 'ink';
import { findAllSessions, parseSession, forkSession, launchClaudeSession, openTerminalWithUI, getProjectDir } from './session.js';
import { SessionList, MessageList } from './components.js';
// Parse CLI arguments
const args = process.argv.slice(2);
const isInteractive = args.includes('--interactive');
const sessionArg = args.find(a => a.startsWith('--session='));
const cwdArg = args.find(a => a.startsWith('--cwd='));
const terminalArg = args.find(a => a.startsWith('--terminal='));
const showHelp = args.includes('--help') || args.includes('-h');
const showVersion = args.includes('--version') || args.includes('-v');
const cwd = cwdArg ? cwdArg.split('=')[1] : process.cwd();
const sessionId = sessionArg ? sessionArg.split('=')[1] : null;
const terminalType = terminalArg ? terminalArg.split('=')[1] : process.env.TERM_PROGRAM;
// Show help
if (showHelp) {
    console.log(`
claude-session-fork (csfork/sfork) - Fork Claude Code sessions

Usage:
  csfork                    Open session list, select to fork
  csfork --session=<id>     Fork specific session directly

Options:
  --session=<id>    Specify session ID
  --cwd=<path>      Working directory (default: current)
  --terminal=<type> Terminal type: auto, iterm, terminal
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
    console.log('1.0.0');
    process.exit(0);
}
// Non-interactive mode: open UI in new terminal
if (!isInteractive) {
    const sessions = findAllSessions(cwd);
    if (sessions.length === 0) {
        console.error('No sessions found for:', cwd);
        process.exit(1);
    }
    // If session specified, use it; otherwise show session list
    const targetSession = sessionId || '__list__';
    console.log(`Found ${sessions.length} session(s)`);
    console.log(`Opening fork UI...`);
    openTerminalWithUI(cwd, targetSession, terminalType);
    process.exit(0);
}
function App() {
    const { exit } = useApp();
    const [step, setStep] = useState(sessionId && sessionId !== '__list__' ? 'messages' : 'sessions');
    const [sessions, setSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState(null);
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState('');
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
            }
            catch (e) {
                setError(`Failed to parse session: ${e}`);
                setStep('error');
            }
        }
        else if (allSessions.length === 0) {
            setError('No sessions found for this directory');
            setStep('error');
        }
    }, []);
    const handleSessionSelect = (session) => {
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
        }
        catch (e) {
            setError(`Failed to parse session: ${e}`);
            setStep('error');
        }
    };
    const handleMessageSelect = (uuid) => {
        if (!selectedSession)
            return;
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
            }
            catch (e) {
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
        return (_jsxs(Box, { paddingX: 1, flexDirection: "column", children: [_jsxs(Text, { color: "red", children: ["Error: ", error] }), _jsx(Text, { dimColor: true, children: "Press Esc to exit" })] }));
    }
    if (step === 'forking') {
        return (_jsx(Box, { paddingX: 1, children: _jsx(Text, { color: "yellow", children: "Creating fork..." }) }));
    }
    if (step === 'done') {
        return (_jsx(Box, { paddingX: 1, children: _jsx(Text, { color: "green", children: "\u2713 Fork created, launching Claude..." }) }));
    }
    if (step === 'sessions') {
        return (_jsx(SessionList, { sessions: sessions, onSelect: handleSessionSelect, onExit: handleExit }));
    }
    if (step === 'messages') {
        // Allow back only if we came from session list
        const canGoBack = !sessionId || sessionId === '__list__';
        return (_jsx(MessageList, { messages: messages, onSelect: handleMessageSelect, onBack: canGoBack ? handleBack : undefined, onExit: handleExit }));
    }
    return null;
}
render(_jsx(App, {}));
