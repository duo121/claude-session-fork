#!/usr/bin/env node
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { render, Box, Text, useApp } from 'ink';
import { findLatestSession, parseSession, forkSession, launchClaudeSession, openTerminalWithUI, getProjectDir } from './session.js';
import { MessageList } from './components.js';
// Parse CLI arguments
const args = process.argv.slice(2);
const isInteractive = args.includes('--interactive');
const sessionArg = args.find(a => a.startsWith('--session='));
const cwdArg = args.find(a => a.startsWith('--cwd='));
const terminalArg = args.find(a => a.startsWith('--terminal='));
const cwd = cwdArg ? cwdArg.split('=')[1] : process.cwd();
const sessionId = sessionArg ? sessionArg.split('=')[1] : null;
const terminalType = terminalArg ? terminalArg.split('=')[1] : process.env.TERM_PROGRAM;
// Non-interactive mode: find session and open UI in new terminal
if (!isInteractive) {
    const session = findLatestSession(cwd);
    if (!session) {
        console.error('No session found for:', cwd);
        process.exit(1);
    }
    console.log(`Session: ${session.id}`);
    console.log(`Opening fork UI...`);
    openTerminalWithUI(cwd, session.id, terminalType);
    process.exit(0);
}
function App() {
    const { exit } = useApp();
    const [step, setStep] = useState('loading');
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState('');
    const [sessionFile, setSessionFile] = useState('');
    useEffect(() => {
        // Clear screen
        process.stdout.write('\x1Bc');
        if (!sessionId) {
            setError('No session ID provided');
            setStep('error');
            return;
        }
        const projectDir = getProjectDir(cwd);
        const file = `${projectDir}/${sessionId}.jsonl`;
        try {
            const msgs = parseSession(file);
            if (msgs.length === 0) {
                setError('No messages found in session');
                setStep('error');
                return;
            }
            setSessionFile(file);
            setMessages(msgs);
            setStep('select');
        }
        catch (e) {
            setError(`Failed to parse session: ${e}`);
            setStep('error');
        }
    }, []);
    const handleSelect = (uuid) => {
        setStep('forking');
        // Use setTimeout to allow UI to update
        setTimeout(() => {
            try {
                // Clear screen
                process.stdout.write('\x1Bc');
                const newId = forkSession(sessionFile, uuid);
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
    const handleExit = () => {
        process.stdout.write('\x1Bc');
        exit();
        process.exit(0);
    };
    if (step === 'loading') {
        return (_jsx(Box, { paddingX: 1, children: _jsx(Text, { dimColor: true, children: "Loading session..." }) }));
    }
    if (step === 'error') {
        return (_jsxs(Box, { paddingX: 1, flexDirection: "column", children: [_jsxs(Text, { color: "red", children: ["Error: ", error] }), _jsx(Text, { dimColor: true, children: "Press Esc to exit" })] }));
    }
    if (step === 'forking') {
        return (_jsx(Box, { paddingX: 1, children: _jsx(Text, { color: "yellow", children: "Creating fork..." }) }));
    }
    if (step === 'done') {
        return (_jsx(Box, { paddingX: 1, children: _jsx(Text, { color: "green", children: "\u2713 Fork created, launching Claude..." }) }));
    }
    return (_jsx(MessageList, { messages: messages, onSelect: handleSelect, onExit: handleExit }));
}
render(_jsx(App, {}));
