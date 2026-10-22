'use client';

import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function VeloLedgerApp() {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'ledger' | 'chasers' | 'invoices'>('dashboard');
  
  // Invoices State
  const [invoices, setInvoices] = useState<any[]>([
    { id: 'INV-2024-88', client: 'Acme Studio', title: 'Brand Identity Milestone II', amount: 4250, status: 'Overdue 4d', date: 'Due Oct 24' },
    { id: 'INV-2024-91', client: 'BoldCraft Digital', title: 'Design Sprint & Prototype', amount: 7500, status: 'Escrow Funded', date: 'Release in 48h (Signed off)' }
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
    setActiveTab('dashboard');
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 pb-28 font-sans">
      {/* Top Header matching screenshot */}
      <header className="flex justify-between items-center px-6 pt-6 pb-4 border-b border-slate-800/60">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white">VeloLedger</h1>
          <p className="text-xs text-slate-400 font-medium">Enterprise Escrow & Cash Velocity</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-300">ElenaStudio Velocity</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="px-4 pt-4 max-w-lg mx-auto space-y-4">
        
        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <>
            {/* Auto-Chaser Status Badge Bar */}
            <div className="flex justify-between items-center px-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Auto-Chaser Active
              </span>
            </div>

            {/* Automated Escrow Alert Card */}
            <div className="bg-[#111827] border border-indigo-500/30 rounded-2xl p-4 shadow-xl">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20 text-lg">
                  ⚡
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">Automated Escrow Alert</h2>
                  <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                    2 invoices escalated to WhatsApp chaser: Acme Studio & BoldCraft.
                  </p>
                  <button onClick={() => setActiveTab('chasers')} className="mt-3 inline-flex items-center text-xs font-semibold text-indigo-300 bg-indigo-600/30 hover:bg-indigo-600/50 px-3 py-1.5 rounded-lg transition-colors border border-indigo-500/40">
                    View Escalations &rarr;
                  </button>
                </div>
              </div>
            </div>

            {/* Total Lifetime Earnings Card */}
            <div className="bg-[#111827] border border-slate-800/80 rounded-2xl p-4 shadow-md">
              <p className="text-xs text-slate-400 font-medium">Total Lifetime Earnings</p>
              <h3 className="text-2xl font-extrabold text-white mt-1">$148,650.00</h3>
              <p className="text-xs text-emerald-400 font-medium mt-1 flex items-center gap-1">
                ▲ +14.2% vs previous quarter
              </p>
            </div>

            {/* Dual Grid Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#111827] border border-slate-800/80 rounded-2xl p-4 shadow-md">
                <p className="text-xs text-slate-400 font-medium">Outstanding (A/R)</p>
                <h3 className="text-xl font-bold text-white mt-1">$18,420.00</h3>
                <p className="text-[11px] text-slate-400 mt-1">4 Pending • 1 Overdue ($3,200)</p>
              </div>
              
              <div className="bg-[#111827] border border-slate-800/80 rounded-2xl p-4 shadow-md">
                <p className="text-xs text-slate-400 font-medium">Avg Days to Pay (Speed)</p>
                <h3 className="text-xl font-bold text-white mt-1">14.8 Days</h3>
                <p className="text-[11px] text-emerald-400 mt-1">▼ -11.2d vs 26d industry avg</p>
              </div>
            </div>

            {/* Active Client Invoices Section */}
            <div className="pt-2">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold text-white tracking-wide">
                  Active Client Invoices ({invoices.length + 12})
                </h3>
                <button onClick={() => setActiveTab('invoices')} className="text-xs font-semibold text-sky-400 hover:text-sky-300">
                  View all / Add
                </button>
              </div>

              <div className="space-y-3">
                {invoices.map((inv, idx) => (
                  <div key={idx} className="bg-[#111827] border border-slate-800 rounded-2xl p-4 shadow-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-white text-sm">{inv.client}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">{inv.title} • {inv.id}</p>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        inv.status.includes('Overdue') ? 'bg-rose-500/10 text-rose-400 border border-rose-500/25' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'
                      }`}>
                        {inv.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-800/60">
                      <div>
                        <div className="text-base font-extrabold text-white">${inv.amount.toLocaleString()}.00</div>
                        <div className="text-[11px] text-slate-400">{inv.date}</div>
                      </div>
                      {inv.status.includes('Overdue') ? (
                        <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors">
                          🔔 Remind Again
                        </button>
                      ) : (
                        <div className="text-xs text-slate-400 font-mono bg-slate-800/60 px-2 py-1 rounded border border-slate-700/50">
                          Chase ***4012
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* TAB 2: LEDGER */}
        {activeTab === 'ledger' && (
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <h2 className="text-base font-bold text-white">Financial Ledger</h2>
            <p className="text-xs text-slate-400">Complete transaction logs and escrow balances.</p>
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs">
                <div>
                  <div className="font-bold text-white">Acme Studio Deposit</div>
                  <div className="text-slate-400 text-[10px]">Escrow Secured</div>
                </div>
                <div className="text-emerald-400 font-extrabold">+$4,250.00</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CHASERS */}
        {activeTab === 'chasers' && (
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <h2 className="text-base font-bold text-white">WhatsApp Auto-Chaser</h2>
            <p className="text-xs text-slate-400">Automated reminder sequences running smoothly.</p>
          </div>
        )}

        {/* TAB 4: INVOICES (CREATOR) */}
        {activeTab === 'invoices' && (
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <h2 className="text-base font-bold text-white">Generate New Invoice</h2>
            <p className="text-xs text-slate-400">Fill in the form to push a live card straight to your dashboard.</p>
            
            <form onSubmit={handleCreateInvoice} className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Client Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. PixelCraft"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Project Milestone</label>
                <input 
                  type="text" 
                  placeholder="e.g. Frontend Integration"
                  value={invoiceTitle}
                  onChange={(e) => setInvoiceTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Amount ($)</label>
                <input 
                  type="number" 
                  placeholder="3500"
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
                Create & Sync to Dashboard
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
