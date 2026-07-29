import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/features/auth/infrastructure/better-auth";
import { prisma } from "@/infrastructure/db/prisma";
import { OnboardingWizard } from "@/features/onboarding/presentation/OnboardingWizard";

export default async function OnboardingPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/login");
  }

  // If they already completed onboarding, send them to dashboard
  const existingProfile = await prisma.healthProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (existingProfile) {
    redirect("/dashboard");
  }

  return <OnboardingWizard userName={session.user.name} />;
}
