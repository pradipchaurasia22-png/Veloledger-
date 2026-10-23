'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function ClientPayPortal() {
  const params = useParams();
  const invoiceId = params?.id as string;
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [invoice, setInvoice] = useState<any>(null);
  const [simulatedPaid, setSimulatedPaid] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'wire' | 'upi'>('stripe');

  useEffect(() => {
    if (invoiceId) {
      fetchInvoiceDetails();
    }
  }, [invoiceId]);

  const fetchInvoiceDetails = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', invoiceId)
      .single();

    if (!error && data) {
      setInvoice({
        id: data.id,
        client: data.client,
        title: data.title,
        amount: data.amount,
        stripePayLink: data.stripe_pay_link,
        wireDetails: data.wire_details,
        upiId: data.upi_id,
        deliverableName: data.deliverable_name,
        deliverableUrl: data.deliverable_url,
        status: data.status
      });
      if (data.status === 'Settled & Unlocked') {
        setSimulatedPaid(true);
      }
    }
    setLoading(false);
  };

  const handleConfirmPayment = async () => {
    setSimulatedPaid(true);
    await supabase
      .from('invoices')
      .update({ status: 'Settled & Unlocked', is_locked: false })
      .eq('id', invoiceId);
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070a12] text-slate-100 flex items-center justify-center font-mono text-xs">
        Loading Escrow Portal...
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col items-center justify-center font-sans space-y-3 p-6 text-center">
        <div className="text-3xl">⚠️</div>
        <h2 className="text-sm font-bold text-white">Invoice Portal Not Found</h2>
        <p className="text-xs text-slate-400">Please verify the link sent to you by the provider.</p>
      </div>
    );
  }

  const upiDeepLink = `upi://pay?pa=${invoice.upiId}&pn=VeloLedger%20Escrow&am=${invoice.amount}&cu=INR&tn=Invoice%20${invoice.id}`;

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 p-6 flex flex-col justify-between font-sans">
      <div className="max-w-md mx-auto w-full space-y-5 pt-4">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <span>🛡️</span> VELOLEDGER SECURE ESCROW VAULT
          </div>
          <h1 className="text-xl font-black text-white tracking-tight">Milestone Settlement Portal</h1>
          <p className="text-xs text-slate-400">Prepared for <strong className="text-slate-200">{invoice.client}</strong></p>
        </div>

        <div className="bg-[#101726] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-2xl">
          <div className="flex justify-between items-start border-b border-slate-800/80 pb-4">
            <div>
              <p className="text-[10px] text-slate-400 font-mono uppercase">Reference ID</p>
              <h3 className="text-sm font-bold text-white mt-0.5">{invoice.id}</h3>
              <p className="text-xs text-slate-300 mt-1">{invoice.title}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-400 font-mono uppercase">Amount Due</p>
              <h3 className="text-lg font-black text-white mt-0.5">${invoice.amount.toLocaleString()}.00</h3>
            </div>
          </div>

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
              <span className="truncate max-w-[200px]">{invoice.deliverableName}</span>
              <span className="text-[10px] text-slate-500">Verified Asset</span>
            </div>

            {!simulatedPaid ? (
              <p className="text-[11px] text-amber-400/90 bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-lg">
                ⚠️ Files are cryptographically sealed. Completing payment instantly unlocks full production access.
              </p>
            ) : (
              <div className="space-y-2">
                <p className="text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-lg font-medium">
                  ✅ Settlement Confirmed! Escrow release verified in database.
                </p>
                <a 
                  href={invoice.deliverableUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs text-center rounded-xl transition-all shadow-lg shadow-emerald-600/20"
                >
                  📥 Download Verified Production Assets
                </a>
              </div>
            )}
          </div>

          {/* PDF Receipt Download Trigger */}
          <button 
            onClick={handleDownloadPDF}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>📄</span> Save / Print Official Invoice PDF
          </button>

          {!simulatedPaid && (
            <div className="space-y-3 pt-1">
              <div className="grid grid-cols-3 gap-1 bg-[#070a12] p-1 rounded-xl border border-slate-800 text-[11px]">
                <button 
                  onClick={() => setPaymentMethod('stripe')}
                  className={`py-2 font-bold rounded-lg transition-all ${
                    paymentMethod === 'stripe' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  💳 Card
                </button>
                <button 
                  onClick={() => setPaymentMethod('wire')}
                  className={`py-2 font-bold rounded-lg transition-all ${
                    paymentMethod === 'wire' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🏦 Wise/Wire
                </button>
                <button 
                  onClick={() => setPaymentMethod('upi')}
                  className={`py-2 font-bold rounded-lg transition-all ${
                    paymentMethod === 'upi' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  📱 UPI
                </button>
              </div>

              {paymentMethod === 'stripe' && (
                <div className="space-y-2">
                  <a 
                    href={invoice.stripePayLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>💳</span> Pay via Razorpay / Card / Apple Pay
                  </a>
                  <button 
                    onClick={handleConfirmPayment}
                    className="w-full py-2 text-[10px] text-slate-400 hover:text-slate-200 text-center underline cursor-pointer"
                  >
                    [Confirm Settlement & Unlock Deliverable]
                  </button>
                </div>
              )}

              {paymentMethod === 'wire' && (
                <div className="bg-[#070a12] border border-slate-800 rounded-xl p-4 text-center space-y-3">
                  <div className="text-xs font-bold text-slate-200">Zero-Fee ACH / Bank Transfer</div>
                  <div className="bg-[#101726] border border-slate-800 p-2.5 rounded-lg text-[11px] font-mono text-blue-300 text-left select-all leading-relaxed">
                    {invoice.wireDetails}
                  </div>
                  <button 
                    onClick={handleConfirmPayment}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-blue-600/20 cursor-pointer"
                  >
                    ✅ Confirm Wire Transfer Sent
                  </button>
                </div>
              )}

              {paymentMethod === 'upi' && (
                <div className="bg-[#070a12] border border-slate-800 rounded-xl p-4 text-center space-y-3">
                  <div className="text-xs font-bold text-slate-200">Pay via Any UPI App</div>
                  <div className="bg-[#101726] border border-slate-800 p-2.5 rounded-lg text-xs font-mono text-emerald-400 font-bold select-all">
                    {invoice.upiId}
                  </div>
                  <a 
                    href={upiDeepLink}
                    className="block w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-emerald-600/20"
                  >
                    🚀 Open GPay / PhonePe / Paytm
                  </a>
                  <button 
                    onClick={handleConfirmPayment}
                    className="w-full py-1.5 text-[10px] text-slate-400 hover:text-slate-200 text-center underline cursor-pointer"
                  >
                    [Confirm UPI Payment Received]
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="text-center text-[10px] text-slate-500 py-4 font-mono">
        Secured & Verified by VeloLedger Enterprise Infrastructure
      </div>
    </div>
  );
}
