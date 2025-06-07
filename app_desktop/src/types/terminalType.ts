export interface TerminalType {
  id: string;
  cwd: string;
  messages: string[];
}

export interface TerminalMenuType {
  x: number;
  y: number;
  terminal: TerminalType | null;
}