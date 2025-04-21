import { XIcon } from "lucide-react";
import { FileType, TabType } from "../../types/directoryInfoType";
import Scrollbar from "react-scrollbars-custom";

interface EditorTabsComponentProps {
    tabs: TabType[];
    viewTab: (t:TabType) => void;
    removeTab: (t:TabType) => void;
    currentFile: FileType;
}

function EditorTabsComponent({ currentFile, tabs, viewTab, removeTab }: EditorTabsComponentProps) {

    return (
        <div className="flex justify-start main-bgg border-b border-color text-sm h-12 overflow-hidden">
            <Scrollbar className="overflow-hidden w-full h-full hide-y-scrollbar">
                <div className="flex justify-start">
                    {tabs && tabs.map((t: TabType) => (
                        <div key={t.file.name} className={`flex tab justify-center border-r ${currentFile.name === t.file.name ? 'tab-active' : ''}`}>
                            <button onClick={() => viewTab(t)} className="px-3 py-2 cursor-pointer view-tab-button overflow-hidden truncate">
                                {t.file.name}
                            </button>
                            <div className="px-3 py-4 flex justify-center">
                                <button onClick={() => removeTab(t)} className="cursor-pointer rounded-md close-tab-button">
                                    <XIcon className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </Scrollbar>
        </div>
    );
}

export default EditorTabsComponent;
