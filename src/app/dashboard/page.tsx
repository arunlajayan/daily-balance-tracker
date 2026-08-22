"use client";

import { useState, useCallback } from "react";
import Layout from "@/components/Layout";
import BalanceVisualizer from "@/components/BalanceVisualizer";
import SleepLogCard from "@/components/SleepLogCard";
import AgileTaskBoard from "@/components/AgileTaskBoard";
import LeisureLogger from "@/components/LeisureLogger";
import EndDayRollover from "@/components/EndDayRollover";
import { DailyTrackerPayload, DailySummaryDTO, SleepLogDTO, WorkItemDTO, LeisureItemDTO } from "@/shared/types/tracker";

const MOCK_USER: DailyTrackerPayload["user"] = {
  userId: "usr_123",
  email: "developer@example.com",
  fullName: "Alex Rivera",
  timezone: "America/New_York (UTC-5)",
};

const MOCK_SLEEP: SleepLogDTO = {
  sleepId: "slp_001",
  bedTime: "23:30",
  wakeTime: "07:00",
  targetSleep: 8,
  actualDuration: 7.5,
};

const calculateSummary = (sleep: SleepLogDTO | null, work: WorkItemDTO[], leisure: LeisureItemDTO[]): DailySummaryDTO => {
  const totalWork = work.reduce((a, t) => a + t.timeSpentToday, 0);
  const totalLeisure = leisure.reduce((a, l) => a + l.durationHours, 0);
  const totalSleep = sleep?.actualDuration ?? 0;
  return {
    totalWork,
    totalSleep,
    totalLeisure,
    remainingHours: Math.max(0, 24 - totalWork - totalSleep - totalLeisure),
  };
};

export default function DashboardPage() {
  const [payload, setPayload] = useState<DailyTrackerPayload>({
    trackerId: "trk_001",
    logDate: new Date().toISOString().split("T")[0],
    isClosed: false,
    user: MOCK_USER,
    summary: calculateSummary(MOCK_SLEEP, [], []),
    sleep: MOCK_SLEEP,
    workItems: [],
    leisureItems: [],
  });

  const categories = ["Gym", "Gaming", "Reading", "Social", "Rest"];

  const handleSleepUpdate = useCallback((field: keyof SleepLogDTO, value: string | number | null) => {
    setPayload((prev) => {
      const newSleep = { ...prev.sleep!, [field]: value };
      const newSummary = calculateSummary(newSleep, prev.workItems, prev.leisureItems);
      return { ...prev, sleep: newSleep, summary: newSummary };
    });
  }, []);

  const handleWorkUpdate = useCallback((logId: string, field: keyof WorkItemDTO, value: unknown) => {
    setPayload((prev) => {
      const updatedWork = prev.workItems.map((t) => (t.logId === logId ? { ...t, [field]: value } : t));
      const newSummary = calculateSummary(prev.sleep!, updatedWork, prev.leisureItems);
      return { ...prev, workItems: updatedWork, summary: newSummary };
    });
  }, []);

  const handleLeisureUpdate = useCallback((logId: string, field: keyof LeisureItemDTO, value: unknown) => {
    setPayload((prev) => {
      const updatedLeisure = prev.leisureItems.map((l) => (l.logId === logId ? { ...l, [field]: value } : l));
      const newSummary = calculateSummary(prev.sleep!, prev.workItems, updatedLeisure);
      return { ...prev, leisureItems: updatedLeisure, summary: newSummary };
    });
  }, []);

  const handleEndDay = useCallback(() => {
    setPayload((prev) => ({ ...prev, isClosed: true }));
    alert("Day ended & rolled over! Incomplete tasks saved for tomorrow.");
  }, []);

  return (
    <Layout user={payload.user}>
      <div className="space-y-8">
        <BalanceVisualizer summary={payload.summary} />
        <SleepLogCard sleep={payload.sleep!} onUpdate={handleSleepUpdate} />
        <AgileTaskBoard
          workItems={payload.workItems}
          onUpdate={handleWorkUpdate}
          onAdd={() => setPayload((prev) => ({
            ...prev,
            workItems: [...prev.workItems, { logId: crypto.randomUUID(), taskId: "tsk_new", taskName: "", estHours: 0, timeSpentToday: 0, progressPercent: 0 }]
          }))}
          onRemove={(logId) => setPayload((prev) => ({
            ...prev,
            workItems: prev.workItems.filter((t) => t.logId !== logId)
          }))}
        />
        <LeisureLogger
          leisureItems={payload.leisureItems}
          categories={categories}
          onAdd={() => setPayload((prev) => ({
            ...prev,
            leisureItems: [...prev.leisureItems, { logId: crypto.randomUUID(), categoryId: categories[0], activityName: "", durationHours: 0 }]
          }))}
          onUpdate={handleLeisureUpdate}
          onRemove={(logId) => setPayload((prev) => ({
            ...prev,
            leisureItems: prev.leisureItems.filter((l) => l.logId !== logId)
          }))}
        />
        <EndDayRollover isClosed={payload.isClosed} onEndDay={handleEndDay} />
      </div>
    </Layout>
  );
}
