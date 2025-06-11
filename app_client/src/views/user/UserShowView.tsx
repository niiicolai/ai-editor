import { useGetUser } from "../../hooks/useUser";
import { Link } from "react-router-dom";
import CreditInfoComponent from "../../components/CreditInfoComponent";
import RestrictedComponent from "../../components/RestrictedComponent";
import { UserIcon } from "lucide-react";

function UserShowView() {
  const { data: user, isLoading, error } = useGetUser();

  if (isLoading) {
    return (
      <RestrictedComponent
        slot={
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        }
      />
    );
  }

  if (error) {
    return (
      <RestrictedComponent
        slot={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-red-500 text-center">
              <p className="text-lg">Error loading profile</p>
              <p className="text-sm mt-2">Please try again later</p>
            </div>
          </div>
        }
      />
    );
  }

  return (
    <RestrictedComponent
      slot={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl w-full space-y-8 bg-white/90 rounded-2xl shadow-2xl p-10 backdrop-blur-md border border-gray-200">
            <div className="flex flex-col items-center mb-8">
              <div className="bg-cyan-700 rounded-full p-3 shadow-lg mb-4">
                <UserIcon className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-center text-3xl font-extrabold text-gray-900 drop-shadow-sm">
                Profile Information
              </h2>
              <div className="flex gap-3 mt-2">
                <Link
                  to="/"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-cyan-700 hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition"
                >
                  Home
                </Link>
                <Link
                  to="/user/edit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-cyan-700 hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition"
                >
                  Edit Profile
                </Link>
              </div>
            </div>
            <div className="rounded-xl shadow-sm bg-gray-50/80 p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <div className="text-sm font-medium text-gray-500">
                  Username
                </div>
                <div className="sm:col-span-2 text-sm text-gray-900" data-testid="profile-username">
                  {user?.username}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <div className="text-sm font-medium text-gray-500">
                  Email address
                </div>
                <div className="sm:col-span-2 text-sm text-gray-900">
                  {user?.email}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
                <div className="text-sm font-medium text-gray-500">
                  Credit Balance
                </div>
                <div className="sm:col-span-2 text-sm text-gray-900">
                  <CreditInfoComponent />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
                <div className="text-sm font-medium text-gray-500">
                  Member Since
                </div>
                <div className="sm:col-span-2 text-sm text-gray-900">
                  {new Date(user?.created_at || "").toLocaleDateString()}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
                <div className="text-sm font-medium text-gray-500">
                  Updated On
                </div>
                <div className="sm:col-span-2 text-sm text-gray-900">
                  {new Date(user?.updated_at || "").toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="mt-8 rounded-xl shadow-sm bg-gray-50/80 p-6 space-y-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Account Management
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      Buy Credits
                    </h4>
                    <p className="text-sm text-gray-500">
                      Purchase additional credits for service usage
                    </p>
                  </div>
                  <Link
                    to="/products?category=credit"
                    className="w-36 text-center flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition"
                  >
                    Buy Credits
                  </Link>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      Usage History
                    </h4>
                    <p className="text-sm text-gray-500">
                      View your service usage and credit consumption
                    </p>
                  </div>
                  <Link
                    to="/usage"
                    className="w-36 text-center flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition"
                  >
                    View History
                  </Link>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      Checkout History
                    </h4>
                    <p className="text-sm text-gray-500">
                      View your past purchases and transactions
                    </p>
                  </div>
                  <Link
                    to="/checkouts?state=purchased"
                    className="w-36 text-center flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition"
                  >
                    View History
                  </Link>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      Change Password
                    </h4>
                    <p className="text-sm text-gray-500">
                      Update your account password
                    </p>
                  </div>
                  <Link
                    to="/user/edit"
                    className="w-36 text-center flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition"
                  >
                    Change
                  </Link>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      Delete Account
                    </h4>
                    <p className="text-sm text-gray-500">
                      Permanently delete your account
                    </p>
                  </div>
                  <Link
                    to="/user/delete"
                    className="w-36 text-center flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition"
                  >
                    Delete
                  </Link>
                </div>
              </div>
            </div>
            {user?.role === "admin" && (
              <div className="mt-8 rounded-xl shadow-sm bg-gray-50/80 p-6 space-y-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Admin Management
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        Transactions
                      </h4>
                      <p className="text-sm text-gray-500">
                        Inspect service transactions
                      </p>
                    </div>
                    <Link
                      to="/admin/transactions"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition"
                    >
                      View
                    </Link>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        Jobs
                      </h4>
                      <p className="text-sm text-gray-500">
                        Inspect service jobs
                      </p>
                    </div>
                    <Link
                      to="/admin/jobs"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition"
                    >
                      View
                    </Link>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        RAG Evaluation
                      </h4>
                      <p className="text-sm text-gray-500">Inspect samples</p>
                    </div>
                    <Link
                      to="/admin/samples"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      }
    />
  );
}

export default UserShowView;
