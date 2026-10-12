import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Copy,
  Check,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Info,
  Clock,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { PaymentModal } from '../components/PaymentModal';
import { SEO } from '../components/SEO';

export const PaymentPage: React.FC = () => {
  const { currentPath, settings, showToast } = useApp();
  const [orderId, setOrderId] = useState('');
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Payment form states
  const [selectedMethod, setSelectedMethod] = useState<'bKash' | 'Nagad' | 'Rocket'>('bKash');
  const [senderNumber, setSenderNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  // Success modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Parse orderId from URL query (?orderId=BST-...)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('orderId');
    if (id) {
      setOrderId(id);
      loadOrder(id);
    } else {
      setLoading(false);
    }
  }, [currentPath]);

  const loadOrder = async (id: string) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const data = await api.getOrderForPayment(id);
      setOrderData(data);
      // If advance amount exists (Website package), use advanceAmount, otherwise totalAmount
      const payable = data.advanceAmount !== undefined ? data.advanceAmount : data.totalAmount;
      setPaidAmount(payable);
    } catch (err: any) {
      setErrorMsg(err.message || 'অর্ডারের তথ্য লোড করা যায়নি।');
    } finally {
      setLoading(false);
    }
  };

  const getMethodNumber = () => {
    if (selectedMethod === 'bKash') return settings.bkash || '01644633815';
    if (selectedMethod === 'Nagad') return settings.nagad || '01644633815';
    if (selectedMethod === 'Rocket') return settings.rocket || '01644633815';
    return '01644633815';
  };

  const handleCopyNumber = () => {
    const num = getMethodNumber();
    navigator.clipboard.writeText(num);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!orderId.trim()) {
      setErrorMsg('সঠিক Order ID প্রদান করুন।');
      return;
    }

    if (!senderNumber.trim() || senderNumber.trim().length < 10) {
      setErrorMsg('যে নাম্বার থেকে টাকা পাঠিয়েছেন সেই সেন্ডার নাম্বারটি দিন।');
      return;
    }

    if (!transactionId.trim() || transactionId.trim().length < 4) {
      setErrorMsg('সঠিক Transaction ID (TrxID) প্রদান করুন।');
      return;
    }

    if (!paidAmount || paidAmount <= 0) {
      setErrorMsg('প্রদেয় টাকার পরিমাণ উল্লেখ করুন।');
      return;
    }

    setSubmitting(true);
    try {
      await api.submitPayment({
        orderId: orderId.trim(),
        paymentMethod: selectedMethod,
        senderNumber: senderNumber.trim(),
        transactionId: transactionId.trim().toUpperCase(),
        paidAmount: Number(paidAmount),
      });

      // Show success modal without page reload
      setIsModalOpen(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'পেমেন্ট জমা দিতে সমস্যা হয়েছে।');
    } finally {
      setSubmitting(false);
    }
  };

  const serviceName = orderData?.type === 'SMM'
    ? `${orderData.details?.platform} ${orderData.details?.serviceType} (${orderData.details?.tierName})${
        orderData.details?.reactionType ? ` • ${orderData.details.reactionType} Reaction` : ''
      }`
    : orderData?.type === 'ADS'
    ? `${orderData.details?.platform} Ads Boost`
    : orderData?.type === 'WEBSITE'
    ? `Website: ${orderData.details?.packageName}`
    : 'BOOSTARA Service';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SEO
        title="Payment Details & Submission | BOOSTARA"
        description="Secure bKash, Nagad, and Rocket payment instructions and transaction verification for BOOSTARA orders."
        noindex={true}
      />

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl clay-badge text-[#1ac8ff] text-xs font-bold uppercase tracking-wider mb-4">
          <CreditCard className="w-4 h-4" />
          <span>Secure Manual Verification Payment</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 drop-shadow-md">
          পেমেন্ট <span className="text-gradient">কনফার্মেশন</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          বিকাশ, নগদ বা রকেট সেন্ড মানি করে নিচের ফর্মটিতে TrxID জমা দিন।
        </p>
      </div>

      {loading ? (
        <div className="clay-card p-12 rounded-3xl text-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#1ac8ff] border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-xs text-slate-400">অর্ডারের বিবরণ লোড হচ্ছে...</p>
        </div>
      ) : (
        <div className="clay-card-elevated p-6 sm:p-10 rounded-3xl border border-white/[0.08] relative">
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-center gap-3 mb-6 shadow-[inset_1.5px_1.5px_3px_rgba(244,63,94,0.2)]">
              <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Order Details Banner */}
          {orderData ? (
            <div className="p-5 rounded-2xl clay-card border border-white/[0.06] mb-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-4 mb-4">
                <div>
                  <span className="text-[11px] text-slate-400 uppercase font-mono tracking-wider">
                    Order ID:
                  </span>
                  <h3 className="text-base sm:text-lg font-mono font-bold text-[#1ac8ff]">
                    #{orderData.orderId}
                  </h3>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-[11px] text-slate-400 block">প্রদেয় সর্বমোট টাকা:</span>
                  <span className="text-2xl font-black text-gradient font-mono">
                    ৳{orderData.advanceAmount !== undefined ? orderData.advanceAmount : orderData.totalAmount}
                  </span>
                  {orderData.advanceAmount !== undefined && (
                    <span className="text-[10px] text-emerald-400 block font-medium">
                      (অগ্রিম পরিশোধযোগ্য, মোট ৳{orderData.totalAmount})
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                <div>
                  <span className="text-slate-400">সার্ভিস: </span>
                  <span className="font-semibold text-white">{serviceName}</span>
                </div>
                <div>
                  <span className="text-slate-400">গ্রাহক WhatsApp: </span>
                  <span className="font-mono text-white">{orderData.customerWhatsapp}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Order ID লিখুন
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="BST-2026..."
                  className="w-full clay-input px-4 py-3 text-xs sm:text-sm font-mono uppercase"
                />
                <button
                  type="button"
                  onClick={() => loadOrder(orderId)}
                  className="clay-btn-secondary px-5 text-xs font-bold cursor-pointer rounded-xl"
                >
                  খুঁজুন
                </button>
              </div>
            </div>
          )}

          {/* Payment Method Tabs */}
          <div className="mb-8">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
              ১. পেমেন্ট মেথড বেছে নিন (Send Money / পার্সোনাল)
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['bKash', 'Nagad', 'Rocket'] as const).map((method) => {
                const isSelected = selectedMethod === method;
                const colors = {
                  bKash: isSelected ? 'border-pink-500/50 text-pink-400 shadow-[inset_1.5px_2px_3px_rgba(255,255,255,0.2),0_8px_20px_rgba(236,72,153,0.3)]' : '',
                  Nagad: isSelected ? 'border-amber-500/50 text-amber-400 shadow-[inset_1.5px_2px_3px_rgba(255,255,255,0.2),0_8px_20px_rgba(245,158,11,0.3)]' : '',
                  Rocket: isSelected ? 'border-purple-500/50 text-purple-400 shadow-[inset_1.5px_2px_3px_rgba(255,255,255,0.2),0_8px_20px_rgba(139,61,255,0.3)]' : '',
                };
                return (
                  <button
                    type="button"
                    key={method}
                    onClick={() => setSelectedMethod(method)}
                    className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? `clay-card ${colors[method]}`
                        : 'clay-card opacity-80 hover:opacity-100 text-slate-400'
                    }`}
                  >
                    <span className="text-base font-black block">{method}</span>
                    <span className="text-[10px] opacity-80 block mt-0.5">Personal</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Number Display & Copy Button */}
          <div className="p-5 rounded-2xl clay-card border border-white/[0.08] mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-400 block">
                  {selectedMethod} পার্সোনাল নাম্বার (Send Money):
                </span>
                <span className="text-xl sm:text-2xl font-mono font-black text-white tracking-wider block mt-1 drop-shadow-sm">
                  {getMethodNumber()}
                </span>
                <span className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  শুধুমাত্র Personal একাউন্টে 'Send Money' করুন
                </span>
              </div>

              <button
                type="button"
                onClick={handleCopyNumber}
                className="py-2.5 px-4 rounded-xl clay-btn-secondary text-xs font-semibold flex items-center gap-2 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>নাম্বার কপি হয়েছে</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>নাম্বার কপি করুন</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Payment Submission Form */}
          <form onSubmit={handlePaymentSubmit} className="space-y-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              ২. টাকা পাঠানোর পর নিচের তথ্যগুলো পূরণ করুন
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  যে নাম্বার থেকে পাঠিয়েছেন (Sender Mobile) *
                </label>
                <input
                  type="tel"
                  value={senderNumber}
                  onChange={(e) => setSenderNumber(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full clay-input px-3.5 py-3 text-xs sm:text-sm font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Transaction ID (TrxID) *
                </label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                  placeholder="BL82XXXXXX"
                  className="w-full clay-input px-3.5 py-3 text-xs sm:text-sm font-mono uppercase"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                পাঠানো টাকার পরিমাণ (Amount BDT) *
              </label>
              <input
                type="number"
                value={paidAmount || ''}
                onChange={(e) => setPaidAmount(Number(e.target.value))}
                className="w-full clay-input px-3.5 py-3 text-xs sm:text-sm font-mono font-bold"
                required
              />
            </div>

            <div className="p-3.5 rounded-2xl clay-well text-[#1ac8ff] text-xs flex items-center gap-2 border border-blue-500/20">
              <Info className="w-4 h-4 shrink-0" />
              <span>পেমেন্ট সাবমিট করার পর আমাদের টিম ম্যানুয়ালি যাচাই করে অর্ডার প্রসেস শুরু করবে।</span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 text-sm sm:text-base font-bold clay-btn-primary flex items-center justify-center gap-2 cursor-pointer min-h-[50px] rounded-2xl mt-4"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>পেমেন্ট যাচাই করা হচ্ছে...</span>
                </>
              ) : (
                <>
                  <span>পেমেন্ট কনফার্ম করুন (Submit Payment)</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Success Modal */}
      <PaymentModal
        isOpen={isModalOpen}
        orderId={orderId}
        serviceType={serviceName}
        amount={paidAmount}
        customerWhatsapp={orderData?.customerWhatsapp || senderNumber}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
