import { Check, ChevronDown, ChevronUp, Code, LoaderIcon } from "lucide-react";
import { useTerminal } from "../../hooks/useTerminal";
import { editorSettingsActions } from "../../features/editorSettings";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import Scrollbar from "react-scrollbars-custom";

function TerminalComponent() {
  const terminalSetting = useSelector((state: RootState) => state.editorSettings.terminal);
  const { minimized, disabled } = terminalSetting;
  const { execute, isLoading, formError, messages, message, setMessage } = useTerminal();
  const dispatch = useDispatch();

  if (disabled) {
    return <></>;
  }

  if (minimized) {
    return (
      <div className="border-t border-color flex flex-col justify-between">
        <div className="p-1 flex justify-between h-8">
          <div className="flex items-center justify-center ml-1 highlight-color">
            <Code className="w-4 h-4" />
          </div>
          <button
            onClick={() =>
              dispatch(editorSettingsActions.setTerminalMinimized(false))
            }
            className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white button-main disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-64 border-t border-color flex flex-col justify-between">
      <div className="p-1 border-b border-color flex justify-between h-8">
        <div className="flex items-center justify-center ml-1 highlight-color">
          <Code className="w-4 h-4" />
        </div>
        <button
          onClick={() =>
            dispatch(editorSettingsActions.setTerminalMinimized(true))
          }
          className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white button-main disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
      <Scrollbar
        style={{ height: 250 }}
        className="w-full border-b border-color h-full text-sm text-white"
      >
        <div className="p-1 text-white">
          {messages.map((m: string, i: number) => (
            <pre key={i}>{m}</pre>
          ))}
        </div>
      </Scrollbar>
      <div>
        {formError && <>{formError}</>}

        <form onSubmit={execute} className="flex p-1 h-8">
          <input
            type="text"
            name="command"
            value={message}
            onChange={(e: any) => setMessage(e.target.value)}
            placeholder="$"
            className="input-main text-sm px-3 py-1 rounded-md text-sm w-full focus:outline-none"
          />
          <button
            type="submit"
            className="button-main px-2 py-1 cursor-pointer focus:outline-none"
          >
            {isLoading ? (
              <LoaderIcon className="h-4 w-4" />
            ) : (
              <Check className="h-4 w-4" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default TerminalComponent;
