import { FileItemType } from "./directoryInfoType";

export interface ProjectIndexType {
  meta: ProjectIndexMetaType | null;
  items: ProjectIndexItemType;
  queue: FileItemType[];
}

export interface ProjectIndexMetaType {
  _id: string | null;
  name: string;
}

export interface ProjectIndexItemType {
  [path: string]: {
    _id: string;
    name: string;
    path: string;
    language: string;
    description: string;
    lines: number;
    hashCode: string;
    functions: ProjectIndexItemFunctionType[];
    classes: ProjectIndexItemClassType[];
    vars: ProjectIndexItemVarType[];
    ignore: boolean;
  };
}

export interface ProjectIndexItemFunctionType {
  signature: string;
  name: string;
  line: number;
}

export interface ProjectIndexItemClassType {
  signature: string;
  name: string;
  line: number;
}

export interface ProjectIndexItemVarType {
  signature: string;
  name: string;
  line: number;
}
