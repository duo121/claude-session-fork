import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, Text, useInput, useStdout } from 'ink';
export function SessionList({ sessions, onSelect, onExit }) {
    const { stdout } = useStdout();
    const [selectedIndex, setSelectedIndex] = useState(0);
    const terminalHeight = stdout?.rows || 24;
    const maxVisible = Math.max(3, terminalHeight - 8);
    useInput((input, key) => {
        if (key.escape) {
            onExit();
            return;
        }
        if (key.upArrow) {
            setSelectedIndex(i => Math.max(0, i - 1));
        }
        if (key.downArrow) {
            setSelectedIndex(i => Math.min(sessions.length - 1, i + 1));
        }
        if (key.return && sessions.length > 0) {
            onSelect(sessions[selectedIndex]);
        }
    });
    if (sessions.length === 0) {
        return (_jsxs(Box, { paddingX: 1, flexDirection: "column", children: [_jsx(Text, { color: "red", children: "No sessions found for this directory" }), _jsx(Text, { dimColor: true, children: "Press Esc to exit" })] }));
    }
    // Calculate visible window
    let startIdx = 0;
    let endIdx = sessions.length;
    if (sessions.length > maxVisible) {
        const halfWindow = Math.floor(maxVisible / 2);
        startIdx = Math.max(0, selectedIndex - halfWindow);
        endIdx = Math.min(sessions.length, startIdx + maxVisible);
        if (endIdx === sessions.length) {
            startIdx = Math.max(0, sessions.length - maxVisible);
        }
    }
    const visibleSessions = sessions.slice(startIdx, endIdx);
    const formatTime = (date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        if (minutes < 1)
            return 'just now';
        if (minutes < 60)
            return `${minutes}m ago`;
        if (hours < 24)
            return `${hours}h ago`;
        if (days < 7)
            return `${days}d ago`;
        return date.toLocaleDateString();
    };
    return (_jsxs(Box, { flexDirection: "column", paddingX: 1, children: [_jsxs(Box, { marginBottom: 0, children: [_jsx(Text, { bold: true, color: "blue", children: "Sessions" }), _jsxs(Text, { dimColor: true, children: [" (", selectedIndex + 1, "/", sessions.length, ")"] })] }), _jsx(Box, { marginBottom: 1, children: _jsx(Text, { dimColor: true, children: "Select a session to fork from" }) }), startIdx > 0 && (_jsx(Box, { children: _jsxs(Text, { dimColor: true, children: ["  \u2191 ", startIdx, " more above"] }) })), visibleSessions.map((session, visibleIdx) => {
                const actualIndex = startIdx + visibleIdx;
                const isSelected = actualIndex === selectedIndex;
                const isCurrent = actualIndex === 0;
                const preview = session.firstMessage || `Session ${session.id.slice(0, 8)}...`;
                const time = formatTime(session.mtime);
                return (_jsxs(Box, { flexDirection: "column", children: [_jsxs(Box, { children: [_jsx(Text, { color: isSelected ? 'cyan' : undefined, bold: isSelected, children: isSelected ? '❯ ' : '  ' }), _jsxs(Text, { color: isSelected ? 'white' : 'gray', bold: isSelected, children: [preview.slice(0, 60), preview.length > 60 ? '...' : ''] }), isCurrent && _jsx(Text, { color: "yellow", italic: true, children: " (latest)" })] }), _jsx(Box, { marginLeft: 2, children: _jsxs(Text, { dimColor: true, children: ["  ", time, " \u00B7 ", session.id.slice(0, 8)] }) })] }, session.id));
            }), endIdx < sessions.length && (_jsx(Box, { children: _jsxs(Text, { dimColor: true, children: ["  \u2193 ", sessions.length - endIdx, " more below"] }) })), _jsx(Box, { marginTop: 1, children: _jsx(Text, { dimColor: true, children: "\u2191\u2193 Move \u00B7 Enter Select \u00B7 Esc Exit" }) })] }));
}
export function MessageList({ messages: allMessages, onSelect, onBack, onExit }) {
    const { stdout } = useStdout();
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [expandLines, setExpandLines] = useState(1);
    const [showOnlyUser, setShowOnlyUser] = useState(false);
    // Filter messages based on mode
    const messages = showOnlyUser
        ? allMessages.filter(m => m.type === 'user')
        : allMessages;
    // Reset selection when filter changes
    useEffect(() => {
        setSelectedIndex(Math.min(selectedIndex, Math.max(0, messages.length - 1)));
    }, [showOnlyUser, messages.length]);
    // Calculate layout
    const terminalHeight = stdout?.rows || 24;
    const layoutLines = 5;
    const reservedForExpand = 5;
    const availableLines = terminalHeight - layoutLines - reservedForExpand;
    const maxVisible = Math.max(3, availableLines);
    useInput((input, key) => {
        if (key.escape) {
            if (onBack) {
                onBack();
            }
            else {
                onExit();
            }
            return;
        }
        // Space: toggle user-only filter
        if (input === ' ') {
            setShowOnlyUser(v => !v);
            return;
        }
        // +/= : increase expand lines
        if (input === '=' || input === '+') {
            setExpandLines(n => Math.min(n + 1, 10));
            return;
        }
        // - : decrease expand lines
        if (input === '-') {
            setExpandLines(n => Math.max(n - 1, 1));
            return;
        }
        if (key.upArrow) {
            setSelectedIndex(i => Math.max(0, i - 1));
        }
        if (key.downArrow) {
            setSelectedIndex(i => Math.min(messages.length - 1, i + 1));
        }
        if (key.return && messages.length > 0) {
            onSelect(messages[selectedIndex].uuid);
        }
    });
    if (messages.length === 0) {
        return (_jsx(Box, { paddingX: 1, children: _jsx(Text, { color: "red", children: "No messages to display" }) }));
    }
    // Calculate visible window
    const totalMessages = messages.length;
    let startIdx = 0;
    let endIdx = totalMessages;
    if (totalMessages > maxVisible) {
        const halfWindow = Math.floor(maxVisible / 2);
        startIdx = Math.max(0, selectedIndex - halfWindow);
        endIdx = Math.min(totalMessages, startIdx + maxVisible);
        if (endIdx === totalMessages) {
            startIdx = Math.max(0, totalMessages - maxVisible);
        }
    }
    const visibleMessages = messages.slice(startIdx, endIdx);
    // Helper to get content lines
    const getContentLines = (content, maxLen, numLines) => {
        const lines = [];
        let remaining = content;
        for (let i = 0; i < numLines && remaining.length > 0; i++) {
            lines.push(remaining.slice(0, maxLen));
            remaining = remaining.slice(maxLen);
        }
        if (remaining.length > 0 && lines.length > 0) {
            lines[lines.length - 1] = lines[lines.length - 1].slice(0, -3) + '...';
        }
        return lines;
    };
    return (_jsxs(Box, { flexDirection: "column", paddingX: 1, children: [_jsxs(Box, { marginBottom: 0, children: [_jsx(Text, { bold: true, color: "blue", children: "Fork" }), _jsxs(Text, { dimColor: true, children: [" (", selectedIndex + 1, "/", totalMessages, ")"] }), _jsxs(Text, { color: "cyan", children: [" [", expandLines, "\u884C]"] }), showOnlyUser && _jsx(Text, { color: "yellow", children: " [User Only]" })] }), _jsx(Box, { marginBottom: 1, children: _jsxs(Text, { dimColor: true, children: ["Select the point to fork from", onBack ? ' · Esc to go back' : ''] }) }), startIdx > 0 && (_jsx(Box, { children: _jsxs(Text, { dimColor: true, children: ["  \u2191 ", startIdx, " more above"] }) })), visibleMessages.flatMap((msg, visibleIdx) => {
                const actualIndex = startIdx + visibleIdx;
                const isSelected = actualIndex === selectedIndex;
                const isCurrent = actualIndex === messages.length - 1;
                const isUser = msg.type === 'user';
                const maxLen = 65;
                const numLines = isSelected ? expandLines : 1;
                const contentLines = getContentLines(msg.content, maxLen, numLines);
                return contentLines.map((line, lineIdx) => {
                    const isFirstLine = lineIdx === 0;
                    return (_jsxs(Box, { children: [_jsx(Text, { color: isSelected ? 'cyan' : undefined, bold: isSelected, children: isFirstLine ? (isSelected ? '❯ ' : '  ') : '    ' }), isFirstLine ? (_jsx(Text, { color: isUser ? 'green' : 'magenta', bold: true, inverse: isSelected, children: isUser ? ' You ' : ' AI ' })) : (_jsx(Text, { children: "      " })), _jsx(Text, { children: " " }), isFirstLine ? (_jsx(Text, { color: msg.hasCodeChanges ? 'yellow' : 'gray', children: msg.hasCodeChanges ? '◆ ' : '  ' })) : (_jsx(Text, { children: "  " })), _jsx(Text, { color: isSelected ? 'white' : 'gray', bold: isSelected && isFirstLine, children: line }), isFirstLine && isCurrent && (_jsx(Text, { color: "yellow", italic: true, children: " (current)" }))] }, `${actualIndex}-${lineIdx}`));
                });
            }), endIdx < totalMessages && (_jsx(Box, { children: _jsxs(Text, { dimColor: true, children: ["  \u2193 ", totalMessages - endIdx, " more below"] }) })), _jsx(Box, { marginTop: 1, children: _jsxs(Text, { dimColor: true, children: ["\u2191\u2193 Move \u00B7 +/- Lines \u00B7 Space Filter \u00B7 Enter Fork \u00B7 Esc ", onBack ? 'Back' : 'Exit'] }) })] }));
}
