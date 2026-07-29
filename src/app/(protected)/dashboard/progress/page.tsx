import { auth } from "@/features/auth/infrastructure/better-auth";
import { prisma } from "@/infrastructure/db/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getWeeklyProgress } from "@/features/progress/application/get-weekly-progress";
import { ProgressDashboard } from "@/features/progress/presentation/ProgressDashboard";
import { ProgressTracker } from "@/features/progress/presentation/ProgressTracker";
import { BottomNav } from "@/components/BottomNav";
import { LogoutButton } from "@/features/auth/presentation/LogoutButton";
import { BarChart2 } from "lucide-react";

export const metadata = {
  title: "Progress – FeedHope",
  description: "Your weekly health progress summary and personal bests.",
};

export default async function ProgressPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const healthProfile = await prisma.healthProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (!healthProfile) redirect("/onboarding");

  const summary = await getWeeklyProgress(session.user.id);

  const firstName = session.user.name.split(" ")[0];

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 pb-24">
      <ProgressTracker />
      <div className="max-w-md mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              {firstName}&apos;s Insights
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Your health at a glance
            </p>
          </div>
          <LogoutButton />
        </div>

        {/* Main content */}
        {summary ? (
          <ProgressDashboard summary={summary} />
        ) : (
          <div className="bg-white rounded-3xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] p-10 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center">
              <BarChart2 className="w-8 h-8 text-indigo-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg mb-1">
                No data yet
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Start logging your daily metrics on the <strong>Today</strong>{" "}
                tab. Your progress insights will appear here once you have at
                least one check-in.
              </p>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
