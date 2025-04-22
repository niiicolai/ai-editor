import { Cog, Redo, Save, Search, Undo, User } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface EditorComponentProps {
    isPendingSave: boolean;
    handleSave: () => void;
    language: string;
}

const themes = [
    { id: 'vs-light', name: 'Light' },
    { id: 'vs-dark', name: 'Dark' },
    { id: 'hc-light', name: 'High Contrast Light' },
    { id: 'hc-black', name: 'High Contrast Dark' }
];

function EditorBarComponent({ handleSave, isPendingSave, language }: EditorComponentProps) {
    const [theme, setTheme] = useState('vs-dark');
    const navigate = useNavigate();

    return (
        <div className="shadow-sm lg:h-12 border-t border-color flex justify-start items-center w-full">
            <div className="px-3 py-3 lg:py-1 w-full">
                <div className="flex flex-col lg:flex-row justify-start lg:items-center gap-3">
                    <div className="flex gap-3 justify-start items-center">
                        <button
                            onClick={handleSave}
                            disabled={isPendingSave}
                            className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm button-main disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPendingSave ? (
                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <Save className="h-4 w-4" />
                            )}
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isPendingSave}
                            className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm button-main disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPendingSave ? (
                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <Search className="h-4 w-4" />
                            )}
                        </button>
                        <button
                            onClick={() => navigate("/settings")}
                            className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm button-main disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPendingSave ? (
                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <Cog className="h-4 w-4" />
                            )}
                        </button>


                    </div>
                    <div className="flex flex-row justify-start items-center gap-3">
                        <div className="pl-3 lg:border-l border-color flex justify-start items-center">
                            <p className="text-xs highlight-color">Language: {language}</p>
                        </div>

                        <div className="pl-3 lg:border-l border-color flex justify-start items-center">
                            <p className="text-xs highlight-color">Branch: main</p>
                        </div>

                        <div className="pl-3 lg:border-l border-color flex justify-start items-center">
                            <p className="text-xs highlight-color">Theme: {theme}</p>
                        </div>

                        <div className="pl-3 lg:border-l border-color flex justify-start items-center">
                            <p className="text-xs highlight-color">Ln 10, Col 10</p>
                        </div>

                        <div className="pl-3 lg:border-l border-color flex justify-start items-center">
                            <p className="text-xs highlight-color">Errors: 0</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 hidden">
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
    );
}

export default EditorBarComponent;
