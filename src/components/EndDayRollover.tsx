import { CheckCircle2, ArrowRight, Lock } from "lucide-react";

interface EndDayRolloverProps {
  isClosed: boolean;
  onEndDay: () => void;
}

export default function EndDayRollover({ isClosed, onEndDay }: EndDayRolloverProps) {
  return (
    <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-6 shadow-lg text-white">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${isClosed ? "bg-amber-500/20" : "bg-emerald-500/20"}`}>
            {isClosed ? <Lock className="w-5 h-5 text-amber-400" /> : <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          </div>
          <div>
            <h2 className="text-xl font-bold mb-1">{isClosed ? "Day Closed" : "End Day & Rollover"}</h2>
            <p className="text-slate-300 text-sm">{isClosed ? "Summary saved. No further edits allowed." : "Incomplete tasks will automatically move to tomorrow."}</p>
          </div>
        </div>
        {!isClosed && (
          <button
            onClick={onEndDay}
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg shadow-md transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            Finish Day <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
