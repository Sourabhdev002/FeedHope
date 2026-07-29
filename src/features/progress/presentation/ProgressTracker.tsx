"use client";

import { useEffect } from "react";
import { usePostHog } from "posthog-js/react";

export function ProgressTracker() {
  const posthog = usePostHog();

  useEffect(() => {
    posthog.capture("progress_viewed");
  }, [posthog]);

  return null;
}
