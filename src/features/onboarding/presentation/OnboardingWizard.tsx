"use client";

import { useReducer, useState } from "react";
import {
  INITIAL_FORM_DATA,
  type OnboardingFormData,
  type BasicInfoData,
  type LifestyleData,
  type GoalsData,
  type HealthConditionsData,
} from "@/features/onboarding/domain/types";
import { submitAssessmentAction } from "@/features/onboarding/application/actions";
import { ProgressBar } from "./ProgressBar";
import dynamic from "next/dynamic";
import { usePostHog } from "posthog-js/react";
import { useEffect } from "react";

const WelcomeStep = dynamic(() => import("./steps/WelcomeStep").then(m => m.WelcomeStep));
const BasicInfoStep = dynamic(() => import("./steps/BasicInfoStep").then(m => m.BasicInfoStep));
const LifestyleStep = dynamic(() => import("./steps/LifestyleStep").then(m => m.LifestyleStep));
const GoalsStep = dynamic(() => import("./steps/GoalsStep").then(m => m.GoalsStep));
const HealthConditionsStep = dynamic(() => import("./steps/HealthConditionsStep").then(m => m.HealthConditionsStep));
const ReviewStep = dynamic(() => import("./steps/ReviewStep").then(m => m.ReviewStep));
const SuccessStep = dynamic(() => import("./steps/SuccessStep").then(m => m.SuccessStep));

// ─── Reducer ─────────────────────────────────────────────────────────────────

type Action =
  | { type: "SET_STEP"; step: number }
  | { type: "SET_BASIC_INFO"; data: BasicInfoData }
  | { type: "SET_LIFESTYLE"; data: LifestyleData }
  | { type: "SET_GOALS"; data: GoalsData }
  | { type: "SET_HEALTH_CONDITIONS"; data: HealthConditionsData };

interface State {
  step: number;
  formData: OnboardingFormData;
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, step: action.step };
    case "SET_BASIC_INFO":
      return { ...state, step: 2, formData: { ...state.formData, basicInfo: action.data } };
    case "SET_LIFESTYLE":
      return { ...state, step: 3, formData: { ...state.formData, lifestyle: action.data } };
    case "SET_GOALS":
      return { ...state, step: 4, formData: { ...state.formData, goals: action.data } };
    case "SET_HEALTH_CONDITIONS":
      return { ...state, step: 5, formData: { ...state.formData, healthConditions: action.data } };
    default:
      return state;
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

interface OnboardingWizardProps {
  userName: string;
}

export function OnboardingWizard({ userName }: OnboardingWizardProps) {
  const posthog = usePostHog();
  const [state, dispatch] = useReducer(reducer, {
    step: 0,
    formData: INITIAL_FORM_DATA,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const { step, formData } = state;

  useEffect(() => {
    if (step === 0) {
      posthog.capture("onboarding_started");
    }
  }, [step, posthog]);

  const handleSubmit = async () => {
    const { basicInfo, lifestyle, goals, healthConditions } = formData;

    // Guard: All sections must be filled (they were validated per-step)
    if (!basicInfo.dateOfBirth || !lifestyle.activityLevel || !goals.goals?.length || !healthConditions.healthConditions?.length) {
      setSubmitError("Some steps appear incomplete. Please go back and review.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    const result = await submitAssessmentAction({
      basicInfo: basicInfo as BasicInfoData,
      lifestyle: lifestyle as LifestyleData,
      goals: goals as GoalsData,
      healthConditions: healthConditions as HealthConditionsData,
    });

    setIsSubmitting(false);

    if (result.success) {
      posthog.capture("health_plan_generated", { success: true });
      posthog.capture("onboarding_completed");
      dispatch({ type: "SET_STEP", step: 6 });
    } else {
      posthog.capture("health_plan_generated", { success: false });
      setSubmitError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50 flex items-start justify-center pt-8 pb-16 px-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-6">
          <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-emerald-500 bg-clip-text text-transparent">
            FeedHope
          </span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/60 border border-gray-100 overflow-hidden">
          <div className="px-4 pt-8 pb-6 sm:px-8">
            <ProgressBar currentStep={step} />

            {step === 0 && (
              <WelcomeStep
                userName={userName}
                onNext={() => dispatch({ type: "SET_STEP", step: 1 })}
              />
            )}

            {step === 1 && (
              <BasicInfoStep
                data={formData.basicInfo}
                onNext={(data) => dispatch({ type: "SET_BASIC_INFO", data })}
                onBack={() => dispatch({ type: "SET_STEP", step: 0 })}
              />
            )}

            {step === 2 && (
              <LifestyleStep
                data={formData.lifestyle}
                onNext={(data) => dispatch({ type: "SET_LIFESTYLE", data })}
                onBack={() => dispatch({ type: "SET_STEP", step: 1 })}
              />
            )}

            {step === 3 && (
              <GoalsStep
                data={formData.goals}
                onNext={(data) => dispatch({ type: "SET_GOALS", data })}
                onBack={() => dispatch({ type: "SET_STEP", step: 2 })}
              />
            )}

            {step === 4 && (
              <HealthConditionsStep
                data={formData.healthConditions}
                onNext={(data) => dispatch({ type: "SET_HEALTH_CONDITIONS", data })}
                onBack={() => dispatch({ type: "SET_STEP", step: 3 })}
              />
            )}

            {step === 5 && (
              <ReviewStep
                data={formData}
                onSubmit={handleSubmit}
                onBack={() => dispatch({ type: "SET_STEP", step: 4 })}
                onGoTo={(s) => dispatch({ type: "SET_STEP", step: s })}
                isSubmitting={isSubmitting}
                submitError={submitError}
              />
            )}

            {step === 6 && <SuccessStep />}
          </div>
        </div>
      </div>
    </div>
  );
}
