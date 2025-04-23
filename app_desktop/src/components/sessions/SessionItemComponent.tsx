import LoaderIcon from "../../icons/LoaderIcon";
import { useDestroyUserAgentSession } from "../../hooks/useUserAgentSession";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setSessionId } from "../../features/userAgentSession";
import { UserAgentSessionType } from "../../types/userAgentSessionType";

interface SessionItemComponentProps {
    session: UserAgentSessionType;
    sessionId: string | null;
}

function SessionItemComponent(props: SessionItemComponentProps) {
  const { mutateAsync, isPending, error } = useDestroyUserAgentSession();
  const [formError, setFormError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const session = props.session;

  const handleDestroy = async (_id: string) => {
    try {
      await mutateAsync(_id);
      if (session._id == _id) {
        dispatch(setSessionId(null));
      }
    } catch (err) {
      setFormError(err as string);
    }
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
      className={`flex ${
        props.sessionId === session._id
          ? "bg-gray-700 text-indigo-100"
          : "text-indigo-100"
      }`}
      key={session._id}
    >
      <button
        onClick={() => dispatch(setSessionId(session._id))}
        className={`flex-1 overflow-hidden truncate p-2 text-left flex items-center space-x-3 cursor-pointer hover:bg-gray-700`}
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">
            {session.title || "Untitled Session"}
          </p>
          <p className="text-xs text-gray-200 truncate">
            {new Date(session.created_at).toLocaleString()}
          </p>
        </div>
      </button>
      <button
        key={session._id}
        onClick={() => {
          handleDestroy(session._id);
        }}
        className={`px-4 py-3 text-left flex items-center space-x-3 hover:bg-gray-700 cursor-pointer`}
      >
        {isPending ? (
            <LoaderIcon w="w-4" h="h-4" />
        ) : (
            <svg
            className="h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        )}
      </button>
    </div>
  );
}

export default SessionItemComponent;
