import React, { useState, useEffect } from 'react';
import { Box, Text, useInput, useStdout } from 'ink';
import type { Message } from './session.js';

interface MessageListProps {
  messages: Message[];
  onSelect: (uuid: string) => void;
  onExit: () => void;
}

export function MessageList({ messages: allMessages, onSelect, onExit }: MessageListProps) {
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
      onExit();
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
        <Text dimColor>Select the point to fork from</Text>
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
        <Text dimColor>↑↓ Move · +/- Lines · Space Filter · Enter Fork · Esc Exit</Text>
      </Box>
    </Box>
  );
}
