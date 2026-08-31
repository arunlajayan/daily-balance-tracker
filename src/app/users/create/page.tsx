import Link from "next/link";
import { ArrowLeft, BarChart3, ShieldCheck, Users, Zap } from "lucide-react";
import UserAuthForm from "@/components/UserAuthForm";

const FEATURES = [
  {
    icon: BarChart3,
    title: "Real-time balance tracking",
    description: "See your team's daily numbers the moment they change.",
  },
  {
    icon: Users,
    title: "Built for teams",
    description: "Invite members, assign roles, and stay in sync.",
  },
  {
    icon: ShieldCheck,
    title: "Secure by default",
    description: "Your data is encrypted in transit and at rest.",
  },
];

const STATS = [
  { value: "2,000+", label: "teams onboard" },
  { value: "99.9%", label: "uptime" },
  { value: "4.9/5", label: "user rating" },
];

export default function LoginPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      {/* ── Left: branding panel (desktop only) ─────────────────────────── */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900 text-white">
        {/* Decorative glow blobs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[28rem] h-[28rem] rounded-full bg-indigo-400/20 blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/15 backdrop-blur">
            <Zap className="w-5 h-5" />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            Daily Balance Tracker
          </span>
        </div>

        {/* Hero copy + features */}
        <div className="relative space-y-10">
          <div className="space-y-4">
            <h1 className="text-4xl xl:text-5xl font-bold leading-tight tracking-tight">
              Your team&​apos;s balance,
              <br />
              crystal clear — every day.
            </h1>
            <p className="text-indigo-100 text-lg max-w-md">
              Log in to pick up right where you left off, or create an account
              and get your team tracking in minutes.
            </p>
          </div>

          <ul className="space-y-6">
            {FEATURES.map((feature) => (
              <li key={feature.title} className="flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 backdrop-blur flex-shrink-0">
                  <feature.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">{feature.title}</p>
                  <p className="text-sm text-indigo-100/80">
                    {feature.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Social proof */}
        <div className="relative space-y-6">
          <div className="flex gap-8">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-indigo-100/80">{stat.label}</p>
              </div>
            ))}
          </div>
          <blockquote className="border-l-2 border-white/30 pl-4 text-sm text-indigo-100/90 italic">
            &​ldquo;Daily Balance Tracker replaced three spreadsheets and a
            weekly meeting. It just works.&​rdquo;
            <footer className="mt-2 not-italic font-medium text-white">
              — Priya S., Operations Lead
            </footer>
          </blockquote>
        </div>
      </div>

      {/* ── Right: auth form ────────────────────────────────────────────── */}
      <div className="flex flex-col min-h-screen bg-slate-50">
        <div className="flex items-center justify-between p-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to dashboard
          </Link>

          {/* Mobile-only brand mark (left panel is hidden on small screens) */}
          <div className="flex lg:hidden items-center gap-2 text-slate-700">
            <Zap className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-semibold">Daily Balance Tracker</span>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-4 pb-12">
          <div className="w-full max-w-md">
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xl shadow-slate-200/60">
              <UserAuthForm />
            </div>
            <p className="text-center text-xs text-slate-400 mt-6">
              By continuing, you agree to our{" "}
              <Link href="/terms" className="underline hover:text-slate-600">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline hover:text-slate-600">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
