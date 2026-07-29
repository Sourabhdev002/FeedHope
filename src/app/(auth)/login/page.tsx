"use client";

import { useState } from "react";
import { signIn } from "@/features/auth/infrastructure/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePostHog } from "posthog-js/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FormCard } from "@/components/ui/FormCard";
import { ErrorBanner } from "@/components/ui/ErrorBanner";

export default function LoginPage() {
  const router = useRouter();
  const posthog = usePostHog();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error: signInError } = await signIn.email({
        email,
        password,
      });

      if (signInError) {
        posthog.capture("login_failed", { reason: signInError.message });
        setError(signInError.message || "Invalid credentials");
        return;
      }

      posthog.identify(data?.user?.id);
      posthog.capture("login_success", { method: "email" });
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-violet-50 p-4">
      <div className="w-full max-w-md">
        {/* Wordmark */}
        <div className="text-center mb-8">
          <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-emerald-500 bg-clip-text text-transparent">
            FeedHope
          </span>
          <p className="text-sm text-gray-400 mt-1">Your personal health companion</p>
        </div>

        <FormCard>
          <div className="px-5 py-6 sm:px-8 sm:py-8">
            <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">
              Welcome back
            </h1>

            {error && <ErrorBanner className="mb-5">{error}</ErrorBanner>}

            <form onSubmit={handleLogin} className="space-y-5">
              <Input
                label="Email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                label="Password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                isLoading={loading}
              >
                {loading ? "Signing in…" : "Sign In"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-violet-600 font-medium hover:text-violet-700 hover:underline underline-offset-2 transition-colors"
              >
                Create one
              </Link>
            </p>
          </div>
        </FormCard>
      </div>
    </div>
  );
}
