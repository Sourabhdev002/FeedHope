"use client";

import { useOptimistic, useTransition } from "react";
import { toggleHabitAction } from "@/features/daily-checkin/application/actions";
import { Flame, Check } from "lucide-react";
import { usePostHog } from "posthog-js/react";

interface HabitTrackerProps {
  allHabits: string[];
  completedHabits: string[];
}

export function HabitTracker({ allHabits, completedHabits }: HabitTrackerProps) {
  const [isPending, startTransition] = useTransition();
  const posthog = usePostHog();

  const [optimisticCompleted, addOptimisticCompleted] = useOptimistic(
    completedHabits,
    (state: string[], newHabit: string) => {
      if (state.includes(newHabit)) {
        return state.filter((h) => h !== newHabit);
      }
      return [...state, newHabit];
    }
  );

  const handleToggle = (habit: string) => {
    const willBeChecked = !optimisticCompleted.includes(habit);
    if (willBeChecked) {
      posthog.capture("habit_completed", { habit_name: habit });
    }
    
    startTransition(async () => {
      addOptimisticCompleted(habit);
      await toggleHabitAction(habit, willBeChecked);
    });
  };

  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Flame className="w-5 h-5 text-rose-500" />
        Today&apos;s Habits
      </h2>
      <div className="bg-white rounded-3xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] p-6 space-y-4">
        {allHabits.map((habit, idx) => {
          const isChecked = optimisticCompleted.includes(habit);
          return (
            <label
              key={idx}
              className={`flex items-center gap-4 cursor-pointer group transition-all duration-200 ${
                isPending ? "opacity-70 pointer-events-none" : ""
              }`}
            >
              <input
                type="checkbox"
                className="hidden"
                checked={isChecked}
                onChange={() => handleToggle(habit)}
              />
              <div
                className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${
                  isChecked
                    ? "bg-indigo-500 border-indigo-500"
                    : "border-gray-300 group-hover:border-indigo-400 bg-transparent"
                }`}
              >
                {isChecked && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
              </div>
              <span
                className={`font-medium text-lg transition-colors ${
                  isChecked ? "text-gray-400 line-through" : "text-gray-700"
                }`}
              >
                {habit}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
