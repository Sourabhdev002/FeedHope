"use client";

import { useEffect } from "react";
import { usePostHog } from "posthog-js/react";

export function DashboardTracker() {
  const posthog = usePostHog();

  useEffect(() => {
    posthog.capture("dashboard_viewed");
  }, [posthog]);

  return null;
}
