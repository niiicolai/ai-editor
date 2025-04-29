export interface FileMenuType {
  x: number;
  y: number;
  file: FileItemType | null;
}

export interface FileType {
  id: string;
  name: string;
  content: string;
  language: string;
  path: string;
}

export interface FileItemType {
  name: string;
  path: string;
  isDirectory: boolean;
}

export interface TabType {
  file: FileType;
}

export interface DirectoryStateFileType {
  isOpen: boolean;
  files: FileItemType[];
}

export interface DirectoryStateType {
  [path: string]: DirectoryStateFileType;
}

export interface DirectoryInfoType {
  currentPath: string | null;
  directoryState: DirectoryStateType;
}
