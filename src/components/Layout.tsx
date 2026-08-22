import { LayoutDashboard, User,Menu } from "lucide-react";
import { UserProfileDTO } from "@/shared/types/tracker";
import ThemeToggle from "./ThemeToggle";

interface LayoutProps {
  children: React.ReactNode;
  user: UserProfileDTO;
  onMenuToggle?: () => void;
}

export default function Layout({ children, user, onMenuToggle }: LayoutProps) {
  const displayName = user.fullName || user.email;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-100 dark:selection:bg-indigo-900/30">
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
              <LayoutDashboard className="w-5 h-5 text-dark dark:text-indigo-400" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Daily Balance Tracker</h1>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
            <span className="hidden sm:inline">{user.timezone}</span>
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700">
              <User className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              <span className="font-medium">{displayName}</span>
            </div>
            <ThemeToggle />
            <button onClick={onMenuToggle} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <Menu className="w-5 h-5 text-slate-500 dark:text-slate-400" />
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8 text-black">
        {children}
      </main>
    </div>
  );
}
