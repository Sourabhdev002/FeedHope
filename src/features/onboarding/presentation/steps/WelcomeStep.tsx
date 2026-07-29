import { Button } from "@/components/ui/Button";

interface WelcomeStepProps {
  onNext: () => void;
  userName: string;
}


export function WelcomeStep({ onNext, userName }: WelcomeStepProps) {
  const firstName = userName.split(" ")[0];

  return (
    <div className="flex flex-col items-center text-center py-8 px-4">
      {/* Icon */}
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-500 to-emerald-400 flex items-center justify-center mb-6 shadow-lg">
        <span aria-hidden="true" className="text-4xl">🌱</span>
        <span className="sr-only">FeedHope plant icon</span>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-3">
        Welcome, {firstName}!
      </h1>
      <p className="text-lg text-gray-500 max-w-md mb-2">
        Let&apos;s build your personal health profile.
      </p>
      <p className="text-sm text-gray-400 max-w-sm mb-8">
        This quick assessment (around 3 minutes) helps us understand your
        current health baseline. Your answers are private and secure.
      </p>

      {/* What to expect */}
      <div className="w-full max-w-sm bg-gray-50 rounded-2xl p-5 mb-8 text-left space-y-3">
        {[
          { icon: "📋", label: "clipboard", text: "Basic body measurements" },
          { icon: "🏃", label: "runner", text: "Your lifestyle & habits" },
          { icon: "🎯", label: "target", text: "Your personal health goals" },
          { icon: "🩺", label: "stethoscope", text: "Any existing health conditions" },
        ].map(({ icon, label, text }) => (
          <div key={text} className="flex items-center gap-3">
            <span aria-hidden="true" className="text-xl">{icon}</span>
            <span className="sr-only">{label}</span>
            <span className="text-sm text-gray-600 font-medium">{text}</span>
          </div>
        ))}
      </div>

      <Button onClick={onNext} fullWidth>
        Get Started →
      </Button>

      <p className="mt-4 text-xs text-gray-400">
        Your data is encrypted and never sold to third parties.
      </p>
    </div>
  );
}
