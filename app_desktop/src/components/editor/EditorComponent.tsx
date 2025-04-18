import { Editor } from '@monaco-editor/react';
import { useState } from 'react';

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
    const [theme, setTheme] = useState('hc-black');

    const handleEditorChange = (value: string | undefined) => {
        if (value !== undefined) {
            onContentChange(value);
        }
    };

    return (
        <div className="flex-1 flex min-h-screen">
            <div className="flex h-screen w-full flex-1">
                {/* Code Editor Section */}
                <div className="w-full flex">
                    <div className="w-full flex-1 flex flex-col border-r border-gray-800">
                        {/* Code Editor Header */}
                        <div className="main-bgg shadow-sm">
                            <div className="px-4 py-3 border-b border-gray-800">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h2 className="text-lg font-medium text-gray-100">Code Editor</h2>
                                        <p className="text-sm text-gray-200">Language: {language}</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <label htmlFor="theme-select" className="text-sm text-gray-200">Theme:</label>
                                        <select
                                            id="theme-select"
                                            value={theme}
                                            onChange={(e) => setTheme(e.target.value)}
                                            className="bg-indigo-700 text-white rounded px-2 py-1 text-sm"
                                        >
                                            {themes.map((t) => (
                                                <option key={t.id} value={t.id}>
                                                    {t.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

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
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditorComponent;
