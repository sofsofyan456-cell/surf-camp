
"use client";

import { useState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "../../actions";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const result = await requestPasswordReset(email);
      setMessage(result.message);
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
          Forgot Password?
        </h1>

        <p className="text-gray-600 text-sm mb-6 text-center">
          Enter your recovery email address to request a password reset link.
        </p>

        <label
          htmlFor="email"
          className="block text-sm font-semibold text-gray-700 mb-1"
        >
          Recovery email
        </label>

        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-turquoise-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-turquoise-500 hover:bg-turquoise-600 disabled:opacity-60 text-white font-bold py-3 rounded-lg mt-5 transition-colors"
        >
          {loading ? "Sending..." : "Send reset link"}
        </button>

        {message && (
          <p role="status" className="mt-4 text-sm text-gray-700 break-words">
            {message}
          </p>
        )}

        <p className="mt-6 text-center text-sm">
          <Link
            href="/admin"
            className="text-turquoise-700 hover:underline font-semibold"
          >
            Back to login
          </Link>
        </p>
      </form>
    </main>
  );
}
