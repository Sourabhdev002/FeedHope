"use client";

import { useState } from "react";
import { signUp } from "@/features/auth/infrastructure/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePostHog } from "posthog-js/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FormCard } from "@/components/ui/FormCard";
import { ErrorBanner } from "@/components/ui/ErrorBanner";

export default function RegisterPage() {
  const router = useRouter();
  const posthog = usePostHog();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error: signUpError } = await signUp.email({
        email,
        password,
        name: `${firstName} ${lastName}`.trim(),
        firstName,
        lastName,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      if (signUpError) {
        posthog.capture("login_failed", { reason: signUpError.message });
        setError(signUpError.message || "Failed to register");
        return;
      }

      posthog.identify(data?.user?.id);
      posthog.capture("user_registered", { provider: "email" });
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
          <p className="text-sm text-gray-400 mt-1">Start your health journey today</p>
        </div>

        <FormCard>
          <div className="px-5 py-6 sm:px-8 sm:py-8">
            <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">
              Create an account
            </h1>

            {error && <ErrorBanner className="mb-5">{error}</ErrorBanner>}

            <form onSubmit={handleRegister} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="First Name"
                  type="text"
                  required
                  autoComplete="given-name"
                  placeholder="Jane"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <Input
                  label="Last Name"
                  type="text"
                  required
                  autoComplete="family-name"
                  placeholder="Smith"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
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
                autoComplete="new-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                isLoading={loading}
              >
                {loading ? "Creating account…" : "Create Account"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-violet-600 font-medium hover:text-violet-700 hover:underline underline-offset-2 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </FormCard>
      </div>
    </div>
  );
}
