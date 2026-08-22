import { ListTodo, Plus, Trash2 } from "lucide-react";
import { WorkItemDTO } from "@/shared/types/tracker";

interface AgileTaskBoardProps {
  workItems: WorkItemDTO[];
  onUpdate: (logId: string, field: keyof WorkItemDTO, value: unknown) => void;
  onAdd: () => void;
  onRemove: (logId: string) => void;
}

export default function AgileTaskBoard({ workItems, onUpdate, onAdd, onRemove }: AgileTaskBoardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ListTodo className="w-5 h-5 text-slate-400" />
          <h2 className="text-lg font-semibold text-slate-800">Agile Task Board</h2>
        </div>
        <button
          onClick={onAdd}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-slate-900 text-white px-3 py-2 hover:bg-slate-800 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4 mr-1" /> Add Task
        </button>
      </div>
      <div className="space-y-3">
        {workItems.length === 0 && (
          <p className="text-sm text-slate-500 italic bg-slate-50 p-4 rounded-lg border border-slate-100">
            No tasks added yet. Click + Add Task to start logging your day.
          </p>
        )}
        {workItems.map((task) => (
          <div key={task.logId} className="p-4 border border-slate-200 rounded-lg bg-slate-50/50 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex-1 min-w-[140px]">
              <label className="block text-xs font-medium text-slate-500 mb-1">Task Name</label>
              <input
                type="text"
                value={task.taskName}
                onChange={(e) => onUpdate(task.logId, "taskName", e.target.value)}
                placeholder="e.g., DB Schema"
                className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
              />
            </div>
            <div className="w-full sm:w-24">
              <label className="block text-xs font-medium text-slate-500 mb-1">Actual Hrs</label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={task.timeSpentToday || ""}
                onChange={(e) => onUpdate(task.logId, "timeSpentToday", parseFloat(e.target.value) || 0)}
                className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
              />
            </div>
            <div className="w-full sm:w-32">
              <label className="block text-xs font-medium text-slate-500 mb-1">Progress %</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={task.progressPercent}
                  onChange={(e) => onUpdate(task.logId, "progressPercent", parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <span className="text-xs text-slate-500 font-mono w-8">{task.progressPercent}%</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Est: {task.estHours}h</span>
              <button
                onClick={() => onRemove(task.logId)}
                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
