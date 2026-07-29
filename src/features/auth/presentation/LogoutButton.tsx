"use client";

import { signOut } from "@/features/auth/infrastructure/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { toast } from "sonner";
import { usePostHog } from "posthog-js/react";

export function LogoutButton() {
  const router = useRouter();
  const posthog = usePostHog();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      posthog.capture("logout");
      posthog.reset();
      await signOut();
      router.push("/login");
      router.refresh();
    } catch {
      toast.error("Failed to sign out securely. Please refresh and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button variant="danger" size="sm" onClick={handleLogout} isLoading={isLoading}>
      Sign Out
    </Button>
  );
}
