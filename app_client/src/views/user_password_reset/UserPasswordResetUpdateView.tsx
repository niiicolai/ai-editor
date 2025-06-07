import { HomeIcon, LoaderIcon, UserIcon } from "lucide-react";
import { useUpdateUserPasswordReset } from "../../hooks/useUserPasswordReset";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom";

function UserPasswordResetUpdateView() {
  const { _id } = useParams<{ _id: string }>();
  const navigate = useNavigate();
  const { mutateAsync, isPending, error } = useUpdateUserPasswordReset();
  const [formError, setFormError] = useState<string | null>(null);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const password = formData.get("password") as string;

    if (!_id) {
      setFormError("Invalid password reset link. Please try again.");
      return;
    }

    if (!password) {
      setFormError("Password is required.");
      return;
    }

    try {
      await mutateAsync({
        _id,
        password,
      });
      navigate("/user/login");
      setIsSent(true);
    } catch (err) {
      const message = JSON.parse((err as any)?.message).error;
      setFormError(message as string);
    }
  };

  if (!_id) {
    return (
      <div className="text-red-500 text-center">
        Invalid password reset link. Please try again.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white/90 rounded-2xl shadow-2xl p-10 backdrop-blur-md border border-gray-200">
        <div className="flex flex-col items-center">
          <div className="bg-cyan-700 rounded-full p-3 shadow-lg mb-4">
            <UserIcon className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900 drop-shadow-sm">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link
              to="/user/login"
              className="font-medium text-cyan-700 hover:text-cyan-600 transition duration-200"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>
        {isSent && (
          <div className="text-green-500 text-sm text-center mt-2">
            A password reset link has been sent to your email.
          </div>
        )}

        {!isSent && (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-xl shadow-sm bg-gray-50/80 p-6 space-y-4">
              <div data-testid="password-user-password-reset-input">
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
                data-testid="user-password-reset-update-error"
              >
                {formError || "An error occurred during signup"}
              </div>
            )}

            <div>
              <button
                data-testid="user-password-reset-update-button"
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
                {isPending ? "Creating Password Reset..." : "Reset Password"}
              </button>
            </div>
          </form>
        )}

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

export default UserPasswordResetUpdateView;
