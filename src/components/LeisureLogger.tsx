import { Coffee, Trash2 } from "lucide-react";
import { LeisureItemDTO } from "@/shared/types/tracker";

interface LeisureLoggerProps {
  leisureItems: LeisureItemDTO[];
  categories: string[];
  onAdd: () => void;
  onUpdate: (logId: string, field: keyof LeisureItemDTO, value: unknown) => void;
  onRemove: (logId: string) => void;
}

export default function LeisureLogger({ leisureItems, categories, onAdd, onUpdate, onRemove }: LeisureLoggerProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Coffee className="w-5 h-5 text-slate-400" />
          <h2 className="text-lg font-semibold text-slate-800">Leisure Logger</h2>
        </div>
        <button
          onClick={onAdd}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-slate-900 text-white px-3 py-2 hover:bg-slate-800 transition-colors shadow-sm"
        >
          <span className="mr-1">+</span> Add Leisure
        </button>
      </div>
      <div className="space-y-3">
        {leisureItems.length === 0 && (
          <p className="text-sm text-slate-500 italic bg-slate-50 p-4 rounded-lg border border-slate-100">
            No leisure logged yet. Click + Add Leisure to track downtime.
          </p>
        )}
        {leisureItems.map((item) => (
          <div key={item.logId} className="p-4 border border-slate-200 rounded-lg bg-slate-50/50 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex-1 min-w-[140px]">
              <label className="block text-xs font-medium text-slate-500 mb-1">Category</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => onUpdate(item.logId, "categoryId", cat)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
                      item.categoryId === cat
                        ? "bg-emerald-500 text-white border-emerald-500 shadow-sm"
                        : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="w-full sm:w-24">
              <label className="block text-xs font-medium text-slate-500 mb-1">Duration (hrs)</label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={item.durationHours || ""}
                onChange={(e) => onUpdate(item.logId, "durationHours", parseFloat(e.target.value) || 0)}
                className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
              />
            </div>
            <button
              onClick={() => onRemove(item.logId)}
              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
