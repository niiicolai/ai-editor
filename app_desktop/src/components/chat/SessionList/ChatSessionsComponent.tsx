import { useGetUserAgentSessions, useCreateUserAgentSession, useDestroyUserAgentSession } from "../../../hooks/useUserAgentSession"
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { UserAgentSessionType } from "../../../types/userAgentSessionType";
import { ChevronLeft, ChevronRight, ChevronUp, Computer } from "lucide-react";

interface ChatShowComponentProps {
    setSelectedSession: Dispatch<SetStateAction<UserAgentSessionType | null>>;
    setShowSessions: Dispatch<SetStateAction<boolean>>;
    selectedSession: UserAgentSessionType | null;
    setIsHidden: (state: boolean) => void;
}

function ChatSessionsComponent(props: ChatShowComponentProps) {
    const { setSelectedSession, setShowSessions, selectedSession, setIsHidden } = props;
    const limit = 10;
    const [page, setPage] = useState(1);
    const { data, isLoading: isLoadingSessions, error: errorSessions } = useGetUserAgentSessions(page, limit);
    const { mutateAsync, isPending: isPendingCreate, error: errorCreate } = useCreateUserAgentSession();
    const { mutateAsync: destroySessionAsync, isPending: isPendingDestroy, error: errorDestroy } = useDestroyUserAgentSession();
    const sessions = data?.sessions;
    const [formError, setFormError] = useState<string | null>(null);

    const handleCreate = async () => {
        try {
            const session = await mutateAsync({ title: new Date().toString() });
            setSelectedSession(session);
            setShowSessions(false);
        } catch (err) {
            setFormError(err as string);
        }
    }

    const handleDestroy = async (_id: string) => {
        try {
            await destroySessionAsync(_id);
            if (selectedSession?._id == _id) {
                setSelectedSession(null);
                setShowSessions(true);
            }
        } catch (err) {
            setFormError(err as string);
        }
    }

    useEffect(() => {
        if (sessions && sessions.length > 0 && !selectedSession) {
            setSelectedSession(sessions[0]);
        }
    }, [sessions, selectedSession]);

    const nextPage = () => { if (page < (data?.pages || 0)) setPage(page + 1); }
    const prevPage = () => { if (page > 1) setPage(page - 1); }

    if (isLoadingSessions) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (errorSessions) {
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
        <div className="w-96 main-bgg text-white bottom-0 border-r border-color bg-gray-50 flex flex-col flex-1">
            {/* Sessions Header */}
            <div className="p-3 border-b border-color h-12 flex items-center justify-between w-full">
                <div className="flex items-center justify-between w-full">
                    <h2 className="text-sm font-bold highlight-color"><Computer className="w-4 h-4" /></h2>
                    <div className="flex gap-1">
                        <button
                            onClick={() => setIsHidden(true)}
                            className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white button-main disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className='w-4 h-4 hidden lg:block' />
                            <ChevronUp className='w-4 h-4 block lg:hidden' />
                        </button>
                        <button
                            onClick={handleCreate}
                            disabled={isPendingCreate}
                            className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm button-main disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPendingCreate ? (
                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {(errorCreate || formError) && (
                <div className="px-4 py-2 bg-red-50 border-b border-red-200">
                    <div className="flex items-center">
                        <svg className="h-4 w-4 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <p className="text-xs text-red-700">
                            {errorCreate?.message || formError}
                        </p>
                    </div>
                </div>
            )}

            {/* Sessions List */}
            <div className="flex-1 overflow-y-auto">
                {sessions?.map((session) => (
                    <div className="flex" key={session._id}>
                        <button
                            onClick={() => {
                                setSelectedSession(session)
                                setShowSessions(false);
                            }}
                            className={`flex-1 overflow-hidden truncate p-2 text-left flex items-center space-x-3 cursor-pointer ${selectedSession?._id === session._id
                                ? 'main-highlight text-indigo-100'
                                : 'text-indigo-100 hover:bg-gray-700'
                                }`}
                        >
                            <div className="flex-shrink-0">
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${selectedSession?._id === session._id
                                    ? 'highlight-bgg'
                                    : 'bg-black'
                                    }`}>
                                    <span className={`font-medium ${selectedSession?._id === session._id
                                        ? 'text-white'
                                        : 'text-gray-200'
                                        }`}>
                                        {session.title?.charAt(0) || 'C'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                    {session.title || 'Untitled Session'}
                                </p>
                                <p className="text-xs text-gray-200 truncate">
                                    {new Date(session.created_at).toLocaleString()}
                                </p>
                            </div>
                        </button>
                        <button
                            key={session._id}
                            onClick={() => {
                                handleDestroy(session._id)
                            }}
                            className={`px-4 py-3 text-left flex items-center space-x-3 hover:bg-gray-700 cursor-pointer`}
                        >
                            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>

            {/* Sessions Pagination */}
            {data && data.pages > 1 && (
                <div className="px-4 py-3 border-t border-color main-bgg h-12">
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
                            onClick={nextPage}
                            disabled={page >= data.pages}
                            className="cursor-pointer inline-flex items-center px-2 py-1 text-xs font-medium rounded-md button-main disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {sessions?.length === 0 && (
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

export default ChatSessionsComponent;
