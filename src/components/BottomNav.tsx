"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarCheck, BarChart2 } from "lucide-react";

const navItems = [
  {
    href: "/dashboard",
    label: "Today",
    Icon: CalendarCheck,
  },
  {
    href: "/dashboard/progress",
    label: "Progress",
    Icon: BarChart2,
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-t border-gray-100">
      <div className="max-w-md mx-auto flex">
        {navItems.map(({ href, label, Icon }) => {
          // "Today" is active only on exact /dashboard; "Progress" on /dashboard/progress
          const isActive =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-semibold transition-colors ${
                isActive ? "text-indigo-600" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Icon
                className={`w-5 h-5 transition-transform ${isActive ? "scale-110" : ""}`}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span>{label}</span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-indigo-500" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
