import { Editor, Monaco, OnMount } from "@monaco-editor/react";
import type { editor as EditorType } from "monaco-editor";

import { setFile, setNextEditorCommand } from "../../features/editor";
import { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { useWriteFile } from "../../hooks/useFiles";
import { useSaveAs } from "../../hooks/useSaveAs";
import { useFocusFiles } from "../../hooks/useFocusFiles";
import themesJson from "../../assets/themes.json";

function EditorCodeComponent() {
  const { name: themeName } = useSelector((state: RootState) => state.theme);
  const { file, tabSize, nextEditorCommand } = useSelector((state: RootState) => state.editor);
  const { minimized: terminalIsMinimized, disabled: terminalIsDisabled } = useSelector((state: RootState) => state.terminalSettings);
  const { minimized: hierarchyIsMinimized } = useSelector((state: RootState) => state.hierarchySettings);
  const { minimized: agentIsMinimized } = useSelector((state: RootState) => state.userAgentSessionSettings);
  const theme = themesJson.find((t) => t.name === themeName)?.editor;

  //const shortcuts = useSelector((state: RootState) => state.shortcuts);
  const editorRef = useRef<EditorType.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const writeFile = useWriteFile();
  const saveAs = useSaveAs();
  const dispatch = useDispatch();
  const focusFiles = useFocusFiles();

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
  
    // Handle Ctrl + Click
    editor.onMouseDown((event) => {
      if (event.event.ctrlKey || event.event.metaKey) {
        const clickedWord = event?.target?.element?.innerText;
  
        if (clickedWord) {
          console.log("Ctrl + Click on:", clickedWord);
        }
      }
    });
  
    // Make the editor resizable on window resize
    const handleResize = () => {
      if (editorRef.current) {
        editorRef.current.layout();
      }
    };
  
    window.addEventListener("resize", handleResize);
  
    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  };
  

  const handleEditorChange = (value?: string) => {
    if (value !== undefined) {
      dispatch(setFile({ ...file, content: value }));
    }
  };

  const executeEditorCommand = (command: string) => {
    if (editorRef.current) {
      const editor = editorRef.current;

      switch (command) {
        case "copy":
            navigator.clipboard.writeText(editor.getModel()?.getValue() || "").catch((err) => {
            console.error("Failed to copy text: ", err);
            });
            break;
          case "cut":
            navigator.clipboard.writeText(editor.getModel()?.getValue() || "").then(() => {
            editor.executeEdits("cut", [
              {
              range: editor.getSelection() || new monacoRef.current!.Range(1, 1, 1, 1),
              text: "",
              },
            ]);
            }).catch((err) => {
            console.error("Failed to cut text: ", err);
            });
            break;
          case "paste":
            navigator.clipboard.readText().then((text) => {
            editor.executeEdits("paste", [
              {
              range: editor.getSelection() || new monacoRef.current!.Range(1, 1, 1, 1),
              text,
              },
            ]);
            }).catch((err) => {
            console.error("Failed to paste text: ", err);
            });
          break;
        case "select-all":
          editor.trigger("keyboard", "editor.action.selectAll", null);
          break;
        case "undo":
          editor.trigger("keyboard", "undo", null);
          break;
        case "redo":
          editor.trigger("keyboard", "redo", null);
          break;
        default:
          console.warn("Unknown command:", command);
      }
    }
  };

  const updateEditorCommands = () => {
    if (!editorRef.current) return;
    if (!monacoRef.current) return;
    if (!file) return;

    const editor = editorRef.current;
    const monaco = monacoRef.current;
    // Override Ctrl+S (or Cmd+S on macOS)
    //const keys = shortcuts.save;
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      const currentFile = { ...file }; // Get the latest file state
      if (!currentFile.id) saveAs.saveAs(currentFile.name, currentFile.content);
      else writeFile.mutateAsync(currentFile.path, currentFile.content);
    });

    // Override Ctrl+M (or Cmd+M on macOS)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyM, () => {
      const currentFile = { ...file }; // Get the latest file state
      const selection = editor.getSelection();
      const startLine = selection?.getStartPosition().lineNumber;
      const endLine = selection?.getEndPosition().lineNumber;
      const ln = startLine && endLine ? `${startLine}-${endLine}` : null;
      focusFiles.addFile({
      name: currentFile.name,
      path: currentFile.path,
      isDirectory: false
      }, ln);
    });
  }

  useEffect(() => {
    if (nextEditorCommand) {
      executeEditorCommand(nextEditorCommand);
      dispatch(setNextEditorCommand(null));
    }
  }, [nextEditorCommand]);

  useEffect(() => {
    if (file) {
      const editor = editorRef.current;
      const monaco = monacoRef.current;
      if (editor && monaco) {
        const model = editor.getModel();
        if (model) {
          monaco.editor.setModelLanguage(model, file.language.toLowerCase());

          updateEditorCommands();
        }
      }
    }
  }, [file]);

  const handleResize = () => {      
      if (editorRef.current) {
        editorRef.current.layout({
              width: 100, 
              height: 100,
          });
      }
    };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    handleResize();
  }, [terminalIsMinimized, terminalIsDisabled, hierarchyIsMinimized, agentIsMinimized]);

  return (
    <div className="flex-1">
      <Editor
        defaultLanguage={file.language.toLowerCase()}
        value={file.content}
        path={file.path}
        onChange={handleEditorChange}
        theme={theme?.id}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "'Fira Code', 'Fira Mono', monospace",
          lineNumbers: "on",
          automaticLayout: true,
          tabSize,
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
