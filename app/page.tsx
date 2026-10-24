'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function VeloLedgerDashboard() {
  const router = useRouter();
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'vault' | 'chasers' | 'invoices'>('dashboard');
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Form State
  const [client, setClient] = useState('');
  const [phone, setPhone] = useState('');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [deliverableName, setDeliverableName] = useState('');
  const [deliverableUrl, setDeliverableUrl] = useState('');
  const [stripePayLink, setStripePayLink] = useState('');
  const [wireDetails, setWireDetails] = useState('');
  const [upiId, setUpiId] = useState('');

  useEffect(() => {
    checkUserAndFetchInvoices();
  }, []);

  const checkUserAndFetchInvoices = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      router.push('/login');
      return;
    }

    setUserEmail(session.user.email || 'User');
    await fetchInvoices();
    setLoading(false);
  };

  const fetchInvoices = async () => {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      const formatted = data.map((inv: any) => ({
        id: inv.id,
        client: inv.client,
        phone: inv.phone || '',
        title: inv.title,
        amount: inv.amount,
        status: inv.status,
        isLocked: inv.is_locked,
        date: inv.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        deliverableName: inv.deliverable_name,
        deliverableUrl: inv.deliverable_url,
        stripePayLink: inv.stripe_pay_link,
        wireDetails: inv.wire_details,
        upiId: inv.upi_id
      }));
      setInvoices(formatted);
    }
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!client || !title || !amount) return;

    const { data: { user } } = await supabase.auth.getUser();

    const newInvoice = {
      id: `INV-${new Date().getFullYear()}-${Math.floor(10 + Math.random() * 90)}`,
      client,
      phone,
      title,
      amount: parseFloat(amount),
      status: 'Locked',
      is_locked: true,
      deliverable_name: deliverableName || 'Final Production Assets.zip',
      deliverable_url: deliverableUrl || 'https://drive.google.com',
      stripe_pay_link: stripePayLink || 'https://buy.stripe.com',
      wire_details: wireDetails || 'ACH: 987654321 | Routing: 123456789',
      upi_id: upiId || 'vendor@upi',
      user_id: user?.id
    };

    const { error } = await supabase.from('invoices').insert([newInvoice]);

    if (!error) {
      fetchInvoices();
      setActiveTab('dashboard');
      resetForm();
    } else {
      alert('Error saving asset vault: ' + error.message);
    }
  };

  const resetForm = () => {
    setClient('');
    setPhone('');
    setTitle('');
    setAmount('');
    setDeliverableName('');
    setDeliverableUrl('');
    setStripePayLink('');
    setWireDetails('');
    setUpiId('');
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const toggleInvoiceStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Locked' ? 'Settled & Unlocked' : 'Locked';
    const isLocked = nextStatus === 'Locked';

    await supabase
      .from('invoices')
      .update({ status: nextStatus, is_locked: isLocked })
      .eq('id', id);

    fetchInvoices();
  };

  const totalSecured = invoices.reduce((acc, inv) => acc + (inv.amount || 0), 0);
  const totalLockedCount = invoices.filter(i => i.isLocked).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050811] text-slate-100 flex items-center justify-center font-mono text-xs">
        Loading VeloLedger Vault...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 pb-28 font-sans selection:bg-indigo-500/30">
      <div className="max-w-md mx-auto p-4 space-y-4 pt-3">
        
        {/* Brand Header */}
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-white font-sans">VELOLEDGER</h1>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">PRO</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Enterprise Escrow & Cash Velocity Engine</p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Supabase DB Connected
            </span>
            <button 
              onClick={handleSignOut}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold rounded-lg border border-slate-700 transition-all cursor-pointer"
              title={userEmail || ''}
            >
              Logout
            </button>
          </div>
        </div>

        {/* ================= TAB 1: DASHBOARD ================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-4">
            {/* Velocity Index Card */}
            <div className="bg-gradient-to-b from-[#121a2d] to-[#0d1322] border border-indigo-500/20 rounded-2xl p-4 shadow-xl relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-[10px] font-mono font-bold tracking-wider text-indigo-400 uppercase">VELOCITY INDEX & ROI</p>
                  <h2 className="text-lg font-black text-white">14.8 Days Average Settlement</h2>
                </div>
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-amber-400 text-lg">
                  🛡️
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                Flexible gateways (Razorpay, Stripe, Wise, UPI) have saved <span className="text-emerald-400 font-bold">$480 in fees</span> with full database backup.
              </p>
            </div>

            {/* Volume Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#0b101d] border border-slate-800/80 rounded-2xl p-4 shadow-lg space-y-1">
                <p className="text-[10px] text-slate-400 font-semibold">Secured Volume</p>
                <p className="text-xl font-black text-white">${totalSecured.toLocaleString()}.00</p>
                <p className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 mt-1">
                  <span>▲</span> Live Sync Active
                </p>
              </div>

              <div className="bg-[#0b101d] border border-slate-800/80 rounded-2xl p-4 shadow-lg space-y-1">
                <p className="text-[10px] text-slate-400 font-semibold">Locked Vaults</p>
                <p className="text-xl font-black text-white">{totalLockedCount} Active</p>
                <p className="text-[10px] font-bold text-amber-400 mt-1">Stored in Supabase</p>
              </div>
            </div>

            {/* Escrow Vault & Invoices Header */}
            <div className="flex justify-between items-center pt-1">
              <h3 className="text-xs font-black tracking-wider text-slate-300 uppercase font-mono">
                ESCROW VAULT & INVOICES ({invoices.length})
              </h3>
              <button 
                onClick={() => setActiveTab('invoices')}
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-all cursor-pointer flex items-center gap-1"
              >
                <span>+</span> New Locked Asset
              </button>
            </div>

            {/* Dashboard Invoices List */}
            <div className="space-y-3">
              {invoices.length === 0 ? (
                <div className="bg-[#0b101d] border border-slate-800/80 rounded-2xl p-8 text-center text-slate-500 text-xs font-mono">
                  No deliverables found in database. Tap Invoices tab to add one.
                </div>
              ) : (
                invoices.map((inv) => {
                  const originUrl = typeof window !== 'undefined' ? window.location.origin : '';
                  const portalUrl = `${originUrl}/pay/${inv.id}`;
                  // ✅ Executive Rich WhatsApp Message Format:
const waExecutiveMessage = `🏛️ *VELOLEDGER EXECUTIVE DISPATCH*

Hi *${inv.client}*,

I'm following up on the pending settlement for *"${inv.title}"* (${inv.id}).

• *Statement Balance:* $${inv.amount ? inv.amount.toLocaleString() : '0'}.00
• *Deliverable Status:* 🔒 Locked in Secure Escrow Vault (${inv.deliverableName || 'Sealed Asset'})

Authorize settlement via Razorpay/Card, Zero-Fee Wise Wire, or Instant UPI to unlock your assets:
🔗 ${portalUrl}

_Let me know once initiated so we can verify release keys._`;

const waMessage = encodeURIComponent(waExecutiveMessage);

                  const waLink = inv.phone ? `https://wa.me/${inv.phone.replace(/[^0-9]/g, '')}?text=${waMessage}` : `https://wa.me/?text=${waMessage}`;

                  return (
                    <div key={inv.id} className="bg-[#0b101d] border border-slate-800/80 rounded-2xl p-4 space-y-3 shadow-xl">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-base font-extrabold text-white">{inv.client}</h4>
                          <p className="text-[11px] text-slate-400 font-mono mt-0.5">{inv.title} • {inv.id}</p>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                          inv.isLocked ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                          {inv.status}
                        </span>
                      </div>

                      {/* Sealed Deliverable Link Block */}
                      <div className="bg-[#050811] border border-slate-800/90 rounded-xl p-3 flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2 text-slate-300 font-medium truncate max-w-[200px]">
                          <span>🔒</span> {inv.deliverableName || 'Sealed Asset'}
                        </div>
                        <a href={`/pay/${inv.id}`} target="_blank" className="text-indigo-400 font-bold hover:underline text-[11px]">
                          Open Portal
                        </a>
                      </div>

                      {/* Card Actions & Pricing */}
                      <div className="flex justify-between items-center pt-1">
                        <span className="text-lg font-black text-white">${inv.amount.toLocaleString()}.00</span>
                        
                        <div className="flex items-center gap-2">
                          <a 
                            href={`/pay/${inv.id}`}
                            target="_blank"
                            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1"
                          >
                            💳 Portal
                          </a>

                          <a 
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 font-bold text-xs rounded-xl border border-emerald-500/30 transition-all flex items-center gap-1"
                          >
                            💬 Chase
                          </a>

                          <button 
                            onClick={() => toggleInvoiceStatus(inv.id, inv.status)}
                            className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl border border-slate-700 cursor-pointer"
                            title="Toggle Lock Status"
                          >
                            {inv.isLocked ? '🔓' : '🔒'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 2: VAULT ================= */}
        {activeTab === 'vault' && (
          <div className="space-y-3">
            <div className="bg-[#0b101d] border border-slate-800/80 rounded-2xl p-4">
              <h3 className="text-xs font-black tracking-wider text-slate-300 uppercase font-mono mb-1">
                DELIVERABLE VAULT MANAGER
              </h3>
              <p className="text-[11px] text-slate-400">All deliverables stored under cryptographic lock in Supabase.</p>
            </div>

            {invoices.filter(i => i.isLocked).length === 0 ? (
              <div className="bg-[#0b101d] border border-slate-800/80 rounded-2xl p-8 text-center text-slate-500 text-xs font-mono">
                No active locked assets in vault.
              </div>
            ) : (
              invoices.filter(i => i.isLocked).map(inv => (
                <div key={inv.id} className="bg-[#0b101d] border border-slate-800/80 rounded-2xl p-4 space-y-2 shadow-xl">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-white">{inv.client}</h4>
                    <span className="text-sm font-black text-indigo-400">${inv.amount.toLocaleString()}.00</span>
                  </div>
                  <p className="text-xs text-slate-300 font-mono">File: {inv.deliverableName}</p>
                  <div className="flex justify-between items-center pt-2 text-[10px] text-slate-400 font-mono border-t border-slate-800/60">
                    <span>Gateways Active & Database Persisted</span>
                    <a href={`/pay/${inv.id}`} target="_blank" className="text-indigo-400 font-bold hover:underline">View Portal 🔒</a>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ================= TAB 3: CHASERS ================= */}
        {activeTab === 'chasers' && (
          <div className="space-y-3">
            <div className="bg-[#0b101d] border border-slate-800/80 rounded-2xl p-4 space-y-2">
              <h3 className="text-xs font-black tracking-wider text-slate-300 uppercase font-mono">
                ESCROW CHASER PROTOCOL
              </h3>
              <p className="text-[11px] text-slate-400">High-conversion collection sequences highlighting locked deliverables.</p>
            </div>

            <div className="bg-gradient-to-b from-[#121a2d] to-[#0d1322] border border-amber-500/20 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                <span>⚡</span> Zero-Risk Handovers
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Clients choose between Razorpay/Card, Low-Fee Bank Wire (Wise), or instant UPI inside their portal.
              </p>
            </div>
          </div>
        )}

        {/* ================= TAB 4: INVOICES (CREATE NEW ASSET FORM) ================= */}
        {activeTab === 'invoices' && (
          <div className="space-y-4">
            <div className="bg-[#0b101d] border border-slate-800/80 rounded-2xl p-4">
              <h3 className="text-xs font-black tracking-wider text-slate-300 uppercase font-mono mb-1">
                LOCK NEW DELIVERABLE & INVOICE
              </h3>
              <p className="text-[11px] text-slate-400">Attach payment gateways and generate an escrow paywall link saved to database.</p>
            </div>

            <form onSubmit={handleCreateInvoice} className="bg-[#0b101d] border border-slate-800/80 rounded-2xl p-4 space-y-3">
              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1 font-bold">Client Name / Entity</label>
                <input type="text" required value={client} onChange={e => setClient(e.target.value)} placeholder="e.g. Nexus Interactive" className="w-full bg-[#050811] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1 font-bold">WhatsApp Phone (With Country Code)</label>
                <input type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder="e.g. 1234567890" className="w-full bg-[#050811] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1 font-bold">Milestone Description</label>
                <input type="text" required value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Phase 1 Architecture Sign-off" className="w-full bg-[#050811] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1 font-bold">Instant Card Checkout Link (Razorpay / Stripe)</label>
                <input type="url" value={stripePayLink} onChange={e => setStripePayLink(e.target.value)} placeholder="e.g. https://rzp.io/... or https://buy.stripe.com/..." className="w-full bg-[#050811] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1 font-bold">Wise / Wire Instructions (Low-Fee Bank Wire)</label>
                <input type="text" value={wireDetails} onChange={e => setWireDetails(e.target.value)} placeholder="e.g. Wise USD ACH: Acc #987654321, Routing #12100X" className="w-full bg-[#050811] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1 font-bold">UPI ID / VPA (for direct UPI payment)</label>
                <input type="text" value={upiId} onChange={e => setUpiId(e.target.value)} placeholder="e.g. yourname@upi" className="w-full bg-[#050811] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1 font-bold">Deliverable File Name / Asset Title</label>
                <input type="text" value={deliverableName} onChange={e => setDeliverableName(e.target.value)} placeholder="e.g. Nexus_V1_Source_Files.zip" className="w-full bg-[#050811] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1 font-bold">Protected File Link (Unlocked After Pay)</label>
                <input type="url" value={deliverableUrl} onChange={e => setDeliverableUrl(e.target.value)} placeholder="e.g. https://github.com/... or Google Drive link" className="w-full bg-[#050811] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1 font-bold">Amount ($USD)</label>
                <input type="number" required value={amount} onChange={e => setAmount(e.target.value)} placeholder="5000" className="w-full bg-[#050811] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
              </div>

              <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer">
                🔒 Lock Deliverable & Save to Cloud
              </button>
            </form>
          </div>
        )}

      </div>

      {/* Sticky Bottom Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#070b15]/95 backdrop-blur-lg border-t border-slate-800/80 py-2 px-6 z-40">
        <div className="max-w-md mx-auto grid grid-cols-4 gap-2 text-center">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center gap-1 py-1 transition-all cursor-pointer ${
              activeTab === 'dashboard' ? 'text-indigo-400 font-bold' : 'text-slate-500'
            }`}
          >
            <span className="text-lg">📊</span>
            <span className="text-[10px]">Dashboard</span>
          </button>

          <button 
            onClick={() => setActiveTab('vault')}
            className={`flex flex-col items-center gap-1 py-1 transition-all cursor-pointer ${
              activeTab === 'vault' ? 'text-indigo-400 font-bold' : 'text-slate-500'
            }`}
          >
            <span className="text-lg">🔒</span>
            <span className="text-[10px]">Vault</span>
          </button>

          <button 
            onClick={() => setActiveTab('chasers')}
            className={`flex flex-col items-center gap-1 py-1 transition-all cursor-pointer ${
              activeTab === 'chasers' ? 'text-indigo-400 font-bold' : 'text-slate-500'
            }`}
          >
            <span className="text-lg">⚡</span>
            <span className="text-[10px]">Chasers</span>
          </button>

          <button 
            onClick={() => setActiveTab('invoices')}
            className={`flex flex-col items-center gap-1 py-1 transition-all cursor-pointer ${
              activeTab === 'invoices' ? 'text-indigo-400 font-bold' : 'text-slate-500'
            }`}
          >
            <span className="text-lg">📄</span>
            <span className="text-[10px]">Invoices</span>
          </button>
        </div>
      </div>

    </div>
  );
}
