import { Editor } from '@monaco-editor/react';

interface EditorCodeComponentProps {
    content: string;
    language: string;
    theme: string;
    onContentChange: (content: string) => void;
}

function EditorCodeComponent({
    content,
    language,
    theme,
    onContentChange,
}: EditorCodeComponentProps) {

    const handleEditorChange = (value: string | undefined) => {
        if (value !== undefined) {
            onContentChange(value);
        }
    };

    return (
        <div className="flex-1 overflow-auto bg-white">
            <Editor
                height="100%"
                language={language.toLowerCase()}
                value={content}
                onChange={handleEditorChange}
                theme={theme}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    fontFamily: "'Fira Code', 'Fira Mono', monospace",
                    lineNumbers: "on",
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    readOnly: false,
                    automaticLayout: true,
                    tabSize: 4,
                    suggestOnTriggerCharacters: true,
                    wordBasedSuggestions: true,
                    parameterHints: {
                        enabled: true
                    },
                    quickSuggestions: {
                        other: true,
                        comments: true,
                        strings: true
                    },
                    folding: true,
                    foldingStrategy: "auto",
                    foldingHighlight: true,
                    showFoldingControls: "always",
                    foldingImportsByDefault: true
                }}
            />
        </div>
    );
}

export default EditorCodeComponent;
