import { useCreateUser } from "../../hooks/useUser";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

function UserCreateView() {
  const navigate = useNavigate();
  const { mutateAsync, isPending, error } = useCreateUser();
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
      navigate("/");
    } catch (err) {
      setFormError(err as string);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center main-bgg main-color py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold main-color">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm main-color">
            Or{" "}
            <Link
              to="/user/login"
              className="font-medium button-main"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px main-color">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none main-color rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username"
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none main-color rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none main-color rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          {(error || formError) && (
            <div className="text-red-500 text-sm text-center">
              {formError || "An error occurred during signup"}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isPending}
              className={`group button-main relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                isPending
                  ? "cursor-not-allowed"
                  : ""
              }`}
            >
              {isPending ? (
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </span>
              ) : null}
              {isPending ? "Creating account..." : "Create account"}
            </button>
          </div>
        </form>

        <Link
          to="/"
          className="font-medium button-main w-24 mx-auto block text-center"
        >
          Home
        </Link>
      </div>
    </div>
  );
}

export default UserCreateView;
