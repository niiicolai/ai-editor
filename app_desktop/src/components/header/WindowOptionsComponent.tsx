import { XIcon, Minus, Copy } from "lucide-react";
import { useWindow } from "../../hooks/useWindow";

function WindowOptionsComponent() {
  const windowOpt = useWindow();

  return (
    <>
      <button
        title="Minimize"
        onClick={() => windowOpt.minimizeWindow()}
        className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm button-main disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Minus className="h-3 w-3" />
      </button>
      <button
        title="Restore"
        onClick={() => windowOpt.restoreWindow()}
        className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm button-main disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Copy className="h-3 w-3" />
      </button>
      <button
        title="Close"
        onClick={() => windowOpt.closeWindow()}
        className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm button-main disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <XIcon className="h-3 w-3" />
      </button>
    </>
  );
}

export default WindowOptionsComponent;
