import { Check, ChevronUp, Code, LoaderIcon, Plus, XIcon } from "lucide-react";
import { useTerminal } from "../../hooks/useTerminal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { setTerminalMinimized } from "../../features/terminalSettings";
import { TerminalType } from "../../types/terminalType";
import { useTerminals } from "../../hooks/useTerminals";
import { useEffect, useRef } from "react";
import Scrollbar from "react-scrollbars-custom";

function TerminalComponent() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { terminals, isActiveTab, newTab, removeTab, viewTab } = useTerminals();
  const { minimized, disabled } = useSelector((state: RootState) => state.terminalSettings);
  const { selectedIndex } = useSelector((state: RootState) => state.terminals);
  const { execute, isLoading, formError, message, setMessage } = useTerminal();
  const dispatch = useDispatch();
  const selected = selectedIndex > -1 ? terminals[selectedIndex] : null;

  const handleExecute = (e:any) => {
    execute(e, terminals[selectedIndex])
  }

  // Scroll to bottom when new messages arrive
    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [selected?.messages]);

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
            onClick={() => dispatch(setTerminalMinimized(false))}
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
      <div className="border-b border-color flex justify-between h-8">
        <div className="flex items-center justify-left highlight-color">
          {terminals.map((t: TerminalType, i:number) => (
            <div key={t.id} className={`tab border-r flex ${
                isActiveTab(t) ? 'tab-active' : ''
              }`}>
              <button 
              onClick={() => viewTab(t)}
              className={`overflow-hidden truncate cursor-pointer text-sm px-3 py-1 view-tab-button`}>
                T: {i.toString()}
              </button>
              <button 
              onClick={() => removeTab(t)}
              className={`overflow-hidden truncate cursor-pointer text-sm px-3 py-1 close-tab-button`}>
                <XIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => newTab()}
            className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white button-main disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
      {selectedIndex > -1 && (
        <>
          <Scrollbar
            style={{ height: 250 }}
            className="w-full border-b border-color h-full text-sm text-white"
          >
            <div className="p-1 text-white">
              {terminals[selectedIndex].messages.map((m: string, i: number) => (
                <pre key={i}>{m}</pre>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </Scrollbar>
          <div>
            {formError && <>{formError}</>}

            <form onSubmit={handleExecute} className="flex p-1 h-8">
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
        </>
      )}
    </div>
  );
}

export default TerminalComponent;
