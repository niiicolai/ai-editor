import { Check, ChevronDown, ChevronUp } from "lucide-react";
import LoaderIcon from "../../icons/LoaderIcon"
import Scrollbar from "react-scrollbars-custom";
import { useState } from "react";
import { useTerminal } from "../../hooks/useTerminal";
import { editorSettingsActions } from "../../features/editorSettings";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";

function TerminalComponent() {
    const terminal = useTerminal();
    const isMinimized = useSelector((state: RootState) => state.editorSettings.terminal.minimized);
    const [terminalMessages, setTerminalMessages] = useState<string[]>([]);
    const [formIsLoading, setFormIsLoading] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [message, setMessage] = useState<string>("");
    const dispatch = useDispatch();

    const handleTerminalCommand = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormError(null);
        setFormIsLoading(true);

        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const command = formData.get('command') as string;
        if (!command) return setFormError("You must enter a command");

        try {
            const response = await terminal.executeTerminalCommand(command);
            setTerminalMessages([...terminalMessages, command, response])
            setMessage("")
        } catch (err) {
            setFormError(err as string);
        } finally {
            setFormIsLoading(false);
        }
    }

    if (isMinimized) {
        return (
            <div className="border-t border-color flex flex-col justify-between">
                <div className="p-2 flex justify-between">
                    <h2 className="text-md font-medium highlight-color">Terminal</h2>
                    <button
                        onClick={() => dispatch(editorSettingsActions.setTerminalMinimized(false))}
                        className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white button-main disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronUp className='w-4 h-4' />
                    </button>
                </div>
            </div>
        );
    }
    return (
        <div className="h-64 border-t border-color flex flex-col justify-between">
            <div className="p-2 border-b border-color flex justify-between">
                <h2 className="text-md font-medium highlight-color">Terminal</h2>
                <button
                    onClick={() => dispatch(editorSettingsActions.setTerminalMinimized(true))}
                    className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white button-main disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronDown className='w-4 h-4' />
                </button>
            </div>
            <Scrollbar style={{ height: 250 }} className='w-full border-b border-color h-full text-sm text-white'>
                <div className='p-1 text-white'>
                    {terminalMessages.map((m: string, i: number) => (
                        <pre key={i}>{m}</pre>
                    ))}
                </div>
            </Scrollbar>
            <div>
                {formError && (<>{formError}</>)}

                <form onSubmit={handleTerminalCommand} className='flex'>
                    <input type="text" name='command' value={message} onChange={(e: any) => setMessage(e.target.value)} placeholder="$" className="input-main text-sm px-3 py-2 w-full focus:outline-none h-12" />
                    <button
                        type="submit"
                        className="button-main px-4 py-2 cursor-pointer focus:outline-none"
                    >
                        {formIsLoading ? <LoaderIcon h="h-4" w="w-4" /> : <Check className="h-4 w-4" />}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default TerminalComponent;