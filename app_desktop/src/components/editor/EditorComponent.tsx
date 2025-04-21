import { Editor } from '@monaco-editor/react';
import { useState } from 'react';
import EditorCodeComponent from './EditorCodeComponent';
import EditorBarComponent from './EditorBarComponent';
import EditorTabsComponent from './EditorTabsComponent';
import TerminalComponent from "../terminal/TerminalComponent"
import { FileType, TabType } from '../../types/directoryInfoType';

interface EditorComponentProps {
    tabs: TabType[];
    viewTab: (t: TabType) => void;
    removeTab: (t: TabType) => void;
    saveCurrentFile: () => void;
    isPendingSave: boolean;
    currentFile: FileType;
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

function EditorComponent({
    content,
    language,
    onContentChange,
    saveCurrentFile,
    isPendingSave,
    viewTab,
    removeTab,
    tabs,
    currentFile
}: EditorComponentProps) {
    const [theme, setTheme] = useState('vs-dark');

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
                    <div className="w-full flex-1 flex flex-col border-r border-color main-bgg">
                        <EditorTabsComponent
                            tabs={tabs}
                            currentFile={currentFile}
                            viewTab={viewTab}
                            removeTab={removeTab}
                        />

                        <EditorCodeComponent
                            content={content}
                            language={language}
                            onContentChange={onContentChange}
                            theme={theme}
                        />

                        <EditorBarComponent
                            handleSave={saveCurrentFile}
                            isPendingSave={isPendingSave}
                            language={language}
                        />

                        <TerminalComponent />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditorComponent;
