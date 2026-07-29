"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function SuccessStep() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center text-center py-8 px-4">
      {/* Animated checkmark */}
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mb-6 shadow-lg">
        <span aria-hidden="true" className="text-5xl">✓</span>
        <span className="sr-only">Success checkmark</span>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-3">
        Profile Complete!{" "}
        <span aria-hidden="true">🎉</span>
        <span className="sr-only">(celebration)</span>
      </h1>
      <p className="text-base text-gray-500 max-w-sm mb-8">
        Your health profile has been saved. You&apos;re all set to start your
        journey with FeedHope.
      </p>

      <div className="w-full max-w-sm bg-emerald-50 border border-emerald-200 rounded-2xl p-5 mb-8 text-left space-y-2">
        <p className="text-sm font-semibold text-emerald-800">What&apos;s next?</p>
        {[
          "View your personalised dashboard",
          "Explore health plan recommendations",
          "Start your first daily check-in",
        ].map((item) => (
          <div key={item} className="flex items-start gap-2">
            <span aria-hidden="true" className="text-emerald-500 mt-0.5">→</span>
            <span className="text-sm text-emerald-700">{item}</span>
          </div>
        ))}
      </div>

      <Button onClick={() => router.push("/dashboard")} fullWidth>
        Go to Dashboard →
      </Button>
    </div>
  );
}
