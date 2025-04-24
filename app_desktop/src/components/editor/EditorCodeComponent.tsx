import { Editor, Monaco, OnMount } from "@monaco-editor/react";
import type { editor as EditorType } from "monaco-editor";

import { setFile } from "../../features/editor";
import { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";

function EditorCodeComponent() {
  const editorRef = useRef<EditorType.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const theme = useSelector((state: RootState) => state.editorSettings.theme);
  const editorState = useSelector((state: RootState) => state.editor);
  const file = editorState.file;
  const dispatch = useDispatch();

  const handleEditorDidMount: OnMount = (
    editor: EditorType.IStandaloneCodeEditor,
    monaco
  ) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Configure TS options
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      jsx: monaco.languages.typescript.JsxEmit.React,
      target: monaco.languages.typescript.ScriptTarget.ESNext,
      allowJs: true,
      checkJs: true,
      allowNonTsExtensions: true,
      module: monaco.languages.typescript.ModuleKind.ESNext,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      typeRoots: ["node_modules/@types"],
      reactNamespace: "React",
    });

    // Optional: Add extra type definitions if needed
    // monaco.languages.typescript.typescriptDefaults.addExtraLib(`
    //   declare module "my-custom-module" {
    //     export function hello(): void;
    //   }
    // `, "filename/custom.d.ts");
  };

  const handleEditorChange = (value?: string) => {
    if (value !== undefined) {
      dispatch(setFile({ ...file, content: value }));
    }
  };

  useEffect(() => {
    if (file) {
      const editor = editorRef.current;
      const monaco = monacoRef.current;
      if (editor && monaco) {
        const model = editor.getModel();
        if (model) {
          monaco.editor.setModelLanguage(model, file.language.toLowerCase());
        }
      }
    }
  }, [file]);

  return (
    <div className="flex-1">
      <Editor
        defaultLanguage={file.language.toLowerCase()}
        value={file.content}
        path={file.path}
        onChange={handleEditorChange}
        theme={theme.id}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "'Fira Code', 'Fira Mono', monospace",
          lineNumbers: "on",
          automaticLayout: true,
          tabSize: 4,
          suggestOnTriggerCharacters: true,
          wordBasedSuggestions: "currentDocument",
          parameterHints: { enabled: true },
          quickSuggestions: {
            other: true,
            comments: true,
            strings: true,
          },
          folding: true,
          showFoldingControls: "always",
        }}
      />
    </div>
  );
}

export default EditorCodeComponent;
