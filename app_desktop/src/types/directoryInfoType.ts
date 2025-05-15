export interface FileMenuType {
  x: number;
  y: number;
  file: FileItemType | null;
}

export interface FocusFileItemType {
  file: FileItemType;
  lines: string | null;
}

export interface FileItemType {
  name: string;
  path: string;
  isDirectory: boolean;
  indexed?: boolean;
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
