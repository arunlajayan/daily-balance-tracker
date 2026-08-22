import { LayoutDashboard, User } from "lucide-react";
import { UserProfileDTO } from "@/shared/types/tracker";

interface LayoutProps {
  children: React.ReactNode;
  user: UserProfileDTO;
}

export default function Layout({ children, user }: LayoutProps) {
  const displayName = user.fullName || user.email;
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <LayoutDashboard className="w-5 h-5 text-indigo-600" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">Daily Balance Tracker</h1>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <span className="hidden sm:inline">{user.timezone}</span>
            <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full">
              <User className="w-4 h-4 text-slate-400" />
              <span className="font-medium">{displayName}</span>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {children}
      </main>
    </div>
  );
}
