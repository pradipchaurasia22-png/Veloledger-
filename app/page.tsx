'use client';

import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function VeloLedgerApp() {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'vault' | 'chasers' | 'invoices'>('dashboard');
  
  // Client portal view state (simulates what the client sees when opening payLink)
  const [clientViewInvoice, setClientViewInvoice] = useState<any | null>(null);
  const [simulatedPaid, setSimulatedPaid] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'upi'>('stripe');

  const [invoices, setInvoices] = useState<any[]>([
    { 
      id: 'INV-2024-88', 
      client: 'Acme Studio', 
      phone: '1234567890', 
      title: 'Brand Identity Milestone II', 
      amount: 4250, 
      status: 'Locked (Awaiting Settlement)', 
      date: 'Due Oct 24',
      payLink: 'https://buy.stripe.com/test_12345',
      upiId: 'veloledger@upi',
      deliverableName: 'Acme_Brand_Guidelines_v2.fig + Vector Assets',
      deliverableUrl: 'https://figma.com/@sample-locked-asset',
      isLocked: true
    },
    { 
      id: 'INV-2024-91', 
      client: 'BoldCraft Digital', 
      phone: '1234567890', 
      title: 'Design Sprint & Prototype', 
      amount: 7500, 
      status: 'Escrow Funded', 
      date: 'Release in 48h (Signed off)',
      payLink: 'https://buy.stripe.com/test_67890',
      upiId: 'veloledger@upi',
      deliverableName: 'NextGen_Design_Sprint_Final_Code.zip',
      deliverableUrl: 'https://github.com/sample/protected-repo',
      isLocked: false
    }
  ]);

  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [invoiceTitle, setInvoiceTitle] = useState('');
  const [invoiceAmount, setInvoiceAmount] = useState('');
  const [stripePayLink, setStripePayLink] = useState('');
  const [upiIdInput, setUpiIdInput] = useState('');
  const [deliverableName, setDeliverableName] = useState('');
  const [deliverableUrl, setDeliverableUrl] = useState('');

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
      status: 'Locked (Escrow Pending)',
      date: 'Due in 30 days',
      payLink: stripePayLink || 'https://buy.stripe.com/sample',
      upiId: upiIdInput || 'veloledger@upi',
      deliverableName: deliverableName || 'Final Production Assets.zip',
      deliverableUrl: deliverableUrl || 'https://drive.google.com/sample-locked-file',
      isLocked: true
    };

    setInvoices([newInv, ...invoices]);
    setClientName('');
    setClientPhone('');
    setInvoiceTitle('');
    setInvoiceAmount('');
    setStripePayLink('');
    setUpiIdInput('');
    setDeliverableName('');
    setDeliverableUrl('');
    setActiveTab('dashboard');
  };

  const sendWhatsAppReminder = (inv: any) => {
    const message = encodeURIComponent(
      `🏛️ *VELOLEDGER EXECUTIVE DISPATCH*\n\n` +
      `Hi *${inv.client}*,\n\n` +
      `I'm following up on the pending settlement for *"${inv.title}"* (${inv.id}).\n\n` +
      `• *Statement Balance:* $${inv.amount.toLocaleString()}.00\n` +
      `• *Deliverable Status:* 🔒 Locked in Secure Escrow Vault (${inv.deliverableName})\n\n` +
      `Authorize settlement below via Stripe (Card/ApplePay) or Instant UPI to unlock your assets:\n` +
      `🔗 ${inv.payLink}\n\n` +
      `_Let me know once initiated so we can verify release keys._`
    );
    window.open(`https://wa.me/${inv.phone}?text=${message}`, '_blank');
  };

  // If client opens the pay link, render the secure Escrow Paywall Portal
  if (clientViewInvoice) {
    const upiDeepLink = `upi://pay?pa=${clientViewInvoice.upiId}&pn=VeloLedger%20Escrow&am=${clientViewInvoice.amount}&cu=INR&tn=Invoice%20${clientViewInvoice.id}`;

    return (
      <div className="min-h-screen bg-[#070a12] text-slate-100 p-6 flex flex-col justify-between font-sans">
        <div className="max-w-md mx-auto w-full space-y-5 pt-4">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <span>🛡️</span> VELOLEDGER SECURE ESCROW VAULT
            </div>
            <h1 className="text-xl font-black text-white tracking-tight">Milestone Settlement Portal</h1>
            <p className="text-xs text-slate-400">Prepared for <strong className="text-slate-200">{clientViewInvoice.client}</strong></p>
          </div>

          {/* Invoice Summary Card */}
          <div className="bg-[#101726] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-start border-b border-slate-800/80 pb-4">
              <div>
                <p className="text-[10px] text-slate-400 font-mono uppercase">Reference ID</p>
                <h3 className="text-sm font-bold text-white mt-0.5">{clientViewInvoice.id}</h3>
                <p className="text-xs text-slate-300 mt-1">{clientViewInvoice.title}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-400 font-mono uppercase">Amount Due</p>
                <h3 className="text-lg font-black text-white mt-0.5">${clientViewInvoice.amount.toLocaleString()}.00</h3>
              </div>
            </div>

            {/* Deliverable Vault Preview */}
            <div className="bg-[#070a12] border border-slate-800/90 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <span>{simulatedPaid ? '📂' : '🔒'}</span> Protected Deliverable Asset
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                  simulatedPaid ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}>
                  {simulatedPaid ? 'UNLOCKED' : 'LOCKED BY ESCROW'}
                </span>
              </div>
              
              <div className="text-xs font-mono text-slate-300 bg-[#101726] p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
                <span className="truncate max-w-[200px]">{clientViewInvoice.deliverableName}</span>
                <span className="text-[10px] text-slate-500">254 MB</span>
              </div>

              {!simulatedPaid ? (
                <p className="text-[11px] text-amber-400/90 bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-lg">
                  ⚠️ Files are cryptographically sealed. Completing payment via Stripe or UPI instantly unlocks full production access.
                </p>
              ) : (
                <div className="space-y-2">
                  <p className="text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-lg font-medium">
                    ✅ Settlement Confirmed! Escrow release verified.
                  </p>
                  <a 
                    href={clientViewInvoice.deliverableUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs text-center rounded-xl transition-all shadow-lg shadow-emerald-600/20"
                  >
                    📥 Download Verified Production Assets
                  </a>
                </div>
              )}
            </div>

            {!simulatedPaid && (
              <div className="space-y-3 pt-1">
                {/* Payment Gateway Toggle */}
                <div className="grid grid-cols-2 gap-2 bg-[#070a12] p-1 rounded-xl border border-slate-800">
                  <button 
                    onClick={() => setPaymentMethod('stripe')}
                    className={`py-2 text-xs font-bold rounded-lg transition-all ${
                      paymentMethod === 'stripe' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    💳 Card / Stripe
                  </button>
                  <button 
                    onClick={() => setPaymentMethod('upi')}
                    className={`py-2 text-xs font-bold rounded-lg transition-all ${
                      paymentMethod === 'upi' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    📱 Instant UPI
                  </button>
                </div>

                {paymentMethod === 'stripe' ? (
                  <div className="space-y-2">
                    <a 
                      href={clientViewInvoice.payLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>💳</span> Pay with Stripe (Credit/Debit/ApplePay)
                    </a>
                    <button 
                      onClick={() => setSimulatedPaid(true)}
                      className="w-full py-2 text-[10px] text-slate-400 hover:text-slate-200 text-center underline cursor-pointer"
                    >
                      [Demo Mode: Simulate Instant Stripe Payment]
                    </button>
                  </div>
                ) : (
                  <div className="bg-[#070a12] border border-slate-800 rounded-xl p-4 text-center space-y-3">
                    <div className="text-xs font-bold text-slate-200">Pay via Any UPI App</div>
                    <div className="bg-[#101726] border border-slate-800 p-2.5 rounded-lg text-xs font-mono text-emerald-400 font-bold select-all">
                      {clientViewInvoice.upiId}
                    </div>
                    <a 
                      href={upiDeepLink}
                      className="block w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-emerald-600/20"
                    >
                      🚀 Open GPay / PhonePe / Paytm
                    </a>
                    <button 
                      onClick={() => setSimulatedPaid(true)}
                      className="w-full py-1.5 text-[10px] text-slate-400 hover:text-slate-200 text-center underline cursor-pointer"
                    >
                      [Demo Mode: Confirm Manual UPI Receipt]
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Back button */}
          <button 
            onClick={() => { setClientViewInvoice(null); setSimulatedPaid(false); }}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition-all cursor-pointer"
          >
            ← Return to VeloLedger Dashboard
          </button>
        </div>

        <div className="text-center text-[10px] text-slate-500 py-4 font-mono">
          Secured & Verified by VeloLedger Enterprise Infrastructure
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 pb-32 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header */}
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
            Stripe + UPI Active
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="px-4 pt-4 max-w-lg mx-auto space-y-4">
        
        {activeTab === 'dashboard' && (
          <>
            {/* ROI Metric Card */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#111827] via-[#0d1322] to-[#161e31] border border-indigo-500/30 rounded-2xl p-4 shadow-2xl">
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none"></div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono tracking-wider text-indigo-400 uppercase font-semibold">Velocity Index & ROI</span>
                  <h2 className="text-sm font-bold text-white mt-0.5">14.8 Days Average Settlement</h2>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                    Multi-gateway paywalls (Stripe + UPI) have secured <span className="text-emerald-400 font-bold">$11,750</span> in deliverables with zero payment delay.
                  </p>
                </div>
                <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20 shrink-0">
                  🛡️
                </div>
              </div>
            </div>

            {/* Financial Overview Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#101726]/80 backdrop-blur border border-slate-800/80 rounded-2xl p-4 shadow-lg">
                <p className="text-[11px] text-slate-400 font-medium">Secured Volume</p>
                <h3 className="text-xl font-black text-white mt-1 tracking-tight">$148,650</h3>
                <p className="text-[10px] text-emerald-400 font-semibold mt-1">▲ +14.2% this quarter</p>
              </div>
              
              <div className="bg-[#101726]/80 backdrop-blur border border-slate-800/80 rounded-2xl p-4 shadow-lg">
                <p className="text-[11px] text-slate-400 font-medium">Locked Vaults</p>
                <h3 className="text-xl font-black text-white mt-1 tracking-tight">{invoices.length} Active</h3>
                <p className="text-[10px] text-amber-400 font-semibold mt-1">Pending Settlement</p>
              </div>
            </div>

            {/* Active Invoices Section */}
            <div className="pt-1">
              <div className="flex justify-between items-center mb-3 px-1">
                <h3 className="text-xs font-bold text-slate-200 tracking-wider uppercase font-mono">
                  Escrow Vault & Invoices ({invoices.length})
                </h3>
                <button onClick={() => setActiveTab('invoices')} className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 cursor-pointer">
                  + New Locked Asset
                </button>
              </div>

              <div className="space-y-3">
                {invoices.map((inv, idx) => (
                  <div key={idx} className="bg-[#101726]/90 backdrop-blur border border-slate-800/90 rounded-2xl p-4 shadow-xl hover:border-slate-700 transition-all space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-white text-sm">{inv.client}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">{inv.title} • <span className="font-mono text-slate-300">{inv.id}</span></p>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        inv.status.includes('Escrow') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25' : 'bg-amber-500/10 text-amber-400 border border-amber-500/25'
                      }`}>
                        {inv.status}
                      </span>
                    </div>

                    <div className="bg-[#070a12]/70 rounded-xl p-2.5 border border-slate-800 flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-300 truncate max-w-[180px]">🔒 {inv.deliverableName}</span>
                      <button 
                        onClick={() => setClientViewInvoice(inv)} 
                        className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold underline cursor-pointer"
                      >
                        Preview Portal
                      </button>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-slate-800/60">
                      <div>
                        <div className="text-base font-black text-white tracking-tight">${inv.amount.toLocaleString()}.00</div>
                        <div className="text-[10px] text-slate-400">{inv.date}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setClientViewInvoice(inv)}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <span>💳</span> Pay Portal
                        </button>
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

        {activeTab === 'vault' && (
          <div className="bg-[#101726]/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider">Deliverable Vault Manager</h2>
            <p className="text-xs text-slate-400">All deliverables stored under cryptographic lock until settlement.</p>
            <div className="space-y-2.5 pt-1">
              {invoices.map((inv, idx) => (
                <div key={idx} className="p-3.5 bg-[#070a12] rounded-xl border border-slate-800 text-xs space-y-1.5">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-white">{inv.client}</span>
                    <span className="text-indigo-400 font-mono">${inv.amount.toLocaleString()}</span>
                  </div>
                  <div className="text-slate-400 text-[11px] font-mono">File: {inv.deliverableName}</div>
                  <div className="text-emerald-400 text-[10px]">Gateways: Stripe + UPI Ready 🔒</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'chasers' && (
          <div className="bg-[#101726]/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider">Escrow Chaser Protocol</h2>
            <p className="text-xs text-slate-400">High-conversion collection sequences highlighting locked deliverables.</p>
            <div className="p-3.5 bg-[#070a12] rounded-xl border border-slate-800/80 text-xs space-y-2">
              <div className="font-bold text-indigo-400 flex items-center gap-1.5">
                <span>🛡️</span> Zero-Risk Handovers
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Clients choose between international credit card payment (Stripe) or direct UPI transfer right inside their portal.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'invoices' && (
          <div className="bg-[#101726]/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider">Lock New Deliverable & Invoice</h2>
            <p className="text-xs text-slate-400">Attach payment gateways and generate an escrow paywall link.</p>
            
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
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Stripe Payment Link (Card/ApplePay URL)</label>
                <input 
                  type="text" 
                  placeholder="e.g. https://buy.stripe.com/..."
                  value={stripePayLink}
                  onChange={(e) => setStripePayLink(e.target.value)}
                  className="w-full bg-[#070a12] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">UPI ID / VPA (for direct UPI payment)</label>
                <input 
                  type="text" 
                  placeholder="e.g. yourname@upi"
                  value={upiIdInput}
                  onChange={(e) => setUpiIdInput(e.target.value)}
                  className="w-full bg-[#070a12] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Deliverable File Name / Asset Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Nexus_V1_Source_Files.zip"
                  value={deliverableName}
                  onChange={(e) => setDeliverableName(e.target.value)}
                  className="w-full bg-[#070a12] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Protected File Link (Unlocked After Pay)</label>
                <input 
                  type="text" 
                  placeholder="e.g. https://github.com/... or Google Drive link"
                  value={deliverableUrl}
                  onChange={(e) => setDeliverableUrl(e.target.value)}
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
                <span>🔒</span> Lock Deliverable & Generate Paywall
              </button>
            </form>
          </div>
        )}

      </main>

      {/* Floating Bottom Navigation */}
      <nav className="fixed bottom-3 left-4 right-4 bg-[#070a12]/90 backdrop-blur-xl border border-slate-800/80 px-4 py-2.5 flex justify-between items-center max-w-md mx-auto text-[11px] font-medium text-slate-400 z-50 rounded-2xl shadow-2xl">
        <button 
          onClick={() => setActiveTab('dashboard')} 
          className={`flex flex-col items-center gap-1 transition-all cursor-pointer ${activeTab === 'dashboard' ? 'text-indigo-400 font-bold scale-105' : 'hover:text-slate-200'}`}
        >
          <span className="text-sm">📊</span>
          <span>Dashboard</span>
        </button>
        <button 
          onClick={() => setActiveTab('vault')} 
          className={`flex flex-col items-center gap-1 transition-all cursor-pointer ${activeTab === 'vault' ? 'text-indigo-400 font-bold scale-105' : 'hover:text-slate-200'}`}
        >
          <span className="text-sm">🔒</span>
          <span>Vault</span>
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
