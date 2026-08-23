"use client";

import { BarChart3, Bed, Coffee, TrendingUp, Globe2, CalendarCheck } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: BarChart3,
      title: "Visual 24h Balance",
      desc: "Watch your day come alive with a dynamic stacked progress bar. Sleep, work, and leisure instantly adjust."
    },
    {
      icon: Bed,
      title: "Smart Sleep Sync",
      desc: "Auto-calculates duration from bed/wake times. Handles overnight crossings without manual math."
    },
    {
      icon: Coffee,
      title: "Leisure Categories",
      desc: "Tag downtime with custom pills. Gym, gaming, reading—see exactly where your free hours go."
    },
    {
      icon: TrendingUp,
      title: "Agile Task Board",
      desc: "Log actual hours per task. Progress sliders, estimated vs actual, and automatic rollover."
    },
    {
      icon: Globe2,
      title: "Timezone Aware",
      desc: "Built for global teams. Midnight rollover respects your local time. Never miss a beat."
    },
    {
      icon: CalendarCheck,
      title: "History & Insights",
      desc: "Review past days at a glance. Spot burnout patterns before they happen."
    }
  ];

  return (
    <section id="features" className="py-24 bg-slate-50/50 dark:bg-slate-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
            Everything You Need to <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">Find Balance</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Designed for focus, built for longevity. Every pixel serves your daily equation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group relative p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 shadow-lg hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-6">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
