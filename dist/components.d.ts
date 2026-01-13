import type { Message } from './session.js';
interface MessageListProps {
    messages: Message[];
    onSelect: (uuid: string) => void;
    onExit: () => void;
}
export declare function MessageList({ messages: allMessages, onSelect, onExit }: MessageListProps): import("react/jsx-runtime").JSX.Element;
export {};
