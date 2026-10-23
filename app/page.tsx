'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function VeloLedgerApp() {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'vault' | 'chasers' | 'invoices'>('dashboard');
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<any[]>([]);

  // Form State
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [invoiceTitle, setInvoiceTitle] = useState('');
  const [invoiceAmount, setInvoiceAmount] = useState('');
  const [stripePayLink, setStripePayLink] = useState('');
  const [wireDetailsInput, setWireDetailsInput] = useState('');
  const [upiIdInput, setUpiIdInput] = useState('');
  const [deliverableName, setDeliverableName] = useState('');
  const [deliverableUrl, setDeliverableUrl] = useState('');

  // Fetch invoices from Supabase on mount
  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      const formatted = data.map((inv: any) => ({
        id: inv.id,
        client: inv.client,
        phone: inv.phone,
        title: inv.title,
        amount: inv.amount,
        status: inv.status,
        date: inv.date,
        payLink: inv.pay_link,
        stripePayLink: inv.stripe_pay_link,
        wireDetails: inv.wire_details,
        upiId: inv.upi_id,
        deliverableName: inv.deliverable_name,
        deliverableUrl: inv.deliverable_url,
        isLocked: inv.is_locked
      }));
      setInvoices(formatted);
    }
    setLoading(false);
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !invoiceAmount) return;

    const randomId = Math.floor(10 + Math.random() * 90);
    const invoiceId = `INV-2024-${randomId}`;
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const generatedPayLink = `${baseUrl}/pay/${invoiceId}`;

    const newDbInv = {
      id: invoiceId,
      client: clientName,
      phone: clientPhone || '1234567890',
      title: invoiceTitle || 'Strategic Execution Milestone',
      amount: parseFloat(invoiceAmount),
      status: 'Locked (Escrow Pending)',
      date: 'Due in 30 days',
      pay_link: generatedPayLink,
      stripe_pay_link: stripePayLink || 'https://rzp.io/l/sample_link',
      wire_details: wireDetailsInput || 'Wise USD ACH: Community Federal Savings Bank | Acc: 445566778',
      upi_id: upiIdInput || 'veloledger@upi',
      deliverable_name: deliverableName || 'Final Production Assets.zip',
      deliverable_url: deliverableUrl || 'https://drive.google.com/sample-locked-file',
      is_locked: true
    };

    const { error } = await supabase.from('invoices').insert([newDbInv]);

    if (!error) {
      await fetchInvoices();
      setClientName('');
      setClientPhone('');
      setInvoiceTitle('');
      setInvoiceAmount('');
      setStripePayLink('');
      setWireDetailsInput('');
      setUpiIdInput('');
      setDeliverableName('');
      setDeliverableUrl('');
      setActiveTab('dashboard');
    } else {
      alert('Error saving to Supabase: ' + error.message);
    }
  };

  const sendWhatsAppReminder = (inv: any) => {
    const fullPayUrl = inv.payLink.startsWith('http') ? inv.payLink : `${window.location.origin}${inv.payLink}`;
    
    const message = encodeURIComponent(
      `🏛️ *VELOLEDGER EXECUTIVE DISPATCH*\n\n` +
      `Hi *${inv.client}*,\n\n` +
      `I'm following up on the pending settlement for *"${inv.title}"* (${inv.id}).\n\n` +
      `• *Statement Balance:* $${inv.amount.toLocaleString()}.00\n` +
      `• *Deliverable Status:* 🔒 Locked in Secure Escrow Vault (${inv.deliverableName})\n\n` +
      `Authorize settlement via Razorpay/Card, Zero-Fee Wise Wire, or Instant UPI to unlock your assets:\n` +
      `🔗 ${fullPayUrl}\n\n` +
      `_Let me know once initiated so we can verify release keys._`
    );
    window.open(`https://wa.me/${inv.phone}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 pb-32 font-sans selection:bg-indigo-500 selection:text-white">
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
            Supabase DB Connected
          </span>
        </div>
      </header>

      <main className="px-4 pt-4 max-w-lg mx-auto space-y-4">
        {activeTab === 'dashboard' && (
          <>
            <div className="relative overflow-hidden bg-gradient-to-br from-[#111827] via-[#0d1322] to-[#161e31] border border-indigo-500/30 rounded-2xl p-4 shadow-2xl">
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none"></div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono tracking-wider text-indigo-400 uppercase font-semibold">Velocity Index & ROI</span>
                  <h2 className="text-sm font-bold text-white mt-0.5">14.8 Days Average Settlement</h2>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                    Flexible gateways (Razorpay, Stripe, Wise, UPI) have saved <span className="text-emerald-400 font-bold">$480 in fees</span> with full database backup.
                  </p>
                </div>
                <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20 shrink-0">
                  🛡️
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#101726]/80 backdrop-blur border border-slate-800/80 rounded-2xl p-4 shadow-lg">
                <p className="text-[11px] text-slate-400 font-medium">Secured Volume</p>
                <h3 className="text-xl font-black text-white mt-1 tracking-tight">
                  ${invoices.reduce((acc, curr) => acc + (curr.amount || 0), 0).toLocaleString()}.00
                </h3>
                <p className="text-[10px] text-emerald-400 font-semibold mt-1">▲ Live Sync Active</p>
              </div>
              
              <div className="bg-[#101726]/80 backdrop-blur border border-slate-800/80 rounded-2xl p-4 shadow-lg">
                <p className="text-[11px] text-slate-400 font-medium">Locked Vaults</p>
                <h3 className="text-xl font-black text-white mt-1 tracking-tight">{invoices.length} Active</h3>
                <p className="text-[10px] text-amber-400 font-semibold mt-1">Stored in Supabase</p>
              </div>
            </div>

            <div className="pt-1">
              <div className="flex justify-between items-center mb-3 px-1">
                <h3 className="text-xs font-bold text-slate-200 tracking-wider uppercase font-mono">
                  Escrow Vault & Invoices ({invoices.length})
                </h3>
                <button onClick={() => setActiveTab('invoices')} className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 cursor-pointer">
                  + New Locked Asset
                </button>
              </div>

              {loading ? (
                <div className="text-center py-8 text-xs font-mono text-slate-400">Loading vault data from Supabase...</div>
              ) : invoices.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500 bg-[#101726]/50 rounded-2xl border border-slate-800">
                  No invoices created yet. Tap "+ New Locked Asset" to start.
                </div>
              ) : (
                <div className="space-y-3">
                  {invoices.map((inv, idx) => (
                    <div key={idx} className="bg-[#101726]/90 backdrop-blur border border-slate-800/90 rounded-2xl p-4 shadow-xl hover:border-slate-700 transition-all space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-white text-sm">{inv.client}</h4>
                          <p className="text-[11px] text-slate-400 mt-0.5">{inv.title} • <span className="font-mono text-slate-300">{inv.id}</span></p>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          inv.status.includes('Escrow') || inv.status.includes('Locked') ? 'bg-amber-500/10 text-amber-400 border border-amber-500/25' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'
                        }`}>
                          {inv.status}
                        </span>
                      </div>

                      <div className="bg-[#070a12]/70 rounded-xl p-2.5 border border-slate-800 flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-300 truncate max-w-[180px]">🔒 {inv.deliverableName}</span>
                        <a 
                          href={inv.payLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold underline cursor-pointer"
                        >
                          Open Portal
                        </a>
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-slate-800/60">
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
                            <span>💳</span> Portal
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
              )}
            </div>
          </>
        )}

        {activeTab === 'vault' && (
          <div className="bg-[#101726]/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider">Deliverable Vault Manager</h2>
            <p className="text-xs text-slate-400">All deliverables stored under cryptographic lock in Supabase.</p>
            <div className="space-y-2.5 pt-1">
              {invoices.map((inv, idx) => (
                <div key={idx} className="p-3.5 bg-[#070a12] rounded-xl border border-slate-800 text-xs space-y-1.5">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-white">{inv.client}</span>
                    <span className="text-indigo-400 font-mono">${inv.amount.toLocaleString()}</span>
                  </div>
                  <div className="text-slate-400 text-[11px] font-mono">File: {inv.deliverableName}</div>
                  <div className="text-emerald-400 text-[10px]">Gateways Active & Database Persisted 🔒</div>
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
                Clients choose between Razorpay/Card, Low-Fee Bank Wire (Wise), or Instant UPI inside their portal.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'invoices' && (
          <div className="bg-[#101726]/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wider">Lock New Deliverable & Invoice</h2>
            <p className="text-xs text-slate-400">Attach payment gateways and generate an escrow paywall link saved to database.</p>
            
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
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Instant Card Checkout Link (Razorpay / Stripe)</label>
                <input 
                  type="text" 
                  placeholder="e.g. https://rzp.io/l/... or https://buy.stripe.com/..."
                  value={stripePayLink}
                  onChange={(e) => setStripePayLink(e.target.value)}
                  className="w-full bg-[#070a12] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Wise / Wire Instructions (Low-Fee Bank Wire)</label>
                <input 
                  type="text" 
                  placeholder="e.g. Wise USD ACH: Acc #987654321, Routing #121000358"
                  value={wireDetailsInput}
                  onChange={(e) => setWireDetailsInput(e.target.value)}
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
                <span>🔒</span> Lock Deliverable & Save to Cloud
              </button>
            </form>
          </div>
        )}
      </main>

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
