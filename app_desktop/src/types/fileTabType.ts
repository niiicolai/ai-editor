import { FileType } from "./editorFileType";

export interface TabType {
  file: FileType;
  contentIsChanged: boolean;
}

export interface TabMenuType {
  x: number;
  y: number;
  tab: TabType | null;
}
