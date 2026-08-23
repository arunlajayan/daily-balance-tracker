"use client";

import Link from "next/link";
import { ArrowRight, Zap, Shield, Users } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative pt-20 pb-24 md:pt-32 md:pb-48 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-pink-500/5 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-emerald-500/15 via-cyan-500/10 to-blue-500/5 blur-3xl rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-sm shadow-sm mb-8">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Now supporting distributed agile teams</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
          Master Your <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">24-Hour</span> Day
        </h1>

        <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-10 leading-relaxed">
          The intelligent balance tracker that ensures <span className="font-semibold text-slate-800 dark:text-slate-100">Work + Sleep + Leisure = 24.0</span>. Built for developers, creators, and remote teams who refuse to burn out.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link href="/users/create" className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 transition-all duration-300">
            Start Tracking Free
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
          <Link href="#features" className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-slate-700 dark:text-slate-200 bg-white/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 rounded-xl shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-all duration-300">
            View Demo
          </Link>
        </div>

        {/* Trust/Features Mini Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {[
            { icon: Zap, title: "60-Second Logging", desc: "Zero friction. Update your day in seconds." },
            { icon: Shield, title: "100% Private", desc: "Your data stays on your device. No tracking." },
            { icon: Users, title: "Team Ready", desc: "Perfect for distributed agile squads." }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center p-6 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
              <item.icon className="w-8 h-8 text-indigo-500 mb-3" />
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">{item.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
