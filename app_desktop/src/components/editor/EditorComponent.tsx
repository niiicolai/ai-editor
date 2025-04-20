import { Editor } from '@monaco-editor/react';
import { useState } from 'react';
import EditorBarComponent from './EditorBarComponent';
import EditorTabsComponent from './EditorTabsComponent';
import TerminalComponent from "../terminal/TerminalComponent"

interface EditorComponentProps {
    content: string;
    language: string;
    onContentChange: (content: string) => void;
}

const themes = [
    { id: 'vs-light', name: 'Light' },
    { id: 'vs-dark', name: 'Dark' },
    { id: 'hc-light', name: 'High Contrast Light' },
    { id: 'hc-black', name: 'High Contrast Dark' }
];

function EditorComponent({ content, language, onContentChange }: EditorComponentProps) {
    const [theme, setTheme] = useState('vs-dark');

    const handleEditorChange = (value: string | undefined) => {
        if (value !== undefined) {
            onContentChange(value);
        }
    };

    const handleSave = () => {

    }

    const isPendingSave = false;

    return (
        <div className="flex-1 flex min-h-screen">
            <div className="flex h-screen w-full flex-1">
                {/* Code Editor Section */}
                <div className="w-full flex">
                    <div className="w-full flex-1 flex flex-col border-r border-color main-bgg">
                        <EditorTabsComponent />

                        {/* Code Editor */}
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

                        <TerminalComponent />
                        <EditorBarComponent 
                            handleSave={handleSave} 
                            isPendingSave={isPendingSave} 
                            language={language} 
                        />

                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditorComponent;
