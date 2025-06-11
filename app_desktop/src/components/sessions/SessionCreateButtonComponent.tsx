import { LoaderIcon, PlusIcon } from "lucide-react";
import { useCreateUserAgentSession } from "../../hooks/useUserAgentSession";
import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  clearMessages,
  setOperation,
  setSessionId,
} from "../../features/userAgentSession";

function SessionCreateButtonComponent() {
  const { mutateAsync, isPending, error } = useCreateUserAgentSession();
  const [formError, setFormError] = useState<string | null>(null);
  const dispatch = useDispatch();

  const handleCreate = async () => {
    try {
      const session = await mutateAsync({ title: new Date().toString() });
      dispatch(setSessionId(session._id));
      dispatch(clearMessages());
      dispatch(setOperation(null));
    } catch (err) {
      setFormError(err as string);
    }
  };

  return (
    <>
      <button
        data-testid="editor-user-sessions-create-button"
        onClick={handleCreate}
        disabled={isPending}
        className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm button-main disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending 
        ? <LoaderIcon className="w-4 h-4" />
        : <PlusIcon className="w-4 h-4" />
        }
      </button>
      
      {(error || formError) && (
        <div className="px-4 py-2 bg-red-50 border-b border-red-200">
          <div className="flex items-center">
            <p className="text-xs text-red-700">
              {error?.message || formError}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default SessionCreateButtonComponent;
