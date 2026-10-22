'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function Dashboard() {
  const supabase = createClient();
  const [invoices, setInvoices] = useState<any[]>([]);

  useEffect(() => {
    async function fetchInvoices() {
      const { data, error } = await supabase.from('invoices').select('*');
      if (data && !error) {
        setInvoices(data);
      }
    }
    fetchInvoices();
  }, [supabase]);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 pb-24 font-sans">
      {/* Top Header */}
      <header className="flex justify-between items-center px-6 pt-6 pb-4 border-b border-slate-800/60">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white">VeloLedger</h1>
          <p className="text-xs text-slate-400 font-medium">Enterprise Escrow & Cash Velocity</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Auto-Chaser Active
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="px-4 pt-4 max-w-lg mx-auto space-y-4">
        
        {/* Automated Escrow Alert Card */}
        <div className="bg-gradient-to-r from-indigo-950/80 to-slate-900/90 border border-indigo-500/30 rounded-2xl p-4 shadow-lg">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20 text-lg">
              ⚡
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Automated Escrow Alert</h2>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                Invoices escalated to WhatsApp chaser: Acme Studio & BoldCraft.
              </p>
              <button className="mt-3 inline-flex items-center text-xs font-semibold text-indigo-300 bg-indigo-600/30 hover:bg-indigo-600/50 px-3 py-1.5 rounded-lg transition-colors border border-indigo-500/40">
                View Escalations &rarr;
              </button>
            </div>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4">
          <p className="text-xs text-slate-400 font-medium">Total Lifetime Earnings</p>
          <h3 className="text-2xl font-extrabold text-white mt-1">$148,650.00</h3>
          <p className="text-xs text-emerald-400 font-medium mt-1 flex items-center gap-1">
            ▲ +14.2% vs previous quarter
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4">
            <p className="text-xs text-slate-400 font-medium">Outstanding (A/R)</p>
            <h3 className="text-xl font-bold text-white mt-1">$18,420.00</h3>
            <p className="text-[11px] text-slate-400 mt-1">4 Pending • 1 Overdue ($3,200)</p>
          </div>
          
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4">
            <p className="text-xs text-slate-400 font-medium">Avg Days to Pay</p>
            <h3 className="text-xl font-bold text-white mt-1">14.8 Days</h3>
            <p className="text-[11px] text-emerald-400 mt-1">▼ -11.2d vs 26d industry avg</p>
          </div>
        </div>

        {/* Active Client Invoices Section */}
        <div className="pt-2">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold text-white tracking-wide">
              Active Client Invoices ({invoices.length > 0 ? invoices.length : 14})
            </h3>
            <button className="text-xs font-semibold text-sky-400 hover:text-sky-300">View all</button>
          </div>

          <div className="space-y-3">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-white text-sm">Acme Studio</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Brand Identity Milestone II • #INV-2024-88</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  Overdue 4d
                </span>
              </div>
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-800/60">
                <div>
                  <div className="text-base font-extrabold text-white">$4,250.00</div>
                  <div className="text-[11px] text-slate-400">Due Oct 24</div>
                </div>
                <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors">
                  🔔 Remind Again
                </button>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-white text-sm">BoldCraft Digital</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Design Sprint & Prototype • #INV-2024-91</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Escrow Funded
                </span>
              </div>
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-800/60">
                <div>
                  <div className="text-base font-extrabold text-white">$7,500.00</div>
                  <div className="text-[11px] text-emerald-400 font-medium">Release in 48h (Signed off)</div>
                </div>
                <div className="text-xs text-slate-400 font-mono bg-slate-800/60 px-2 py-1 rounded border border-slate-700/50">
                  Chase ***4012
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#090d16]/95 backdrop-blur border-t border-slate-800/80 px-6 py-3 flex justify-between items-center max-w-lg mx-auto text-xs font-medium text-slate-400">
        <button className="flex flex-col items-center gap-1 text-sky-400">
          <span>📊</span>
          <span>Dashboard</span>
        </button>
        <button className="flex flex-col items-center gap-1 hover:text-slate-200 transition-colors">
          <span>📁</span>
          <span>Ledger</span>
        </button>
        <button className="flex flex-col items-center gap-1 hover:text-slate-200 transition-colors">
          <span>⚡</span>
          <span>Chasers</span>
        </button>
        <button className="flex flex-col items-center gap-1 hover:text-slate-200 transition-colors">
          <span>📄</span>
          <span>Invoices</span>
        </button>
      </nav>
    </div>
  );
}
