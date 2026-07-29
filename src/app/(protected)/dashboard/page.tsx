import { auth } from "@/features/auth/infrastructure/better-auth";
import { prisma } from "@/infrastructure/db/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LogoutButton } from "@/features/auth/presentation/LogoutButton";
import { Greeting } from "@/features/dashboard/presentation/Greeting";
import { TrackerGrid } from "@/features/daily-checkin/presentation/TrackerGrid";
import { HabitTracker } from "@/features/daily-checkin/presentation/HabitTracker";
import { DashboardTracker } from "@/features/dashboard/presentation/DashboardTracker";
import { BottomNav } from "@/components/BottomNav";
import { getWeeklyProgress } from "@/features/progress/application/get-weekly-progress";
import { Quote, Flame, BarChart2, ChevronRight } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const [healthProfile, plan] = await Promise.all([
    prisma.healthProfile.findUnique({
      where: { userId: session.user.id },
    }),
    prisma.healthPlan.findFirst({
      where: { userId: session.user.id, isActive: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  if (!healthProfile) redirect("/onboarding");

  if (!plan) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/60 max-w-sm text-center">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Plan Generation Failed</h2>
          <p className="text-gray-500 mb-6 text-sm">
            We saved your profile, but we encountered an error generating your health plan. Please contact support.
          </p>
          <LogoutButton />
        </div>
      </div>
    );
  }

  // Determine today's date in UTC (matching the logic in actions.ts)
  const now = new Date();
  const today = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));

  const [dailyCheckIn, progressSummary] = await Promise.all([
    prisma.dailyCheckIn.findUnique({
      where: {
        healthPlanId_checkInDate: {
          healthPlanId: plan.id,
          checkInDate: today,
        },
      },
    }),
    getWeeklyProgress(session.user.id, plan),
  ]);

  const allHabits = plan.habitChecklist ? (JSON.parse(plan.habitChecklist) as string[]) : [];
  const completedHabits = dailyCheckIn?.completedHabits ? (JSON.parse(dailyCheckIn.completedHabits) as string[]) : [];

  const firstName = session.user.name.split(" ")[0];

  const targetDailyExercise = plan.weeklyExerciseMins ? Math.round(plan.weeklyExerciseMins / 7) : 30;

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 pb-24">
      <DashboardTracker />
      <div className="max-w-md mx-auto px-6 py-8">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <Greeting name={firstName} />
          <LogoutButton />
        </div>

        {/* Interactive Trackers */}
        <TrackerGrid 
          targets={{
            waterLitres: plan.dailyWaterLitres,
            steps: plan.dailyStepTarget,
            sleepHours: plan.sleepTargetHours,
            exerciseMins: targetDailyExercise
          }}
          currentProgress={{
            waterLitres: dailyCheckIn?.waterIntakeLitres || 0,
            steps: dailyCheckIn?.stepsCount || 0,
            sleepHours: dailyCheckIn?.sleepHours || 0,
            exerciseMins: dailyCheckIn?.exerciseMins || 0,
          }}
        />

        {/* Interactive Habits */}
        <HabitTracker 
          allHabits={allHabits.length > 0 ? allHabits : ["Drink Water", "Walk", "Stretch", "Sleep Before 11 PM"]}
          completedHabits={completedHabits}
        />

        {/* Extras Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white relative overflow-hidden shadow-lg shadow-indigo-200">
            <Quote className="w-10 h-10 text-white/20 absolute -right-2 -bottom-2" />
            <h3 className="font-bold text-lg mb-2">Daily Motivation</h3>
            <p className="text-sm text-indigo-50 font-medium">Small steps every day lead to big results.</p>
          </div>
          
          <div className="space-y-4">
            {/* Habit completion — links to Progress page */}
            <Link
              href="/dashboard/progress"
              className="bg-white p-5 rounded-3xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] flex items-center justify-between group hover:shadow-md transition-shadow"
            >
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Habits</p>
                <p className="font-bold text-xl">
                  {progressSummary ? `${progressSummary.habitCompletionPct}%` : "—"}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <BarChart2 className="w-7 h-7 text-indigo-400" />
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-400 transition-colors" />
              </div>
            </Link>
            
            {/* Active days this week */}
            <div className="bg-white p-5 rounded-3xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Active Days</p>
                <p className="font-bold text-xl">
                  {progressSummary ? `${progressSummary.activeDays} / 7` : "0 / 7"}
                </p>
              </div>
              <Flame className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>

      </div>

      <BottomNav />
    </div>
  );
}
