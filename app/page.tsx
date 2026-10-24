'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function VeloLedgerDashboard() {
  const router = useRouter();
  const supabase = createClient();

  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Form State
  const [client, setClient] = useState('');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [deliverableName, setDeliverableName] = useState('');
  const [deliverableUrl, setDeliverableUrl] = useState('');
  const [stripePayLink, setStripePayLink] = useState('');
  const [wireDetails, setWireDetails] = useState('');
  const [upiId, setUpiId] = useState('');
  const [showModal, setShowModal] = useState(false);

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
      title,
      amount: parseFloat(amount),
      status: 'Locked',
      is_locked: true,
      deliverable_name: deliverableName || 'Final Production Assets.zip',
      deliverable_url: deliverableUrl || 'https://drive.google.com',
      stripe_pay_link: stripePayLink || 'https://buy.stripe.com',
      wireDetails: wireDetails || 'ACH: 987654321 | Routing: 123456789',
      upi_id: upiId || 'vendor@upi',
      user_id: user?.id
    };

    const { error } = await supabase.from('invoices').insert([newInvoice]);

    if (!error) {
      fetchInvoices();
      setShowModal(false);
      resetForm();
    } else {
      alert('Error creating invoice: ' + error.message);
    }
  };

  const resetForm = () => {
    setClient('');
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
  const totalLocked = invoices.filter(i => i.isLocked).reduce((acc, inv) => acc + (inv.amount || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070a12] text-slate-100 flex items-center justify-center font-mono text-xs">
        Authenticating Vault...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 p-4 sm:p-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Navigation / Header */}
        <div className="flex justify-between items-center bg-[#101726] border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center gap-2">
            <span className="text-xl">🛡️</span>
            <div>
              <h1 className="text-sm font-black text-white tracking-wide">VELOLEDGER VAULT</h1>
              <p className="text-[10px] font-mono text-indigo-400">{userEmail}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowModal(true)}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer"
            >
              + New Asset
            </button>
            <button 
              onClick={handleSignOut}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl border border-slate-700 transition-all cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Stats Metrics */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-[#101726] border border-slate-800 rounded-2xl p-4">
            <p className="text-[10px] font-mono uppercase text-slate-400">Total Secured Volume</p>
            <p className="text-xl sm:text-2xl font-black text-white mt-1">${totalSecured.toLocaleString()}.00</p>
          </div>
          <div className="bg-[#101726] border border-slate-800 rounded-2xl p-4">
            <p className="text-[10px] font-mono uppercase text-amber-400">Escrow Locked Funds</p>
            <p className="text-xl sm:text-2xl font-black text-amber-400 mt-1">${totalLocked.toLocaleString()}.00</p>
          </div>
        </div>

        {/* Invoice List */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">Active Deliverable Vaults</h2>
          
          {invoices.length === 0 ? (
            <div className="bg-[#101726] border border-slate-800 rounded-2xl p-8 text-center text-slate-500 text-xs font-mono">
              No locked deliverables found. Click "+ New Asset" to create your first escrow milestone.
            </div>
          ) : (
            invoices.map((inv) => (
              <div key={inv.id} className="bg-[#101726] border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono text-indigo-400">{inv.id}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                        inv.isLocked ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {inv.status}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white mt-1">{inv.title}</h3>
                    <p className="text-xs text-slate-400">{inv.client}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-black text-white">${inv.amount.toLocaleString()}.00</p>
                    <p className="text-[10px] font-mono text-slate-500">{inv.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                  <a 
                    href={`/pay/${inv.id}`}
                    target="_blank"
                    className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-center text-xs font-bold rounded-xl border border-slate-700 transition-all"
                  >
                    🔗 Portal Link
                  </a>
                  <button 
                    onClick={() => toggleInvoiceStatus(inv.id, inv.status)}
                    className="flex-1 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-bold rounded-xl border border-indigo-500/30 transition-all cursor-pointer"
                  >
                    {inv.isLocked ? '🔓 Unlock Asset' : '🔒 Lock Asset'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Create Invoice Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-[#101726] border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white">Create Escrow Vault</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white text-xs font-mono">✕ Close</button>
              </div>

              <form onSubmit={handleCreateInvoice} className="space-y-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Client Name</label>
                  <input type="text" required value={client} onChange={e => setClient(e.target.value)} placeholder="Acme Corp" className="w-full bg-[#070a12] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Milestone Title</label>
                  <input type="text" required value={title} onChange={e => setTitle(e.target.value)} placeholder="Brand Design & Mobile App Kit" className="w-full bg-[#070a12] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Amount ($)</label>
                  <input type="number" required value={amount} onChange={e => setAmount(e.target.value)} placeholder="2500" className="w-full bg-[#070a12] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Deliverable Asset Name</label>
                  <input type="text" value={deliverableName} onChange={e => setDeliverableName(e.target.value)} placeholder="Production_Final_Build.zip" className="w-full bg-[#070a12] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Deliverable Link (Google Drive / Figma)</label>
                  <input type="url" value={deliverableUrl} onChange={e => setDeliverableUrl(e.target.value)} placeholder="https://drive.google.com/..." className="w-full bg-[#070a12] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
                </div>

                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <p className="text-[10px] font-mono uppercase text-indigo-400 font-bold">Payment Gateway Config</p>
                  <input type="url" value={stripePayLink} onChange={e => setStripePayLink(e.target.value)} placeholder="Razorpay / Stripe Pay Link" className="w-full bg-[#070a12] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
                  <input type="text" value={wireDetails} onChange={e => setWireDetails(e.target.value)} placeholder="Wise/Wire Details (ACH/IBAN)" className="w-full bg-[#070a12] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
                  <input type="text" value={upiId} onChange={e => setUpiId(e.target.value)} placeholder="UPI ID (e.g., username@upi)" className="w-full bg-[#070a12] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
                </div>

                <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer">
                  🔒 Lock Deliverable & Save to Cloud
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
