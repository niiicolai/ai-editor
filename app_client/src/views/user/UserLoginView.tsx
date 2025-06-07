import { HomeIcon, LoaderIcon, UserIcon } from "lucide-react";
import { useLoginUser } from "../../hooks/useUser";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

function UserLoginView() {
  const navigate = useNavigate();
  const { mutateAsync, isPending, error } = useLoginUser();
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    try {
      await mutateAsync({
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      });
      navigate("/user");
    } catch (err) {
      setFormError("Invalid email or password");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white/90 rounded-2xl shadow-2xl p-10 backdrop-blur-md border border-gray-200">
        <div className="flex flex-col items-center">
          <div className="bg-cyan-700 rounded-full p-3 shadow-lg mb-4">
            <UserIcon className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900 drop-shadow-sm">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link
              to="/user/signup"
              className="font-medium text-cyan-700 hover:text-cyan-600 transition duration-200"
            >
              Create a new account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-xl shadow-sm bg-gray-50/80 p-6 space-y-4">
            <div data-testid="email-login-input">
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
                required
                className="appearance-none rounded-lg block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-700 focus:border-cyan-700 sm:text-sm transition"
                placeholder="Email address"
              />
            </div>
            <div data-testid="password-login-input">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-lg block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-700 focus:border-cyan-700 sm:text-sm transition"
                placeholder="Password"
              />
            </div>
          </div>

          {(error || formError) && (
            <div
              className="text-red-500 text-sm text-center mt-2"
              data-testid="login-error"
            >
              {formError || "An error occurred during login"}
            </div>
          )}

          <div>
            <button
              data-testid="login-button"
              type="submit"
              disabled={isPending}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-semibold rounded-lg text-white shadow-lg transition duration-200 ${
                isPending
                  ? "bg-cyan-700 cursor-not-allowed"
                  : "bg-cyan-700 hover:bg-cyan-600"
              }`}
            >
              {isPending ? (
                <LoaderIcon className="animate-spin h-5 w-5 mr-3 text-white" />
              ) : null}
              {isPending ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>

        <Link
          to="/user/password-reset"
          className="font-medium text-cyan-700 hover:text-cyan-600 text-center w-full mx-auto block transition duration-200"
        >
          Forgot your password?
        </Link>

        <Link
          to="/"
          className="font-medium text-cyan-700 hover:text-cyan-600 text-center w-full mx-auto block mt-4 transition duration-200"
        >
          <span className="inline-flex items-center gap-1">
            <HomeIcon className="h-5 w-5" />
            Home
          </span>
        </Link>
      </div>
    </div>
  );
}

export default UserLoginView;
