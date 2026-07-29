import { Droplets, Footprints, Moon, Dumbbell } from "lucide-react";
import type { PersonalBests } from "@/features/progress/domain/progress-engine";

interface PersonalBestsSectionProps {
  bests: PersonalBests;
}

interface PBItem {
  label: string;
  value: string;
  sublabel: string;
  Icon: typeof Droplets;
  iconBg: string;
  iconColor: string;
}

export function PersonalBestsSection({ bests }: PersonalBestsSectionProps) {
  const items: PBItem[] = [
    {
      label: "Best Water Day",
      value: `${bests.waterLitres}L`,
      sublabel: "single-day record",
      Icon: Droplets,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
    },
    {
      label: "Best Step Day",
      value: bests.stepsCount.toLocaleString(),
      sublabel: "steps in a day",
      Icon: Footprints,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-500",
    },
    {
      label: "Best Sleep Night",
      value: `${bests.sleepHours}h`,
      sublabel: "hours logged",
      Icon: Moon,
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-500",
    },
    {
      label: "Best Exercise Day",
      value: `${bests.exerciseMins}m`,
      sublabel: "active minutes",
      Icon: Dumbbell,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-500",
    },
  ];

  const anyBest =
    bests.waterLitres > 0 ||
    bests.stepsCount > 0 ||
    bests.sleepHours > 0 ||
    bests.exerciseMins > 0;

  return (
    <div className="mb-6">
      <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
        🏆 Personal Bests
        <span className="text-xs font-medium text-gray-400 ml-1">(last 14 days)</span>
      </h2>

      {!anyBest ? (
        <div className="bg-white rounded-3xl p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] text-center">
          <p className="text-gray-400 text-sm">
            Keep logging daily to unlock your personal bests!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {items.map((item) => (
            <div
              key={item.label}
              className="bg-white rounded-2xl p-4 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] flex flex-col gap-2"
            >
              <div className={`w-8 h-8 rounded-xl ${item.iconBg} flex items-center justify-center`}>
                <item.Icon className={`w-4 h-4 ${item.iconColor}`} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">{item.label}</p>
                <p className="text-xl font-bold text-slate-900 leading-tight">
                  {item.value}
                </p>
                <p className="text-xs text-gray-400">{item.sublabel}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
