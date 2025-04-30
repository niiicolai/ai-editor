import { useGetUserAgentSessions } from "../../hooks/useUserAgentSession";
import { RootState } from "../../store";
import { useSelector } from "react-redux";
import { usePagination } from "../../hooks/usePagination";

import SessionItemComponent from "./SessionItemComponent";
import SessionCreateButtonComponent from "./SessionCreateButtonComponent";

function SessionsComponent() {
    const { page, nextPage, prevPage, limit } = usePagination(10);
    const { data, isLoading, error } = useGetUserAgentSessions(page, limit);
    const { sessionId } = useSelector((state: RootState) => state.userAgentSession);

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="text-red-500 text-center">
                    <p className="text-lg">Error loading sessions</p>
                    <p className="text-sm mt-2">Please try again later</p>
                </div>
            </div>
        );
    }

    return (
        <div className="main-bgg text-white bottom-0 border-r border-color bg-gray-50 flex flex-col flex-1">

            <div className="p-1 border-b border-color h-8 flex items-center justify-between w-full">
                <div className="flex items-center justify-end w-full">
                    <div className="flex gap-1">
                        <SessionCreateButtonComponent />
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {data?.sessions?.map((session) => (
                    <SessionItemComponent session={session} sessionId={sessionId} key={session._id} />
                ))}
            </div>

            {data && data.pages > 1 && (
                <div className="px-4 py-1 border-t border-color main-bgg h-8">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={prevPage}
                            disabled={page === 1}
                            className="cursor-pointer inline-flex items-center px-2 py-1 text-xs font-medium rounded-md button-main disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <span className="text-xs highlight-color">
                            Page {page} of {data.pages}
                        </span>
                        <button
                            onClick={() => nextPage(data?.pages)}
                            disabled={page >= data.pages}
                            className="cursor-pointer inline-flex items-center px-2 py-1 text-xs font-medium rounded-md button-main disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {data?.sessions?.length === 0 && (
                <div className="flex-1 flex items-center justify-center p-4">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-2">
                            <span className="text-xl">💬</span>
                        </div>
                        <h3 className="text-sm font-medium text-gray-900 mb-1">
                            No sessions yet
                        </h3>
                        <p className="text-xs text-gray-500">
                            Start a new chat session
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SessionsComponent;
