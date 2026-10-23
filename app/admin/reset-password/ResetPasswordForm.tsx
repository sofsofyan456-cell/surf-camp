
"use client";

import { useState } from "react";
import Link from "next/link";
import { resetAdminPassword } from "../../actions";

export default function ResetPasswordForm({
  token,
}: {
  token: string;
}) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setSuccess(false);

    if (password !== confirmPassword) {
      setMessage("The passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const result = await resetAdminPassword(token, password);
      setSuccess(result.success);
      setMessage(
        result.success
          ? result.message || "Password reset successfully. You can now log in."
          : result.error || "Could not reset the password.",
      );
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-sand-50 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-ocean-900 mb-3 text-center">
          Reset Password
        </h1>

        <p className="text-gray-600 text-sm mb-6 text-center">
          Choose a new password for your administrator account.
        </p>

        <label
          htmlFor="password"
          className="block text-sm font-semibold text-gray-700 mb-1"
        >
          New password
        </label>

        <input
          id="password"
          type="password"
          autoComplete="new-password"
          minLength={12}
          maxLength={72}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-turquoise-500"
        />

        <p className="text-xs text-gray-500 mt-1 mb-4">
          Use 12–72 characters.
        </p>

        <label
          htmlFor="confirmPassword"
          className="block text-sm font-semibold text-gray-700 mb-1"
        >
          Confirm new password
        </label>

        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          minLength={12}
          maxLength={72}
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-turquoise-500"
        />

        <button
          type="submit"
          disabled={loading || !token}
          className="w-full bg-turquoise-500 hover:bg-turquoise-600 disabled:opacity-60 text-white font-bold py-3 rounded-lg mt-5 transition-colors"
        >
          {loading ? "Resetting..." : "Set new password"}
        </button>

        {message && (
          <p
            role="status"
            className={`mt-4 text-sm break-words ${
              success ? "text-green-700" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        {success && (
          <p className="mt-4 text-center text-sm">
            <Link
              href="/admin"
              className="text-turquoise-700 hover:underline font-semibold"
            >
              Go to login
            </Link>
          </p>
        )}
      </form>
    </main>
  );
}
