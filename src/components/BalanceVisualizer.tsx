import { CalendarClock } from "lucide-react";
import { DailySummaryDTO } from "@/shared/types/tracker";

interface BalanceVisualizerProps {
  summary: DailySummaryDTO;
}

export default function BalanceVisualizer({ summary }: BalanceVisualizerProps) {
  const { totalWork, totalSleep, totalLeisure, remainingHours } = summary;
  const totalLogged = totalWork + totalSleep + totalLeisure;

  const sleepW = (totalSleep / 24) * 100;
  const workW = (totalWork / 24) * 100;
  const leisureW = (remainingHours / 24) * 100;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <CalendarClock className="w-5 h-5 text-slate-400" />
        <h2 className="text-lg font-semibold text-slate-800">24-Hour Balance</h2>
      </div>
      <div className="w-full h-6 bg-slate-100 rounded-full overflow-hidden flex">
        <div style={{ width: `${Math.min(sleepW, 100)}%` }} className="h-full bg-indigo-500 transition-all duration-500 ease-out" />
        <div style={{ width: `${Math.min(workW, 100)}%` }} className="h-full bg-blue-500 transition-all duration-500 ease-out" />
        <div style={{ width: `${Math.min(leisureW, 100)}%` }} className="h-full bg-emerald-500 transition-all duration-500 ease-out" />
      </div>
      <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600 font-medium">
        <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-indigo-500" /> Sleep: {totalSleep.toFixed(1)}h</span>
        <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500" /> Work: {totalWork.toFixed(1)}h</span>
        <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Leisure: {totalLeisure.toFixed(1)}h / {remainingHours.toFixed(1)}h left</span>
      </div>
      {totalLogged > 24 && (
        <p className="mt-2 text-xs text-red-500 font-medium">⚠️ Logged hours exceed 24. Adjust inputs to balance.</p>
      )}
    </div>
  );
}
