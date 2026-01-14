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
export declare function getProjectDir(dir?: string): string;
export declare function findLatestSession(dir?: string): Session | null;
export declare function findAllSessions(dir?: string): Session[];
export declare function parseSession(sessionFile: string): Message[];
export declare function forkSession(sessionFile: string, forkUuid: string): string;
export declare function launchClaudeSession(sessionId: string, cwd: string, _terminal?: string): void;
export declare function openTerminalWithUI(cwd: string, sessionId: string, terminal?: string): void;
