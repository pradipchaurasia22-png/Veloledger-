'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function VeloLedgerApp() {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'ledger' | 'chasers' | 'invoices'>('dashboard');
  
  // Invoices State
  const [invoices, setInvoices] = useState<any[]>([
    { id: 'INV-2024-88', client: 'Acme Studio', title: 'Brand Identity Milestone II', amount: 4250, status: 'Overdue 4d', date: 'Due Oct 24' },
    { id: 'INV-2024-91', client: 'BoldCraft Digital', title: 'Design Sprint & Prototype', amount: 7500, status: 'Escrow Funded', date: 'Release in 48h' }
  ]);

  // Form State for creating new invoice
  const [clientName, setClientName] = useState('');
  const [invoiceTitle, setInvoiceTitle] = useState('');
  const [invoiceAmount, setInvoiceAmount] = useState('');

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !invoiceAmount) return;

    const newInv = {
      id: `INV-2024-${Math.floor(10 + Math.random() * 90)}`,
      client: clientName,
      title: invoiceTitle || 'General Milestone',
      amount: parseFloat(invoiceAmount),
      status: 'Pending',
      date: 'Due in 30 days'
    };

    setInvoices([newInv, ...invoices]);
    setClientName('');
    setInvoiceTitle('');
    setInvoiceAmount('');
    setActiveTab('dashboard'); // Switch back to dashboard to see it live
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 pb-28 font-sans">
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

      {/* Main Content Area based on Tab */}
      <main className="px-4 pt-4 max-w-lg mx-auto space-y-4">
        
        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <>
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
                  <button onClick={() => setActiveTab('chasers')} className="mt-3 inline-flex items-center text-xs font-semibold text-indigo-300 bg-indigo-600/30 hover:bg-indigo-600/50 px-3 py-1.5 rounded-lg transition-colors border border-indigo-500/40">
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
                <p className="text-[11px] text-slate-400 mt-1">4 Pending • 1 Overdue</p>
              </div>
              
              <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4">
                <p className="text-xs text-slate-400 font-medium">Avg Days to Pay</p>
                <h3 className="text-xl font-bold text-white mt-1">14.8 Days</h3>
                <p className="text-[11px] text-emerald-400 mt-1">▼ -11.2d vs industry avg</p>
              </div>
            </div>

            {/* Active Client Invoices Section */}
            <div className="pt-2">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold text-white tracking-wide">
                  Active Client Invoices ({invoices.length})
                </h3>
                <button onClick={() => setActiveTab('invoices')} className="text-xs font-semibold text-sky-400 hover:text-sky-300">
                  + Create Invoice
                </button>
              </div>

              <div className="space-y-3">
                {invoices.map((inv, idx) => (
                  <div key={idx} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-white text-sm">{inv.client}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">{inv.title} • {inv.id}</p>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        inv.status.includes('Overdue') ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {inv.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-800/60">
                      <div>
                        <div className="text-base font-extrabold text-white">${inv.amount.toLocaleString()}</div>
                        <div className="text-[11px] text-slate-400">{inv.date}</div>
                      </div>
                      <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors">
                        🔔 Remind Again
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* TAB 2: LEDGER */}
        {activeTab === 'ledger' && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h2 className="text-base font-bold text-white">Financial Ledger</h2>
            <p className="text-xs text-slate-400">Complete transaction and escrow history logs.</p>
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center p-3 bg-slate-950/50 rounded-xl border border-slate-800 text-xs">
                <div>
                  <div className="font-bold text-white">Acme Studio Deposit</div>
                  <div className="text-slate-400 text-[10px]">Escrow Secured</div>
                </div>
                <div className="text-emerald-400 font-extrabold">+$4,250.00</div>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-950/50 rounded-xl border border-slate-800 text-xs">
                <div>
                  <div className="font-bold text-white">BoldCraft Milestone</div>
                  <div className="text-slate-400 text-[10px]">Released to Bank</div>
                </div>
                <div className="text-emerald-400 font-extrabold">+$7,500.00</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CHASERS */}
        {activeTab === 'chasers' && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h2 className="text-base font-bold text-white">WhatsApp Auto-Chaser</h2>
            <p className="text-xs text-slate-400">Automated reminder workflows running for pending & overdue accounts.</p>
            <div className="p-3 bg-indigo-950/40 border border-indigo-500/20 rounded-xl space-y-2 text-xs">
              <div className="font-bold text-indigo-300">Active Sequence: Gentle Reminders</div>
              <p className="text-slate-300 text-[11px]">Next automated ping goes out in 4 hours for unfulfilled milestone signatures.</p>
            </div>
          </div>
        )}

        {/* TAB 4: INVOICES (CREATE INVOICE) */}
        {activeTab === 'invoices' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h2 className="text-base font-bold text-white">Create New Invoice</h2>
            <p className="text-xs text-slate-400">Fill out details below to generate and sync directly to your dashboard.</p>
            
            <form onSubmit={handleCreateInvoice} className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Client Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Apex Corp"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Project / Milestone Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. UI/UX Phase 1"
                  value={invoiceTitle}
                  onChange={(e) => setInvoiceTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Amount ($)</label>
                <input 
                  type="number" 
                  placeholder="5000"
                  value={invoiceAmount}
                  onChange={(e) => setInvoiceAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                  required
                />
              </div>
              <button 
                type="submit"
                className="w-full mt-3 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl transition-colors shadow-lg shadow-sky-600/20"
              >
                Generate & Sync to Dashboard
              </button>
            </form>
          </div>
        )}

      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#090d16]/95 backdrop-blur border-t border-slate-800/80 px-6 py-3 flex justify-between items-center max-w-lg mx-auto text-xs font-medium text-slate-400 z-50">
        <button 
          onClick={() => setActiveTab('dashboard')} 
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'dashboard' ? 'text-sky-400 font-bold' : 'hover:text-slate-200'}`}
        >
          <span>📊</span>
          <span>Dashboard</span>
        </button>
        <button 
          onClick={() => setActiveTab('ledger')} 
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'ledger' ? 'text-sky-400 font-bold' : 'hover:text-slate-200'}`}
        >
          <span>📁</span>
          <span>Ledger</span>
        </button>
        <button 
          onClick={() => setActiveTab('chasers')} 
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'chasers' ? 'text-sky-400 font-bold' : 'hover:text-slate-200'}`}
        >
          <span>⚡</span>
          <span>Chasers</span>
        </button>
        <button 
          onClick={() => setActiveTab('invoices')} 
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'invoices' ? 'text-sky-400 font-bold' : 'hover:text-slate-200'}`}
        >
          <span>📄</span>
          <span>Invoices</span>
        </button>
      </nav>
    </div>
  );
}
