'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function VeloLedgerMain() {
  const router = useRouter();
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'vault' | 'invoices'>('dashboard');
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Modal Form State
  const [showModal, setShowModal] = useState(false);
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

    setUserEmail(session.user.email || 'Agency Owner');
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
        date: inv.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
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
      setShowModal(false);
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

  const handleDeleteInvoice = async (id: string) => {
    if (confirm('Are you sure you want to delete this record?')) {
      await supabase.from('invoices').delete().eq('id', id);
      fetchInvoices();
    }
  };

  const totalSecured = invoices.reduce((acc, inv) => acc + (inv.amount || 0), 0);
  const totalLocked = invoices.filter(i => i.isLocked).reduce((acc, inv) => acc + (inv.amount || 0), 0);
  const totalSettled = invoices.filter(i => !i.isLocked).reduce((acc, inv) => acc + (inv.amount || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070a12] text-slate-100 flex items-center justify-center font-mono text-xs">
        Authenticating Vault Access...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 p-4 sm:p-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Top Header / Auth Status */}
        <div className="flex justify-between items-center bg-[#101726] border border-slate-800 p-4 rounded-2xl shadow-xl">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🛡️</span>
            <div>
              <h1 className="text-sm font-black text-white tracking-wide">VELOLEDGER VAULT</h1>
              <p className="text-[10px] font-mono text-indigo-400 truncate max-w-[160px] sm:max-w-none">{userEmail}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowModal(true)}
              className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer"
            >
              + New Asset
            </button>
            <button 
              onClick={handleSignOut}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl border border-slate-700 transition-all cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Tab Toggle Navigation */}
        <div className="grid grid-cols-3 gap-1 bg-[#101726] p-1.5 rounded-2xl border border-slate-800 text-xs font-bold font-mono">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`py-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            📊 Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('vault')}
            className={`py-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'vault' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            🔒 Vault Assets ({invoices.filter(i => i.isLocked).length})
          </button>
          <button 
            onClick={() => setActiveTab('invoices')}
            className={`py-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'invoices' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            🧾 Invoices ({invoices.length})
          </button>
        </div>

        {/* TAB 1: DASHBOARD VIEW */}
        {activeTab === 'dashboard' && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#101726] border border-slate-800 rounded-2xl p-4 shadow-lg">
                <p className="text-[10px] font-mono uppercase text-slate-400">Total Volume</p>
                <p className="text-lg sm:text-xl font-black text-white mt-1">${totalSecured.toLocaleString()}</p>
              </div>
              <div className="bg-[#101726] border border-slate-800 rounded-2xl p-4 shadow-lg">
                <p className="text-[10px] font-mono uppercase text-amber-400">Escrow Locked</p>
                <p className="text-lg sm:text-xl font-black text-amber-400 mt-1">${totalLocked.toLocaleString()}</p>
              </div>
              <div className="bg-[#101726] border border-slate-800 rounded-2xl p-4 shadow-lg">
                <p className="text-[10px] font-mono uppercase text-emerald-400">Settled</p>
                <p className="text-lg sm:text-xl font-black text-emerald-400 mt-1">${totalSettled.toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-[#101726] border border-slate-800 rounded-2xl p-5 space-y-3">
              <h3 className="text-xs font-bold font-mono text-slate-400 uppercase">Recent Activity</h3>
              {invoices.length === 0 ? (
                <p className="text-xs text-slate-500 font-mono">No transaction records found.</p>
              ) : (
                invoices.slice(0, 3).map(inv => (
                  <div key={inv.id} className="flex justify-between items-center bg-[#070a12] p-3 rounded-xl border border-slate-800/80 text-xs">
                    <div>
                      <p className="font-bold text-white">{inv.title}</p>
                      <p className="text-[10px] text-slate-400">{inv.client} • {inv.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-bold text-white">${inv.amount}</p>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${inv.isLocked ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                        {inv.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 2: VAULT VIEW (Only Locked Assets) */}
        {activeTab === 'vault' && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">Active Escrow Sealed Assets</h2>
            {invoices.filter(i => i.isLocked).length === 0 ? (
              <div className="bg-[#101726] border border-slate-800 rounded-2xl p-8 text-center text-slate-500 text-xs font-mono">
                No currently locked assets in vault.
              </div>
            ) : (
              invoices.filter(i => i.isLocked).map(inv => {
                const originUrl = typeof window !== 'undefined' ? window.location.origin : '';
                const portalUrl = `${originUrl}/pay/${inv.id}`;
                const waMessage = encodeURIComponent(
                  `Hi ${inv.client}, your deliverable (${inv.title}) has been locked in VeloLedger Escrow. Complete settlement here to instantly access files & receipt: ${portalUrl}`
                );
                const waLink = inv.phone ? `https://wa.me/${inv.phone.replace(/[^0-9]/g, '')}?text=${waMessage}` : `https://wa.me/?text=${waMessage}`;

                return (
                  <div key={inv.id} className="bg-[#101726] border border-slate-800 rounded-2xl p-4 space-y-3 shadow-xl">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold font-mono text-indigo-400">{inv.id}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            LOCKED
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-white mt-1">{inv.title}</h3>
                        <p className="text-xs text-slate-400">{inv.client} {inv.phone && `(${inv.phone})`}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-base font-black text-white">${inv.amount.toLocaleString()}.00</p>
                        <p className="text-[10px] font-mono text-slate-500">{inv.date}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-800/80 text-xs font-bold">
                      <a href={`/pay/${inv.id}`} target="_blank" className="py-2 bg-slate-800 text-slate-200 text-center rounded-xl border border-slate-700 flex items-center justify-center gap-1">
                        <span>🔗</span> Link
                      </a>
                      <a href={waLink} target="_blank" rel="noopener noreferrer" className="py-2 bg-emerald-600/20 text-emerald-400 text-center rounded-xl border border-emerald-500/30 flex items-center justify-center gap-1">
                        <span>💬</span> Chase
                      </a>
                      <button onClick={() => toggleInvoiceStatus(inv.id, inv.status)} className="py-2 bg-indigo-600/20 text-indigo-300 text-center rounded-xl border border-indigo-500/30 cursor-pointer">
                        🔓 Unlock
                      </button>
                      <button onClick={() => handleDeleteInvoice(inv.id)} className="py-2 bg-rose-500/10 text-rose-400 text-center rounded-xl border border-rose-500/20 cursor-pointer">
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 3: INVOICES VIEW (All Records & Tax Receipts) */}
        {activeTab === 'invoices' && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">Full Invoicing History</h2>
            {invoices.length === 0 ? (
              <div className="bg-[#101726] border border-slate-800 rounded-2xl p-8 text-center text-slate-500 text-xs font-mono">
                No invoices found in database.
              </div>
            ) : (
              invoices.map(inv => (
                <div key={inv.id} className="bg-[#101726] border border-slate-800 rounded-2xl p-4 space-y-3 shadow-xl">
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

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80 text-xs font-bold">
                    <a href={`/pay/${inv.id}`} target="_blank" className="flex-1 py-2 bg-slate-800 text-slate-200 text-center rounded-xl border border-slate-700 flex items-center justify-center gap-1">
                      📄 View {inv.isLocked ? 'Notice' : 'Tax Invoice'}
                    </a>
                    <button onClick={() => handleDeleteInvoice(inv.id)} className="px-4 py-2 bg-rose-500/10 text-rose-400 text-center rounded-xl border border-rose-500/20 cursor-pointer">
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Modal: Create Escrow Asset */}
        {showModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-[#101726] border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white">Create Escrow Vault</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white text-xs font-mono cursor-pointer">✕ Close</button>
              </div>

              <form onSubmit={handleCreateInvoice} className="space-y-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Client Name</label>
                  <input type="text" required value={client} onChange={e => setClient(e.target.value)} placeholder="Acme Corp" className="w-full bg-[#070a12] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Client WhatsApp Phone (Optional)</label>
                  <input type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1234567890" className="w-full bg-[#070a12] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" />
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
