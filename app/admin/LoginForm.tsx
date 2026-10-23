
"use client";

import { useState } from "react";
import Link from "next/link";
import { login } from "../actions";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await login(username, password);

      if (res.success) {
        window.location.reload();
      } else {
        setError(res.error || "Login failed");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sand-50 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-ocean-900 mb-6 text-center">
          Admin Login
        </h1>

        {error && (
          <div
            role="alert"
            className="mb-4 text-red-500 bg-red-50 p-3 rounded-lg text-sm"
          >
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Username
            </label>

            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-turquoise-500"
              required
              maxLength={100}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-turquoise-500"
              required
              maxLength={1024}
            />

            <div className="text-right mt-2">
              <Link
                href="/admin/forgot-password"
                className="text-sm font-semibold text-turquoise-700 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-turquoise-500 hover:bg-turquoise-600 disabled:opacity-60 text-white font-bold py-3 rounded-lg mt-4 transition-colors"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
}
