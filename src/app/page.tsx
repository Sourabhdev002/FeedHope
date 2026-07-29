import Link from "next/link";
import { Heart, BarChart2, CalendarCheck, ArrowRight, Droplets, Footprints, Moon } from "lucide-react";

export const metadata = {
  title: "FeedHope – Your Personal Health Companion",
  description:
    "FeedHope gives you a personalised health plan, daily tracking, and weekly insights — all in one place. Start your journey today.",
};

const features = [
  {
    Icon: Heart,
    colour: "bg-violet-100 text-violet-600",
    title: "Personalised Health Plan",
    body: "Answer a 3-minute assessment and get a tailored plan covering hydration, sleep, steps, exercise, and daily habits — built around your goals.",
  },
  {
    Icon: CalendarCheck,
    colour: "bg-emerald-100 text-emerald-600",
    title: "Daily Check-ins",
    body: "Log water, steps, sleep, and exercise with one tap. Your progress is saved instantly and persists across sessions.",
  },
  {
    Icon: BarChart2,
    colour: "bg-indigo-100 text-indigo-600",
    title: "Weekly Insights",
    body: "See your habit completion, personal bests, and trend indicators every week — so you always know where to focus next.",
  },
];

const stats = [
  { label: "Metrics tracked", value: "5", Icon: Droplets },
  { label: "Weekly insights", value: "7+", Icon: BarChart2 },
  { label: "Sleep goal support", value: "✓", Icon: Moon },
  { label: "Step targets", value: "✓", Icon: Footprints },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900 font-sans">
      {/* ── Nav ──────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-emerald-500 bg-clip-text text-transparent">
            FeedHope
          </span>
          <nav className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors shadow-sm"
            >
              Get started
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-violet-50">
          {/* Decorative blobs */}
          <div
            aria-hidden="true"
            className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-violet-200/30 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-emerald-200/30 blur-3xl"
          />

          <div className="relative max-w-5xl mx-auto px-6 py-24 text-center">
            {/* Badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-semibold mb-6">
              <span aria-hidden="true">🌱</span>
              Now in closed beta
            </span>

            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight leading-tight mb-6 max-w-2xl mx-auto">
              Your health,{" "}
              <span className="bg-gradient-to-r from-violet-600 to-emerald-500 bg-clip-text text-transparent">
                personalised
              </span>
              .
            </h1>

            <p className="text-lg sm:text-xl text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed">
              FeedHope builds your personal health plan in minutes, then helps
              you track it every day — water, steps, sleep, exercise, and
              habits all in one place.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-violet-600 text-white font-semibold hover:bg-violet-700 transition-colors shadow-md hover:shadow-lg text-sm"
              >
                Start for free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors text-sm"
              >
                Sign in to your account
              </Link>
            </div>
          </div>
        </section>

        {/* ── Stats strip ──────────────────────────────────────────────── */}
        <section className="border-y border-gray-100 bg-white">
          <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {stats.map(({ label, value, Icon }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-violet-500" />
                </div>
                <p className="text-2xl font-bold text-slate-900">{value}</p>
                <p className="text-xs text-gray-400 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Features ─────────────────────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Everything you need to feel better
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              No guesswork. No overwhelming dashboards. Just clear, actionable
              health guidance built around you.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {features.map(({ Icon, colour, title, body }) => (
              <div
                key={title}
                className="bg-white rounded-3xl border border-gray-100 shadow-card p-7 flex flex-col gap-4 hover:shadow-card-hover transition-shadow"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colour}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA Banner ───────────────────────────────────────────────── */}
        <section className="bg-gradient-to-br from-violet-600 to-violet-700 text-white">
          <div className="max-w-5xl mx-auto px-6 py-16 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to start?</h2>
            <p className="text-violet-200 mb-8 max-w-md mx-auto">
              Create your free account in seconds and get your personalised
              health plan today.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white text-violet-700 font-semibold hover:bg-violet-50 transition-colors shadow-md text-sm"
            >
              Create free account
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <span className="font-semibold bg-gradient-to-r from-violet-600 to-emerald-500 bg-clip-text text-transparent">
            FeedHope
          </span>
          <p>Your data is private and never sold to third parties.</p>
          <nav className="flex gap-5">
            <Link href="/login" className="hover:text-gray-600 transition-colors">
              Sign in
            </Link>
            <Link href="/register" className="hover:text-gray-600 transition-colors">
              Register
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
