import React, { useState, useEffect } from 'react';
import { Box, Text, useInput, useStdout } from 'ink';
import type { Message, Session } from './session.js';

// ============ Session List Component ============

interface SessionListProps {
  sessions: Session[];
  onSelect: (session: Session) => void;
  onExit: () => void;
}

export function SessionList({ sessions, onSelect, onExit }: SessionListProps) {
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
    return (
      <Box paddingX={1} flexDirection="column">
        <Text color="red">No sessions found for this directory</Text>
        <Text dimColor>Press Esc to exit</Text>
      </Box>
    );
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

  const formatTime = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Box flexDirection="column" paddingX={1}>
      {/* Title */}
      <Box marginBottom={0}>
        <Text bold color="blue">Sessions</Text>
        <Text dimColor> ({selectedIndex + 1}/{sessions.length})</Text>
      </Box>

      {/* Subtitle */}
      <Box marginBottom={1}>
        <Text dimColor>Select a session to fork from</Text>
      </Box>

      {/* Scroll indicator top */}
      {startIdx > 0 && (
        <Box>
          <Text dimColor>  ↑ {startIdx} more above</Text>
        </Box>
      )}

      {/* Sessions */}
      {visibleSessions.map((session, visibleIdx) => {
        const actualIndex = startIdx + visibleIdx;
        const isSelected = actualIndex === selectedIndex;
        const isCurrent = actualIndex === 0;

        const preview = session.firstMessage || `Session ${session.id.slice(0, 8)}...`;
        const time = formatTime(session.mtime);

        return (
          <Box key={session.id} flexDirection="column">
            <Box>
              <Text color={isSelected ? 'cyan' : undefined} bold={isSelected}>
                {isSelected ? '❯ ' : '  '}
              </Text>
              <Text color={isSelected ? 'white' : 'gray'} bold={isSelected}>
                {preview.slice(0, 60)}{preview.length > 60 ? '...' : ''}
              </Text>
              {isCurrent && <Text color="yellow" italic> (latest)</Text>}
            </Box>
            <Box marginLeft={2}>
              <Text dimColor>  {time} · {session.id.slice(0, 8)}</Text>
            </Box>
          </Box>
        );
      })}

      {/* Scroll indicator bottom */}
      {endIdx < sessions.length && (
        <Box>
          <Text dimColor>  ↓ {sessions.length - endIdx} more below</Text>
        </Box>
      )}

      {/* Footer */}
      <Box marginTop={1}>
        <Text dimColor>↑↓ Move · Enter Select · Esc Exit</Text>
      </Box>
    </Box>
  );
}

// ============ Message List Component ============

interface MessageListProps {
  messages: Message[];
  onSelect: (uuid: string) => void;
  onBack?: () => void;
  onExit: () => void;
}

export function MessageList({ messages: allMessages, onSelect, onBack, onExit }: MessageListProps) {
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
      } else {
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
    return (
      <Box paddingX={1}>
        <Text color="red">No messages to display</Text>
      </Box>
    );
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
  const getContentLines = (content: string, maxLen: number, numLines: number): string[] => {
    const lines: string[] = [];
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

  return (
    <Box flexDirection="column" paddingX={1}>
      {/* Title */}
      <Box marginBottom={0}>
        <Text bold color="blue">Fork</Text>
        <Text dimColor> ({selectedIndex + 1}/{totalMessages})</Text>
        <Text color="cyan"> [{expandLines}行]</Text>
        {showOnlyUser && <Text color="yellow"> [User Only]</Text>}
      </Box>

      {/* Subtitle */}
      <Box marginBottom={1}>
        <Text dimColor>Select the point to fork from{onBack ? ' · Esc to go back' : ''}</Text>
      </Box>

      {/* Scroll indicator top */}
      {startIdx > 0 && (
        <Box>
          <Text dimColor>  ↑ {startIdx} more above</Text>
        </Box>
      )}

      {/* Messages */}
      {visibleMessages.flatMap((msg, visibleIdx) => {
        const actualIndex = startIdx + visibleIdx;
        const isSelected = actualIndex === selectedIndex;
        const isCurrent = actualIndex === messages.length - 1;
        const isUser = msg.type === 'user';

        const maxLen = 65;
        const numLines = isSelected ? expandLines : 1;
        const contentLines = getContentLines(msg.content, maxLen, numLines);

        return contentLines.map((line, lineIdx) => {
          const isFirstLine = lineIdx === 0;

          return (
            <Box key={`${actualIndex}-${lineIdx}`}>
              {/* Selection indicator */}
              <Text color={isSelected ? 'cyan' : undefined} bold={isSelected}>
                {isFirstLine ? (isSelected ? '❯ ' : '  ') : '    '}
              </Text>

              {/* Role label */}
              {isFirstLine ? (
                <Text color={isUser ? 'green' : 'magenta'} bold inverse={isSelected}>
                  {isUser ? ' You ' : ' AI '}
                </Text>
              ) : (
                <Text>      </Text>
              )}

              <Text> </Text>

              {/* Code change indicator */}
              {isFirstLine ? (
                <Text color={msg.hasCodeChanges ? 'yellow' : 'gray'}>
                  {msg.hasCodeChanges ? '◆ ' : '  '}
                </Text>
              ) : (
                <Text>  </Text>
              )}

              {/* Message content */}
              <Text color={isSelected ? 'white' : 'gray'} bold={isSelected && isFirstLine}>
                {line}
              </Text>

              {/* Current indicator */}
              {isFirstLine && isCurrent && (
                <Text color="yellow" italic> (current)</Text>
              )}
            </Box>
          );
        });
      })}

      {/* Scroll indicator bottom */}
      {endIdx < totalMessages && (
        <Box>
          <Text dimColor>  ↓ {totalMessages - endIdx} more below</Text>
        </Box>
      )}

      {/* Footer */}
      <Box marginTop={1}>
        <Text dimColor>↑↓ Move · +/- Lines · Space Filter · Enter Fork · Esc {onBack ? 'Back' : 'Exit'}</Text>
      </Box>
    </Box>
  );
}
