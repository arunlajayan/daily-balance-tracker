"use client";

import Link from "next/link";
import { LayoutDashboard, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">BalanceOS</span>
            </Link>
            <p className="text-slate-400 mb-6 max-w-md">
              The open-source 24-hour balance tracker for distributed teams. Built with React, Tailwind, and obsession over detail.
            </p>
            <div className="flex gap-4">
              {[Mail].map((Icon, i) => (
                <a key={i} href="#" className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors" aria-label="Social link">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors">Features</Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors">Changelog</Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors">Roadmap</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Support</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors">Documentation</Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors">API Reference</Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors">Community</Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">© {new Date().getFullYear()} BalanceOS. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-slate-500">
            <Link href="#" className="hover:text-slate-300 transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-slate-300 transition-colors">Terms</Link>
            <Link href="#" className="hover:text-slate-300 transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
