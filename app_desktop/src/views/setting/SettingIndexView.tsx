import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { editorSettingsActions } from "../../features/editorSettings";
import { RootState } from "../../store";

const themes = [
    { id: 'vs-light', name: 'Light' },
    { id: 'vs-dark', name: 'Dark' },
    { id: 'hc-light', name: 'High Contrast Light' },
    { id: 'hc-black', name: 'High Contrast Dark' }
];

function SettingIndexView() {
    const dispatch = useDispatch();
    const editorSettings = useSelector((state: RootState) => state.editorSettings);

    return (
        <div className="flex min-h-screen main-bgg main-color p-6">
            <div className="w-full">
                <div className="secondary-bgg border border-color shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg leading-6 font-medium main-color">
                                Settings
                            </h3>
                            <div className="flex justify-start items-center gap-3">
                                <Link
                                    to="/"
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md button-main"
                                >
                                    Close
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-color">
                        <dl>
                            <div className="main-bgg px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium main-color">
                                    General
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex flex-col gap-3">

                                    <div className="bg-slate-800 p-3 rounded-md flex justify-between">
                                        <p className="text-white mb-3">Theme: {editorSettings.theme.name}</p>
                                        <select
                                            className="bg-white"
                                            onChange={(e) => {
                                                const selectedThemeId = e.target.value;
                                                const selectedTheme = themes.find((t: any) => t.id === selectedThemeId);
                                                if (selectedTheme) {
                                                    dispatch(editorSettingsActions.setTheme(selectedTheme));
                                                }
                                            }}
                                            defaultValue={editorSettings.theme.id}>
                                            {themes.map((t: any) => (
                                                <option key={t.id} value={t.id}>{t.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </dd>
                            </div>
                        </dl>
                    </div>
                    <div className="border-t border-color">
                        <dl>
                            <div className="main-bgg px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium">
                                    Terminal
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex flex-col gap-3">
                                    <div className="bg-slate-800 p-3 rounded-md">
                                        <p className=" text-white mb-3">Allowed Commands:</p>
                                        <textarea className="w-full h-24 bg-white rounded-md" defaultValue={`/^git\s+/,\n/^npm\s+/,\n/^yarn\s+/,\n/^cd\s+/,\n/^ls\s*/,\n/^dir\s*/,\n/^pwd\s*/,\n/^grep\s*/,\n/^powershell\s*/,\n`} />
                                    </div>
                                    <div className="bg-slate-800 p-3 rounded-md flex justify-between">
                                        <p className=" text-white mb-3">Disable:</p>
                                        <input type="checkbox" onChange={() => dispatch(editorSettingsActions.setTerminalDisabled(!editorSettings.terminal.disabled))} checked={editorSettings.terminal.disabled} />
                                    </div>
                                </dd>
                            </div>
                        </dl>
                    </div>
                    <div className="border-t border-color">
                        <dl>
                            <div className="main-bgg px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium main-color">
                                    Editor
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex flex-col gap-3">
                                    <div className="bg-slate-800 p-3 rounded-md flex justify-between">
                                        <p className=" text-white mb-3">Disable Tabs:</p>
                                        <input type="checkbox" />
                                    </div>
                                    <div className="bg-slate-800 p-3 rounded-md flex justify-between">
                                        <p className=" text-white mb-3">Disable Search:</p>
                                        <input type="checkbox" onChange={() => dispatch(editorSettingsActions.setSearchDisabled(!editorSettings.search.disabled))} checked={editorSettings.search.disabled} />
                                    </div>
                                    <div className="bg-slate-800 p-3 rounded-md flex justify-between">
                                        <p className=" text-white mb-3">Disable branch info:</p>
                                        <input type="checkbox" />
                                    </div>
                                    <div className="bg-slate-800 p-3 rounded-md flex justify-between">
                                        <p className=" text-white mb-3">Disable line info:</p>
                                        <input type="checkbox" />
                                    </div>
                                    <div className="bg-slate-800 p-3 rounded-md flex justify-between">
                                        <p className=" text-white mb-3">Disable error info:</p>
                                        <input type="checkbox" />
                                    </div>
                                </dd>
                            </div>
                        </dl>
                    </div>
                    <div className="border-t border-color">
                        <dl>
                            <div className="main-bgg px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium main-color">
                                    AI Assistant
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex flex-col gap-3">
                                    <div className="bg-slate-800 p-3 rounded-md">
                                        <p className=" text-white mb-3">Give your agent pre-instructions:</p>
                                        <textarea className="w-full h-24 bg-white rounded-md" />
                                    </div>
                                    <div className="bg-slate-800 p-3 rounded-md">
                                        <p className=" text-white mb-3">Allowed Functions:</p>
                                        <textarea className="w-full h-24 bg-white rounded-md" defaultValue={`list_directory\nread_file\nwrite_file\nsearch_file_content`} />
                                    </div>
                                    <div className="bg-slate-800 p-3 rounded-md flex justify-between">
                                        <p className=" text-white mb-3">Disable:</p>
                                        <input type="checkbox" />
                                    </div>
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SettingIndexView;
