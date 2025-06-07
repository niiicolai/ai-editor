import { useUpdateUser, useGetUser } from "../../hooks/useUser";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import RestrictedComponent from "../../components/RestrictedComponent";
import { LoaderIcon, UserIcon } from "lucide-react";

function UserEditView() {
  const navigate = useNavigate();
  const { data, isLoading, error: getUserError } = useGetUser();
  const { mutateAsync, isPending, error } = useUpdateUser();
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    try {
      await mutateAsync({
        username: formData.get("username") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      });
      navigate("/user");
    } catch (err) {
      setFormError(err as string);
    }
  };

  return (
    <RestrictedComponent
      slot={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8 bg-white/90 rounded-2xl shadow-2xl p-10 backdrop-blur-md border border-gray-200">
            <div className="flex flex-col items-center">
              <div className="bg-cyan-700 rounded-full p-3 shadow-lg mb-4">
                <UserIcon className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-center text-3xl font-extrabold text-gray-900 drop-shadow-sm">
                Edit your profile
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Update your account information
              </p>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="rounded-xl shadow-sm bg-gray-50/80 p-6 space-y-4">
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={data?.username}
                    required
                    className="appearance-none rounded-lg block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-700 focus:border-cyan-700 sm:text-sm transition"
                    placeholder="Username"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={data?.email}
                    required
                    className="appearance-none rounded-lg block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-700 focus:border-cyan-700 sm:text-sm transition"
                    placeholder="Email address"
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    New Password (leave blank to keep current)
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    className="appearance-none rounded-lg block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-700 focus:border-cyan-700 sm:text-sm transition"
                    placeholder="New Password (optional)"
                  />
                </div>
              </div>

              {(error || getUserError || formError) && (
                <div className="text-red-500 text-sm text-center mt-2">
                  {(getUserError as unknown as string) ||
                    formError ||
                    "An error occurred while updating your profile"}
                </div>
              )}

              <div className="flex items-center justify-between">
                <Link
                  to="/user"
                  className="text-sm font-medium text-cyan-700 hover:text-cyan-600 transition duration-200"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isPending}
                  className={`group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white shadow-lg transition duration-200 ${
                    isPending
                      ? "bg-cyan-700 cursor-not-allowed"
                      : "bg-cyan-700 hover:bg-cyan-600"
                  }`}
                >
                  {isLoading ? "Loading user..." : ""}
                  {isPending ? (
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <LoaderIcon className="h-5 w-5 animate-spin" />
                    </span>
                  ) : null}
                  {isPending ? (
                    <LoaderIcon className="h-5 w-5 animate-spin" />
                  ) : (
                    "Update Profile"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    />
  );
}

export default UserEditView;
