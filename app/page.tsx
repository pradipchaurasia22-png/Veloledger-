'use client';

import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function VeloLedgerApp() {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'ledger' | 'chasers' | 'invoices'>('dashboard');
  const [loadingId, setLoadingId] = useState<string | null>(null);
  
  const [invoices, setInvoices] = useState<any[]>([
    { 
      id: 'INV-2024-88', 
      client: 'Acme Studio', 
      phone: '1234567890', 
      title: 'Brand Identity Milestone II', 
      amount: 4250, 
      status: 'Overdue 4d', 
      date: 'Due Oct 24',
      payLink: 'https://pay.veloledger.app/inv_88'
    },
    { 
      id: 'INV-2024-91', 
      client: 'BoldCraft Digital', 
      phone: '1234567890', 
      title: 'Design Sprint & Prototype', 
      amount: 7500, 
      status: 'Escrow Funded', 
      date: 'Release in 48h (Signed off)',
      payLink: 'https://pay.veloledger.app/inv_91'
    }
  ]);

  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [invoiceTitle, setInvoiceTitle] = useState('');
  const [invoiceAmount, setInvoiceAmount] = useState('');

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !invoiceAmount) return;

    const randomId = Math.floor(10 + Math.random() * 90);
    const newInv = {
      id: `INV-2024-${randomId}`,
      client: clientName,
      phone: clientPhone || '1234567890',
      title: invoiceTitle || 'Strategic Execution Milestone',
      amount: parseFloat(invoiceAmount),
      status: 'Pending Escrow',
      date: 'Due in 30 days',
      payLink: `https://pay.veloledger.app/inv_${randomId}`
    };

    setInvoices([newInv, ...invoices]);
    setClientName('');
    setClientPhone('');
    setInvoiceTitle('');
    setInvoiceAmount('');
    setActiveTab('dashboard');
  };

  const sendWhatsAppReminder = (inv: any) => {
    // Falls back to direct automated chat dispatch which works instantly on mobile devices
    const message = encodeURIComponent(
      `🏛️ *VELOLEDGER INSTITUTIONAL SETTLEMENT NOTICE*\n\n` +
      `Dear *${inv.client}*,\n\n` +
      `This is a priority settlement dispatch for milestone *"${inv.title}"* reference *(${inv.id})*.\n\n` +
      `• *Statement Balance:* $${inv.amount.toLocaleString()}.00\n` +
      `• *Current Standing:* ${inv.status}\n\n` +
      `To secure continuous enterprise velocity and finalize this release, please authorize payment immediately via our secure gateway:\n` +
      `🔗 ${inv.payLink}\n\n` +
      `_Secure Escrow Handled via VeloLedger Infrastructure_`
    );
    window.open(`https://wa.me/${inv.phone}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 pb-32 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Elite Institutional Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#070a12]/80 border-b border-slate-800/80 px-5 pt-4 pb-3 max-w-lg mx-auto flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-black tracking-wider text-white uppercase font-mono">VeloLedger</h1>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">PRO</span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium tracking-tight">Enterprise Escrow & Cash Velocity Engine</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Mobile Active
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="px-4 pt-4 max-w-lg mx-auto space-y-4">
        
        {activeTab === 'dashboard' && (
          <>
            {/* Viral Growth Metric Card */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#111827] via-[#0d1322] to-[#161e31] border border-indigo-500/30 rounded-2xl p-4 shadow-2xl">
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none"></div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono tracking-wider text-indigo-400 uppercase font-semibold">Velocity Index</span>
                  <h2 className="text-sm font-bold text-white mt-0.5">14.8 Days Average Settlement</h2>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                    Automated chasers have accelerated your incoming capital flow by <span className="text-emerald-400 font-bold">11.2 days</span> vs industry standard.
                  </p>
                </div>
                <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20 shrink-0">
                  ⚡
                </div>
              </div>
            </div>

            {/* Financial Overview Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#101726]/80 backdrop-blur border border-slate-800/80 rounded-2xl p-4 shadow-lg">
                <p className="text-[11px] text-slate-400 font-medium">Total Lifetime Volume</p>
                <h3 className="text-xl font-black text-white mt-1 tracking-tight">$148,650</h3>
                <p className="text-[10px] text-emerald-400 font-semibold mt-1">▲ +14.2% this quarter</p>
              </div>
              
              <div className="bg-[#101726]/80 backdrop-blur border border-slate-800/80 rounded-2xl p-4 shadow-lg">
                <p className="text-[11px] text-slate-400 font-medium">Active Receivables</p>
                <h3 className="text-xl font-black text-white mt-1 tracking-tight">$18,420</h3>
                <p className="text-[10px] text-amber-400 font-semibold mt-1">1 Overdue ($3,200)</p>
              </div>
            </div>

            {/* Active Invoices Section */}
            <div className="pt-1">
              <div className="flex justify-between items-center mb-3 px-1">
                <h3 className="text-xs font-bold text-slate-200 tracking-wider uppercase font-mono">
                  Tracked Invoices ({invoices.length})
                </h3>
                <button onClick={() => setActiveTab('invoices')} className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 cursor-pointer">
                  + Issue Invoice
                </button>
              </div>

              <div className="space-y-3">
                {invoices.map((inv, idx) => (
                  <div key={idx} className="bg-[#101726]/90 backdrop-blur border border-slate-800/90 rounded-2xl p-4 shadow-xl hover:border-slate-700 transition-all">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-white text-sm">{inv.client}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">{inv.title} • <span className="font-mono text-slate-300">{inv.id}</span></p>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        inv.status.includes('Overdue') ? 'bg-rose-500/10 text-rose-400 border border-rose-500/25' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'
                      }`}>
                        {inv.status}
                      </span>
                    </div>

                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-800/60">
                      <div>
                        <div className="text-base font-black text-white tracking-tight">${inv.amount.toLocaleString()}.00</div>
                        <div className="text-[10px] text-slate-400">{inv.date}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <a 
                          href={inv.payLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <span>💳</span> Pay
                        </a>
                        <button 
                          onClick={() => sendWhatsAppReminder(inv)}
                          className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-semibold rounded-xl border border-emerald-500/30 transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <span>💬</span> Chase
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'ledger' && (
          <div className="bg-[#101726]/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider">Financial Ledger</h2>
            <p className="text-xs text-slate-400">Verified transaction logs and escrow vault allocations.</p>
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center p-3.5 bg-[#070a12] rounded-xl border border-slate-800/80 text-xs">
                <div>
                  <div className="font-bold text-white">Acme Studio Milestone II</div>
                  <div className="text-slate-400 text-[10px] font-mono mt-0.5">Escrow Vault Secured • ID: TX-9921</div>
                </div>
                <div className="text-emerald-400 font-black font-mono">+$4,250.00</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'chasers' && (
          <div className="bg-[#101726]/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider">WhatsApp Auto-Chaser Engine</h2>
            <p className="text-xs text-slate-400">One-tap institutional escalation sequences loaded with direct secure payment links.</p>
            <div className="p-3.5 bg-[#070a12] rounded-xl border border-slate-800/80 text-xs space-y-2">
              <div className="font-bold text-indigo-400 flex items-center gap-1.5">
                <span>🛡️</span> Smart Gateway Dispatch
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Tapping chase instantly formats an institutional reminder pre-loaded with secure payment buttons for your clients.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'invoices' && (
          <div className="bg-[#101726]/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider">Deploy New Invoice</h2>
            <p className="text-xs text-slate-400">Generate an instant payment link and dashboard ledger entry.</p>
            
            <form onSubmit={handleCreateInvoice} className="space-y-3 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Client Name / Entity</label>
                <input 
                  type="text" 
                  placeholder="e.g. Nexus Interactive"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-[#070a12] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">WhatsApp Phone (with Country Code)</label>
                <input 
                  type="text" 
                  placeholder="e.g. 1234567890"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full bg-[#070a12] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Milestone Description</label>
                <input 
                  type="text" 
                  placeholder="e.g. Phase 1 Architecture Sign-off"
                  value={invoiceTitle}
                  onChange={(e) => setInvoiceTitle(e.target.value)}
                  className="w-full bg-[#070a12] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Amount ($ USD)</label>
                <input 
                  type="number" 
                  placeholder="5000"
                  value={invoiceAmount}
                  onChange={(e) => setInvoiceAmount(e.target.value)}
                  className="w-full bg-[#070a12] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all"
                  required
                />
              </div>
              <button 
                type="submit"
                className="w-full mt-2 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-indigo-600/30 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>⚡</span> Generate Escrow Link & Sync
              </button>
            </form>
          </div>
        )}

      </main>

      {/* Elite Floating Bottom Navigation */}
      <nav className="fixed bottom-3 left-4 right-4 bg-[#070a12]/90 backdrop-blur-xl border border-slate-800/80 px-4 py-2.5 flex justify-between items-center max-w-md mx-auto text-[11px] font-medium text-slate-400 z-50 rounded-2xl shadow-2xl">
        <button 
          onClick={() => setActiveTab('dashboard')} 
          className={`flex flex-col items-center gap-1 transition-all cursor-pointer ${activeTab === 'dashboard' ? 'text-indigo-400 font-bold scale-105' : 'hover:text-slate-200'}`}
        >
          <span className="text-sm">📊</span>
          <span>Dashboard</span>
        </button>
        <button 
          onClick={() => setActiveTab('ledger')} 
          className={`flex flex-col items-center gap-1 transition-all cursor-pointer ${activeTab === 'ledger' ? 'text-indigo-400 font-bold scale-105' : 'hover:text-slate-200'}`}
        >
          <span className="text-sm">📁</span>
          <span>Ledger</span>
        </button>
        <button 
          onClick={() => setActiveTab('chasers')} 
          className={`flex flex-col items-center gap-1 transition-all cursor-pointer ${activeTab === 'chasers' ? 'text-indigo-400 font-bold scale-105' : 'hover:text-slate-200'}`}
        >
          <span className="text-sm">⚡</span>
          <span>Chasers</span>
        </button>
        <button 
          onClick={() => setActiveTab('invoices')} 
          className={`flex flex-col items-center gap-1 transition-all cursor-pointer ${activeTab === 'invoices' ? 'text-indigo-400 font-bold scale-105' : 'hover:text-slate-200'}`}
        >
          <span className="text-sm">📄</span>
          <span>Invoices</span>
        </button>
      </nav>
    </div>
  );
}
