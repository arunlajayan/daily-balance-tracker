"use client";

import Link from "next/link";
import { ArrowLeft, UserPlus2 } from "lucide-react";
import UserCreationForm from "@/components/UserCreationForm";

export default function CreateUserPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 mb-2">
            <UserPlus2 className="w-6 h-6 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Create New User</h1>
          <p className="text-sm text-slate-500">Set up a new team member for the Daily Balance Tracker.</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <UserCreationForm />
        </div>

        <div className="text-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
