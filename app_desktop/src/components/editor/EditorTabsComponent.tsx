
interface EditorTabsComponentProps {
}

function EditorTabsComponent({}: EditorTabsComponentProps) {

    return (
        <div className="flex justify-start main-bgg border-b border-color text-sm h-12">

            <div className="flex justify-start ">
                <button className="px-3 py-2 flex items-center justify-center border-r border-color text-indigo-500 cursor-pointer hover:bg-gray-800">
                    Tab 1
                </button>
                <button className="px-3 py-2 flex items-center justify-center border-r border-color text-indigo-500 cursor-pointer hover:bg-gray-800">
                    Tab 2
                </button>
                <button className="px-3 py-2 flex items-center justify-center border-r border-color text-indigo-500 cursor-pointer hover:bg-gray-800">
                    Tab 3
                </button>
            </div>
        </div>
    );
}

export default EditorTabsComponent;
