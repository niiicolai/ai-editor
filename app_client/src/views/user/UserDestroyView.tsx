import { useDestroyUser, useGetUser } from "../../hooks/useUser"
import { useState } from "react"
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import RestrictedComponent from "../../components/RestrictedComponent";

function UserDestroyView() {
    const navigate = useNavigate();
    const { data, isLoading, error: getUserError } = useGetUser();
    const { mutateAsync, isPending, error } = useDestroyUser();
    const [formError, setFormError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormError(null);
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        if (formData.get('username') !== data?.username) {
            setFormError("The given username didn't match your current username");
            return;
        }

        try {
            await mutateAsync();
            navigate('/');
        } catch (err) {
            setFormError(err as string);
        }
    }

    if (isLoading) {
        return (
            <RestrictedComponent slot={
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            } />
        );
    }

    if (getUserError) {
        return (
            <RestrictedComponent slot={
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-red-500 text-center">
                        <p className="text-lg">Error loading profile</p>
                        <p className="text-sm mt-2">Please try again later</p>
                    </div>
                </div>
            } />
        );
    }

    return (
        <RestrictedComponent slot={
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md mx-auto">
                    <div className="bg-white shadow sm:rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Delete Account
                            </h3>
                            <div className="mt-2 max-w-xl text-sm text-gray-500">
                                <p>
                                    This action cannot be undone. This will permanently delete your account and remove all associated data.
                                </p>
                            </div>
                            <form className="mt-5 space-y-6" onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                        Confirm Username
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="text"
                                            name="username"
                                            id="username"
                                            className="p-3 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                            placeholder="Enter your username to confirm"
                                        />
                                    </div>
                                    <p className="mt-2 text-sm text-gray-500">
                                        Please type your username ({data?.username}) to confirm deletion
                                    </p>
                                </div>

                                {(error || formError) && (
                                    <div className="text-red-500 text-sm">
                                        {formError || "An error occurred while deleting your account"}
                                    </div>
                                )}

                                <div className="flex justify-end space-x-3">
                                    <Link
                                        to="/user"
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={isPending}
                                        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${isPending
                                            ? 'bg-red-400 cursor-not-allowed'
                                            : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                                            }`}
                                    >
                                        {isPending ? (
                                            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            </span>
                                        ) : null}
                                        {isPending ? 'Deleting...' : 'Delete Account'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        } />
    );
}

export default UserDestroyView;
