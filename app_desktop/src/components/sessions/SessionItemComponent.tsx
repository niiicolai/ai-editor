import { useDestroyUserAgentSession } from "../../hooks/useUserAgentSession";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { clearMessages, setOperation, setSessionId, setSessionTitle } from "../../features/userAgentSession";
import { UserAgentSessionType } from "../../types/userAgentSessionType";
import { XIcon, LoaderIcon } from "lucide-react";

function SessionItemComponent({
  session
}: {
  session: UserAgentSessionType;
}) {
  const { mutateAsync, isPending, error } = useDestroyUserAgentSession();
  const [formError, setFormError] = useState<string | null>(null);
  const dispatch = useDispatch();

  const handleDestroy = async (_id: string) => {
    try {
      await mutateAsync(_id);
      if (session._id == _id) {
        dispatch(setSessionId(null));
        dispatch(setSessionTitle(null));
        dispatch(clearMessages());
      }
    } catch (err) {
      setFormError(err as string);
    }
  };

  const handleSelect = async () => {
    dispatch(clearMessages());
    dispatch(setOperation(null));
    dispatch(setSessionId(session._id));
    dispatch(setSessionTitle(session.title));
  };

  if (formError || error) {
    return (
        <div className="flex-1 flex items-center justify-center">
            <div className="text-red-500 text-center">
                <p className="text-lg">Something went wrong</p>
                <p className="text-sm mt-2">{formError || (error instanceof Error ? error.message : error)}</p>
            </div>
        </div>
    );
}

  return (
    <div
      className={`flex`}
      key={session._id}
    >
      <button
        onClick={handleSelect}
        className={`flex-1 overflow-hidden truncate p-2 text-left flex items-center space-x-3 cursor-pointer hover:bg-gray-700`}
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate main-color">
            {session.title || "Untitled Session"}
          </p>
          <p className="text-xs main-color truncate">
            {new Date(session.created_at).toLocaleString()}
          </p>
        </div>
      </button>
      <button
        key={session._id}
        onClick={() => {
          handleDestroy(session._id);
        }}
        className={`px-4 py-3 text-left flex items-center space-x-3 button-main cursor-pointer`}
      >
        {isPending 
          ? <LoaderIcon className="w-4 h-4" />
          : <XIcon className="w-4 h-4" />
        }
      </button>
    </div>
  );
}

export default SessionItemComponent;
