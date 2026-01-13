import type { Message, Session } from './session.js';
interface SessionListProps {
    sessions: Session[];
    onSelect: (session: Session) => void;
    onExit: () => void;
}
export declare function SessionList({ sessions, onSelect, onExit }: SessionListProps): import("react/jsx-runtime").JSX.Element;
interface MessageListProps {
    messages: Message[];
    onSelect: (uuid: string) => void;
    onBack?: () => void;
    onExit: () => void;
}
export declare function MessageList({ messages: allMessages, onSelect, onBack, onExit }: MessageListProps): import("react/jsx-runtime").JSX.Element;
export {};
