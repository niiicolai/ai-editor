import { useGetUser } from "../../hooks/useUser";
import CreditInfoComponent from "../../components/chat/ActiveChat/CreditInfoComponent";
import RestrictedComponent from "../../components/RestrictedComponent";
import { Link } from "react-router-dom";

function UserShowView() {
    const { data: user, isLoading, error } = useGetUser();

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col gap-12 items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                <Link to={"/"} className="inline-flex items-center px-4 py-2 border border-transparent text-xs font-medium rounded-md text-white button-main">To Editor</Link>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-500 text-center">
                    <p className="text-lg">Error loading profile</p>
                    <p className="text-sm mt-2">Please try again later</p>
                </div>
            </div>
        );
    }

    return (
        <RestrictedComponent slot={
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    Profile Information
                                </h3>
                                <div className="flex justify-start items-center gap-3">
                                    <Link
                                        to="/"
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        to="/user/edit"
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Edit Profile
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-gray-200">
                            <dl>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Username
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {user?.username}
                                    </dd>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Email address
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {user?.email}
                                    </dd>
                                </div>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500 flex flex-col justify-between">
                                        <p>Credit Balance</p>
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        <CreditInfoComponent progressOnly={false} />
                                        
                                        <div className="flex items-center justify-end mt-3 gap-3">
                                            <Link
                                                to="/products?category=credit"
                                                className="fle w-36 text-center items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Buy Credits</Link>
                                                <Link
                                                to="/checkouts?state=purchased"
                                                className="fle w-36 text-center items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">History</Link>
                                        </div>
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    <div className="mt-8 bg-white shadow sm:rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Account Management
                            </h3>
                            <div className="mt-5">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900">Change Password</h4>
                                            <p className="text-sm text-gray-500">Update your account password</p>
                                        </div>
                                        <Link
                                            to="/user/edit"
                                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            Change
                                        </Link>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900">Delete Account</h4>
                                            <p className="text-sm text-gray-500">Permanently delete your account</p>
                                        </div>
                                        <Link
                                            to="/user/delete"
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                        >
                                            Delete
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        } />
    );
}

export default UserShowView
