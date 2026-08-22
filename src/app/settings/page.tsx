"use client";

import { useState } from "react";
import Layout from "@/components/Layout";
import { UserProfileDTO } from "@/shared/types/tracker";
import { Settings, Save, MapPin, ArrowLeft } from "lucide-react";
import Link from "next/link";

const DEFAULT_USER: UserProfileDTO = {
  userId: "usr_123",
  email: "developer@example.com",
  fullName: "Alex Rivera",
  timezone: "America/New_York (UTC-5)",
};

const TIMEZONES = [
  "America/New_York (UTC-5)",
  "America/Chicago (UTC-6)",
  "America/Denver (UTC-7)",
  "America/Los_Angeles (UTC-8)",
  "Europe/London (UTC+0)",
  "Europe/Berlin (UTC+1)",
  "Asia/Tokyo (UTC+9)",
];

export default function SettingsPage() {
  const [user, setUser] = useState<UserProfileDTO>(DEFAULT_USER);

  const handleChange = (field: keyof UserProfileDTO, value: string) => {
    setUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    alert("Settings updated successfully!");
  };

  return (
    <Layout user={user}>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Settings className="w-5 h-5 text-slate-400" />
            <h2 className="text-lg font-semibold text-slate-800">User Profile</h2>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={user.fullName || ""}
                onChange={(e) => handleChange("fullName", e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={user.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Timezone</label>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                <select
                  value={user.timezone}
                  onChange={(e) => handleChange("timezone", e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-slate-50"
                >
                  {TIMEZONES.map((tz) => (
                    <option key={tz} value={tz}>{tz}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition-all"
            >
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
