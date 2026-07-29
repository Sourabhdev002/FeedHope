"use client";

import { useOptimistic, useTransition } from "react";
import { updateDailyMetricAction } from "@/features/daily-checkin/application/actions";
import { Droplets, Footprints, Moon, Dumbbell, Target, Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import { usePostHog } from "posthog-js/react";

interface TrackerGridProps {
  targets: {
    waterLitres: number;
    steps: number;
    sleepHours: number;
    exerciseMins: number;
  };
  currentProgress: {
    waterLitres: number;
    steps: number;
    sleepHours: number;
    exerciseMins: number;
  };
}

export function TrackerGrid({ targets, currentProgress }: TrackerGridProps) {
  const [, startTransition] = useTransition();
  const posthog = usePostHog();

  // --- Helpers for Analytics ---
  const wasZero = 
    currentProgress.waterLitres === 0 && 
    currentProgress.steps === 0 && 
    currentProgress.sleepHours === 0 && 
    currentProgress.exerciseMins === 0;

  const trackIfStarted = (metric: string) => {
    if (wasZero) {
      posthog.capture("daily_checkin_started", { metric_type: metric });
    }
  };

  const checkCompletion = (newWater: number, newSleep: number, newExercise: number, newSteps: number) => {
    const isComplete = 
      newWater >= targets.waterLitres &&
      newSleep >= targets.sleepHours &&
      newExercise >= targets.exerciseMins &&
      newSteps >= targets.steps;
    
    // Only fire if they weren't complete before, but now they are
    const wasComplete = 
      currentProgress.waterLitres >= targets.waterLitres &&
      currentProgress.sleepHours >= targets.sleepHours &&
      currentProgress.exerciseMins >= targets.exerciseMins &&
      currentProgress.steps >= targets.steps;

    if (isComplete && !wasComplete) {
      posthog.capture("daily_checkin_completed");
      toast.success("Awesome! You hit all your daily targets!");
    }
  };

  // --- Water Optimistic State ---
  const [optWater, setOptWater] = useOptimistic(
    currentProgress.waterLitres,
    (state, amount: number) => Math.max(0, state + amount)
  );

  const handleAddWater = (amount: number) => {
    trackIfStarted("water");
    startTransition(async () => {
      const newVal = optWater + amount;
      setOptWater(amount);
      checkCompletion(newVal, optSleep, optExercise, optSteps);
      const res = await updateDailyMetricAction("waterIntakeLitres", newVal);
      if (!res.success) {
        toast.error(res.error || "Failed to update water intake.");
      }
    });
  };

  // --- Sleep Optimistic State ---
  const [optSleep, setOptSleep] = useOptimistic(
    currentProgress.sleepHours,
    (state, newAmount: number) => newAmount
  );
  
  const handleSetSleep = (val: number) => {
    trackIfStarted("sleep");
    startTransition(async () => {
      setOptSleep(val);
      checkCompletion(optWater, val, optExercise, optSteps);
      const res = await updateDailyMetricAction("sleepHours", val);
      if (!res.success) {
        toast.error(res.error || "Failed to update sleep hours.");
      }
    });
  };

  // --- Exercise Optimistic State ---
  const [optExercise, setOptExercise] = useOptimistic(
    currentProgress.exerciseMins,
    (state, amount: number) => Math.max(0, state + amount)
  );

  const handleAddExercise = (amount: number) => {
    trackIfStarted("exercise");
    startTransition(async () => {
      const newVal = optExercise + amount;
      setOptExercise(amount);
      checkCompletion(optWater, optSleep, newVal, optSteps);
      const res = await updateDailyMetricAction("exerciseMins", newVal);
      if (!res.success) {
        toast.error(res.error || "Failed to update exercise minutes.");
      }
    });
  };

  // --- Steps Optimistic State ---
  const [optSteps, setOptSteps] = useOptimistic(
    currentProgress.steps,
    (state, amount: number) => Math.max(0, state + amount)
  );

  const handleAddSteps = (amount: number) => {
    trackIfStarted("steps");
    startTransition(async () => {
      const newVal = optSteps + amount;
      setOptSteps(amount);
      checkCompletion(optWater, optSleep, optExercise, newVal);
      const res = await updateDailyMetricAction("stepsCount", newVal);
      if (!res.success) {
        toast.error(res.error || "Failed to update steps.");
      }
    });
  };

  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Target className="w-5 h-5 text-indigo-500" />
        Today&apos;s Plan
      </h2>
      <div className="grid grid-cols-2 gap-4">
        
        {/* Water */}
        <div className="bg-white p-3 sm:p-5 rounded-3xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-blue-50/50 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-blue-100/50 rounded-xl">
                <Droplets className="w-5 h-5 text-blue-500" />
              </div>
              <span className="font-semibold text-blue-900">Water</span>
            </div>
            <div className="flex items-end gap-1 mb-4">
              <span className="text-2xl sm:text-3xl font-bold">{optWater.toFixed(1)}</span>
              <span className="text-gray-500 font-medium mb-1 text-xs sm:text-sm">/ {targets.waterLitres.toFixed(1)}L</span>
            </div>
          </div>
          <div className="flex gap-1 sm:gap-2">
            <button 
              onClick={() => handleAddWater(0.25)}
              className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold py-1 sm:py-1.5 rounded-xl text-xs sm:text-sm transition-colors"
            >
              +250ml
            </button>
            <button 
              onClick={() => handleAddWater(0.5)}
              className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold py-1 sm:py-1.5 rounded-xl text-xs sm:text-sm transition-colors"
            >
              +500ml
            </button>
          </div>
        </div>

        {/* Steps */}
        <div className="bg-white p-3 sm:p-5 rounded-3xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-emerald-50/50 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-emerald-100/50 rounded-xl">
                <Footprints className="w-5 h-5 text-emerald-500" />
              </div>
              <span className="font-semibold text-emerald-900">Steps</span>
            </div>
            <div className="flex items-end gap-1 mb-4">
              <span className="text-2xl sm:text-3xl font-bold">{optSteps}</span>
              <span className="text-gray-500 font-medium mb-1 text-xs sm:text-sm">/ {targets.steps}</span>
            </div>
          </div>
          <div className="flex gap-1 sm:gap-2">
            <button 
              onClick={() => handleAddSteps(500)}
              className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold py-1 sm:py-1.5 rounded-xl text-xs sm:text-sm transition-colors"
            >
              +500
            </button>
            <button 
              onClick={() => handleAddSteps(1000)}
              className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold py-1 sm:py-1.5 rounded-xl text-xs sm:text-sm transition-colors"
            >
              +1k
            </button>
          </div>
        </div>

        {/* Sleep */}
        <div className="bg-white p-3 sm:p-5 rounded-3xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-indigo-50/50 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-indigo-100/50 rounded-xl">
                <Moon className="w-5 h-5 text-indigo-500" />
              </div>
              <span className="font-semibold text-indigo-900">Sleep</span>
            </div>
            <div className="flex items-end gap-1 mb-4">
              <span className="text-2xl sm:text-3xl font-bold">{optSleep}</span>
              <span className="text-gray-500 font-medium mb-1 text-xs sm:text-sm">h (Target {targets.sleepHours}h)</span>
            </div>
          </div>
          <div className="flex items-center justify-between bg-indigo-50 rounded-xl p-1">
            <button 
              onClick={() => handleSetSleep(Math.max(0, optSleep - 0.5))}
              className="p-1 sm:p-1.5 rounded-lg hover:bg-indigo-200/50 text-indigo-700 transition-colors"
            >
              <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
            <span className="font-semibold text-indigo-900 text-xs sm:text-sm">{optSleep}h</span>
            <button 
              onClick={() => handleSetSleep(Math.min(24, optSleep + 0.5))}
              className="p-1 sm:p-1.5 rounded-lg hover:bg-indigo-200/50 text-indigo-700 transition-colors"
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        {/* Exercise */}
        <div className="bg-white p-3 sm:p-5 rounded-3xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-orange-50/50 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-orange-100/50 rounded-xl">
                <Dumbbell className="w-5 h-5 text-orange-500" />
              </div>
              <span className="font-semibold text-orange-900">Exercise</span>
            </div>
            <div className="flex items-end gap-1 mb-4">
              <span className="text-2xl sm:text-3xl font-bold">{optExercise}</span>
              <span className="text-gray-500 font-medium mb-1 text-xs sm:text-sm">/ {targets.exerciseMins}m</span>
            </div>
          </div>
          <div className="flex gap-1 sm:gap-2">
            <button 
              onClick={() => handleAddExercise(10)}
              className="flex-1 bg-orange-50 hover:bg-orange-100 text-orange-700 font-semibold py-1 sm:py-1.5 rounded-xl text-xs sm:text-sm transition-colors"
            >
              +10m
            </button>
            <button 
              onClick={() => handleAddExercise(30)}
              className="flex-1 bg-orange-50 hover:bg-orange-100 text-orange-700 font-semibold py-1 sm:py-1.5 rounded-xl text-xs sm:text-sm transition-colors"
            >
              +30m
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
