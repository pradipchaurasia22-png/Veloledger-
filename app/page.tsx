'use client';

import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function VeloLedgerApp() {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'ledger' | 'chasers' | 'invoices'>('dashboard');
  
  const [invoices, setInvoices] = useState<any[]>([
    { id: 'INV-2024-88', client: 'Acme Studio', phone: '1234567890', title: 'Brand Identity Milestone II', amount: 4250, status: 'Overdue 4d', date: 'Due Oct 24' },
    { id: 'INV-2024-91', client: 'BoldCraft Digital', phone: '1234567890', title: 'Design Sprint & Prototype', amount: 7500, status: 'Escrow Funded', date: 'Release in 48h (Signed off)' }
  ]);

  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [invoiceTitle, setInvoiceTitle] = useState('');
  const [invoiceAmount, setInvoiceAmount] = useState('');

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !invoiceAmount) return;

    const newInv = {
      id: `INV-2024-${Math.floor(10 + Math.random() * 90)}`,
      client: clientName,
      phone: clientPhone || '1234567890',
      title: invoiceTitle || 'General Milestone',
      amount: parseFloat(invoiceAmount),
      status: 'Pending',
      date: 'Due in 30 days'
    };

    setInvoices([newInv, ...invoices]);
    setClientName('');
    setClientPhone('');
    setInvoiceTitle('');
    setInvoiceAmount('');
    setActiveTab('dashboard');
  };

  const sendWhatsAppReminder = (inv: any) => {
    const message = encodeURIComponent(
      `🚨 *VELOLEDGER ESCROW NOTICE*\n\n` +
      `Hi *${inv.client}*,\n\n` +
      `This is an automated priority escalation regarding pending settlement for milestone: *"${inv.title}"* (${inv.id}).\n\n` +
      `• *Amount Due:* $${inv.amount.toLocaleString()}.00\n` +
      `• *Status:* ${inv.status}\n` +
      `• *Impact:* Delaying this sign-off affects ElenaStudio's cross-platform cash velocity tier.\n\n` +
      `Kindly complete the escrow release or direct bank transfer immediately to clear this block.\n\n` +
      `_Powered by VeloLedger Enterprise Automation_`
    );
    window.open(`https://wa.me/${inv.phone}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 pb-28 font-sans selection:bg-sky-500 selection:text-white">
      {/* Top Header */}
      <header className="flex justify-between items-center px-5 pt-5 pb-4 border-b border-slate-800/60 max-w-lg mx-auto">
        <div>
          <h1 className="text-xl font-black tracking-tight text-white">VeloLedger</h1>
          <p className="text-[11px] text-slate-400 font-medium">Enterprise Escrow & Cash Velocity</p>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Auto-Chaser Active
          </span>
          <span className="text-xs font-semibold text-slate-300">ElenaStudio Velocity</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="px-4 pt-4 max-w-lg mx-auto space-y-4">
        
        {activeTab === 'dashboard' && (
          <>
            {/* Viral Growth Banner */}
            <div className="bg-gradient-to-r from-indigo-900/40 via-[#111827] to-purple-900/40 border border-indigo-500/30 rounded-2xl p-4 shadow-xl">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20 text-lg">
                  🚀
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">Cash Velocity Boosted</h2>
                  <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                    Your automated WhatsApp chasers have saved you roughly 11 days of waiting per client invoice this month.
                  </p>
                  <button onClick={() => alert('Viral Share Link Copied! Share your velocity score on X or LinkedIn.')} className="mt-3 inline-flex items-center text-xs font-semibold text-indigo-300 bg-indigo-600/30 hover:bg-indigo-600/50 px-3 py-1.5 rounded-lg transition-colors border border-indigo-500/40 cursor-pointer">
                    Share Velocity Badge &rarr;
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-[#111827] border border-slate-800/80 rounded-2xl p-4 shadow-md">
              <p className="text-xs text-slate-400 font-medium">Total Lifetime Earnings</p>
              <h3 className="text-2xl font-extrabold text-white mt-1">$148,650.00</h3>
              <p className="text-xs text-emerald-400 font-medium mt-1 flex items-center gap-1">
                ▲ +14.2% vs previous quarter
              </p>
            </div>

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

            <div className="pt-2">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold text-white tracking-wide">
                  Active Client Invoices ({invoices.length + 12})
                </h3>
                <button onClick={() => setActiveTab('invoices')} className="text-xs font-semibold text-sky-400 hover:text-sky-300 cursor-pointer">
                  + Create Invoice
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
                      <button 
                        onClick={() => sendWhatsAppReminder(inv)}
                        className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 text-xs font-semibold rounded-lg border border-emerald-500/30 transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <span>💬</span> WhatsApp Chase
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

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

        {activeTab === 'chasers' && (
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <h2 className="text-base font-bold text-white">WhatsApp Auto-Chaser Engine</h2>
            <p className="text-xs text-slate-400">Automated multi-step reminder sequences deployed to sluggish clients.</p>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs space-y-2">
              <div className="font-bold text-white">Active Sequence: 3-Day Escalation</div>
              <p className="text-slate-400 text-[11px]">Sends high-impact automated pings on WhatsApp once milestone sign-offs hit the window.</p>
            </div>
          </div>
        )}

        {activeTab === 'invoices' && (
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <h2 className="text-base font-bold text-white">Generate New Invoice</h2>
            <p className="text-xs text-slate-400">Fill in details to instantly deploy a trackable escrow card.</p>
            
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
                <label className="block text-xs font-medium text-slate-300 mb-1">Client WhatsApp Number (with country code)</label>
                <input 
                  type="text" 
                  placeholder="e.g. 1234567890"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
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
                className="w-full mt-3 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl transition-colors shadow-lg shadow-sky-600/25 cursor-pointer"
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
          className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${activeTab === 'dashboard' ? 'text-sky-400 font-bold' : 'hover:text-slate-200'}`}
        >
          <span>📊</span>
          <span>Dashboard</span>
        </button>
        <button 
          onClick={() => setActiveTab('ledger')} 
          className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${activeTab === 'ledger' ? 'text-sky-400 font-bold' : 'hover:text-slate-200'}`}
        >
          <span>📁</span>
          <span>Ledger</span>
        </button>
        <button 
          onClick={() => setActiveTab('chasers')} 
          className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${activeTab === 'chasers' ? 'text-sky-400 font-bold' : 'hover:text-slate-200'}`}
        >
          <span>⚡</span>
          <span>Chasers</span>
        </button>
        <button 
          onClick={() => setActiveTab('invoices')} 
          className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${activeTab === 'invoices' ? 'text-sky-400 font-bold' : 'hover:text-slate-200'}`}
        >
          <span>📄</span>
          <span>Invoices</span>
        </button>
      </nav>
    </div>
  );
}
