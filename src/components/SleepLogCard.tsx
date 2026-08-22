import { Bed } from "lucide-react";
import { SleepLogDTO } from "@/shared/types/tracker";

interface SleepLogCardProps {
  sleep: SleepLogDTO;
  onUpdate: (field: keyof SleepLogDTO, value: string | number | null) => void;
}

export default function SleepLogCard({ sleep, onUpdate }: SleepLogCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Bed className="w-5 h-5 text-slate-400" />
        <h2 className="text-lg font-semibold text-slate-800">Sleep Log</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Bed Time</label>
          <input
            type="time"
            value={sleep.bedTime || ""}
            onChange={(e) => onUpdate("bedTime", e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-slate-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Wake Time</label>
          <input
            type="time"
            value={sleep.wakeTime || ""}
            onChange={(e) => onUpdate("wakeTime", e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-slate-50"
          />
        </div>
      </div>
      <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
        <span className="text-sm text-slate-600">Calculated Duration:</span>
        <span className="text-sm font-bold text-indigo-600">{sleep.actualDuration.toFixed(1)} hours logged</span>
      </div>
    </div>
  );
}
