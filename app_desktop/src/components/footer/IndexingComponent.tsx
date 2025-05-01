import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Clipboard, Loader2Icon } from "lucide-react";


export default function IndexingComponent() {
    const projectIndex = useSelector((state: RootState) => state.projectIndex);

  return (
    <>
        {projectIndex.meta && (
            <div className="flex justify-start items-center gap-1">
              {projectIndex.isLoading 
                ? <Loader2Icon className="w-3.5 h-3.5 animate-spin" />
                : <Clipboard className="w-3.5 h-3.5" />
                }
              <button
                className="text-xs button-main flex justify-between gap-1"
                onClick={() => console.log('not implemented')}
              >
                
                <span>Project Index</span>
              </button>
            </div>
          )}
    </>
  );
}