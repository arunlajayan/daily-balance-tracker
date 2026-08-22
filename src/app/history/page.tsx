"use client";

import { useState } from "react";
import Layout from "@/components/Layout";
import { DailyTrackerPayload } from "@/shared/types/tracker";
import { Calendar, ArrowLeft, Eye } from "lucide-react";
import Link from "next/link";

const MOCK_HISTORY: DailyTrackerPayload[] = [
  {
    trackerId: "trk_002",
    logDate: new Date(Date.now() - 86400000 * 1).toISOString().split("T")[0],
    isClosed: true,
    user: { userId: "usr_123", email: "developer@example.com", fullName: "Alex Rivera", timezone: "America/New_York (UTC-5)" },
    summary: { totalWork: 6.5, totalSleep: 7.5, totalLeisure: 4.0, remainingHours: 6.0 },
    sleep: { sleepId: "slp_002", bedTime: "23:00", wakeTime: "07:30", targetSleep: 8, actualDuration: 8.5 },
    workItems: [],
    leisureItems: [],
  },
  {
    trackerId: "trk_003",
    logDate: new Date(Date.now() - 86400000 * 2).toISOString().split("T")[0],
    isClosed: true,
    user: { userId: "usr_123", email: "developer@example.com", fullName: "Alex Rivera", timezone: "America/New_York (UTC-5)" },
    summary: { totalWork: 5.0, totalSleep: 7.0, totalLeisure: 8.0, remainingHours: 4.0 },
    sleep: { sleepId: "slp_003", bedTime: "00:30", wakeTime: "07:00", targetSleep: 8, actualDuration: 6.5 },
    workItems: [],
    leisureItems: [],
  },
];

export default function HistoryPage() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const user = MOCK_HISTORY[0]?.user || { userId: "usr_123", email: "developer@example.com", fullName: "Alex Rivera", timezone: "America/New_York (UTC-5)" };

  const selectedPayload = selectedDate ? MOCK_HISTORY.find(p => p.logDate === selectedDate) : null;

  return (
    <Layout user={user}>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-800">Daily History</h1>
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
        </div>

        {selectedPayload ? (
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-slate-400" />
                <h2 className="text-lg font-semibold text-slate-800">{selectedPayload.logDate}</h2>
              </div>
              <span className={`px-3 py-1 text-xs font-bold rounded-full ${selectedPayload.isClosed ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                {selectedPayload.isClosed ? "Closed" : "Open"}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-xs text-slate-500 mb-1">Work</p>
                <p className="text-lg font-bold text-blue-600">{selectedPayload.summary.totalWork.toFixed(1)}h</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-xs text-slate-500 mb-1">Sleep</p>
                <p className="text-lg font-bold text-indigo-600">{selectedPayload.summary.totalSleep.toFixed(1)}h</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-xs text-slate-500 mb-1">Leisure</p>
                <p className="text-lg font-bold text-emerald-600">{selectedPayload.summary.totalLeisure.toFixed(1)}h</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-xs text-slate-500 mb-1">Remaining</p>
                <p className="text-lg font-bold text-slate-700">{selectedPayload.summary.remainingHours.toFixed(1)}h</p>
              </div>
            </div>
            <button className="w-full py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              View Full Details
            </button>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Recent Days</h2>
            <div className="space-y-3">
              {MOCK_HISTORY.map((day) => (
                <div
                  key={day.trackerId}
                  onClick={() => setSelectedDate(day.logDate)}
                  className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-slate-50/50 hover:bg-slate-100 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-200 rounded-lg">
                      <Calendar className="w-4 h-4 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{day.logDate}</p>
                      <p className="text-xs text-slate-500">Work: {day.summary.totalWork}h | Sleep: {day.summary.totalSleep}h</p>
                    </div>
                  </div>
                  <Eye className="w-4 h-4 text-slate-400" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
