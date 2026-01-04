"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { api } from "@/lib/api";
import { getStoredToken, persistAuth } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      router.replace("/dashboard");
    }
  }, [router]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data } = await api.post("/users/login", { email, password });
      persistAuth(data.access_token, data.role);
      router.replace("/dashboard");
    } catch (err) {
      const axiosError = err as AxiosError<{ detail?: string }>;
      if (!axiosError.response) {
        setError("Cannot reach the server. Confirm the FastAPI service is running.");
      } else if (axiosError.response.status === 401) {
        setError("Incorrect email or password. Please try again.");
      } else {
        setError(axiosError.response.data?.detail ?? "Login failed. Try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="card w-full max-w-md space-y-8 p-8">
        <div className="space-y-2 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-neutral-400">Examynex</p>
          <h1 className="text-3xl font-semibold text-neutral-900">Sign in</h1>
          <p className="text-sm text-neutral-500">Use the credentials provided by your administrator.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block space-y-2 text-sm text-neutral-600">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="input-field"
              placeholder="admin@examynex.com"
            />
          </label>

          <label className="block space-y-2 text-sm text-neutral-600">
            Password
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="input-field"
              placeholder="••••••••"
            />
          </label>

          {error && (
            <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
          )}

          <button type="submit" className="primary-btn w-full" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
