import { useDestroyUser, useGetUser } from "../../hooks/useUser";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import RestrictedComponent from "../../components/RestrictedComponent";
import { LoaderIcon, Trash } from "lucide-react";

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

    if (formData.get("username") !== data?.username) {
      setFormError("The given username didn't match your current username");
      return;
    }

    try {
      await mutateAsync();
      navigate("/");
    } catch (err) {
      setFormError(err as string);
    }
  };

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

  if (getUserError) {
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
          <div className="max-w-md w-full space-y-8 bg-white/90 rounded-2xl shadow-2xl p-10 backdrop-blur-md border border-gray-200">
            <div className="flex flex-col items-center">
              <div className="bg-red-600 rounded-full p-3 shadow-lg mb-4">
                <Trash className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-center text-3xl font-extrabold text-gray-900 drop-shadow-sm">
                Delete Account
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                This action cannot be undone. This will permanently delete your
                account and remove all associated data.
              </p>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="rounded-xl shadow-sm bg-gray-50/80 p-6 space-y-4">
                <div data-testid="username-destroy-input">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Confirm Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    className="appearance-none rounded-lg block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 sm:text-sm transition"
                    placeholder="Enter your username to confirm"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Please type your username ({data?.username}) to confirm
                    deletion
                  </p>
                </div>
              </div>
              {(error || formError) && (
                <div className="text-red-500 text-sm text-center mt-2" data-testid="destroy-error">
                  {formError || "An error occurred while deleting your account"}
                </div>
              )}
              <div className="flex items-center justify-between">
                <Link
                  to="/user"
                  className="text-sm font-medium text-red-600 hover:text-red-500 transition duration-200"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isPending}
                  data-testid="destroy-submit-button"
                  className={`group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white shadow-lg transition duration-200 ${
                    isPending
                      ? "bg-red-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {isPending ? (
                    <LoaderIcon className="animate-spin h-5 w-5 mr-3 text-white" />
                  ) : null}
                  {isPending ? "Deleting..." : "Delete Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    />
  );
}

export default UserDestroyView;
