import React, { useState, useEffect } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  HelpCircle,
  MessageCircle,
  CreditCard,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Order } from '../types';
import { SEO } from '../components/SEO';

export const TrackOrderPage: React.FC = () => {
  const { currentPath, settings } = useApp();
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [searched, setSearched] = useState(false);

  // Check URL params (?orderId=BST-...&phone=018...)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialOrderId = params.get('orderId');
    const initialPhone = params.get('phone');
    if (initialOrderId && initialPhone) {
      setOrderId(initialOrderId);
      setPhone(initialPhone);
      executeTracking(initialOrderId, initialPhone);
    }
  }, [currentPath]);

  const executeTracking = async (id: string, ph: string) => {
    setLoading(true);
    setErrorMessage('');
    setSearched(true);
    try {
      const result = await api.trackOrder(id.trim(), ph.trim());
      setOrder(result);
    } catch (err: any) {
      setOrder(null);
      // Strictly use specified message on mismatch
      setErrorMessage(
        err.message || 'অর্ডার পাওয়া যায়নি। Order ID এবং ফোন নাম্বারটি সঠিক কিনা যাচাই করুন।'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim() || !phone.trim()) {
      setErrorMessage('Order ID এবং ফোন নাম্বার দুটিই প্রদান করুন।');
      return;
    }
    executeTracking(orderId, phone);
  };

  const getStatusBadge = (status: Order['orderStatus']) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold clay-badge text-emerald-400 border border-emerald-500/40">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Completed (সম্পন্ন)</span>
          </span>
        );
      case 'In Review':
        return (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold clay-badge text-cyan-400 border border-cyan-500/40">
            <Clock className="w-3.5 h-3.5 animate-spin" />
            <span>In Review (কাজ চলমান)</span>
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold clay-badge text-rose-400 border border-rose-500/40">
            <XCircle className="w-3.5 h-3.5" />
            <span>Cancelled (বাতিলকৃত)</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold clay-badge text-amber-400 border border-amber-500/40">
            <Clock className="w-3.5 h-3.5" />
            <span>Pending (অপেক্ষারত)</span>
          </span>
        );
    }
  };

  const adminPhone = settings.whatsapp || '01813078583';
  const cleanAdminPhone = adminPhone.startsWith('0') ? `88${adminPhone}` : adminPhone;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SEO
        title="Track Order — Real-time Order Status | BOOSTARA"
        description="Track your BOOSTARA social media, ads, and website order status instantly using your Order ID and WhatsApp number."
        noindex={true}
      />

      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl clay-badge text-[#1ac8ff] text-xs font-bold uppercase tracking-wider mb-4">
          <Search className="w-4 h-4" />
          <span>Real-time Live Order Tracking</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white mb-3 drop-shadow-md">
          অর্ডার <span className="text-gradient">ট্র্যাকিং পোর্টাল</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
          অর্ডার দেওয়ার সময় প্রাপ্ত Order ID এবং আপনার WhatsApp নাম্বার দিয়ে অর্ডারের লাইভ অগ্রগতি জানুন।
        </p>
      </div>

      {/* Tracking Search Card */}
      <div className="clay-card-elevated p-6 sm:p-8 rounded-3xl border border-white/[0.08] mb-8">
        <form onSubmit={handleTrackSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Order ID (অর্ডার আইডি) *
            </label>
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="BST-2026..."
              className="w-full clay-input px-3.5 py-3 text-xs sm:text-sm font-mono uppercase"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              WhatsApp / Phone Number *
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="018XXXXXXXX"
              className="w-full clay-input px-3.5 py-3 text-xs sm:text-sm font-mono"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 text-xs sm:text-sm font-bold clay-btn-primary flex items-center justify-center gap-2 cursor-pointer min-h-[44px] rounded-xl"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>যাচাই হচ্ছে...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>অর্ডার খুঁজুন</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Error / Not Found Message */}
      {errorMessage && (
        <div className="p-6 rounded-2xl bg-rose-950/30 border border-rose-500/40 text-rose-300 text-center text-sm sm:text-base animate-in fade-in duration-200 shadow-[inset_1.5px_1.5px_3px_rgba(244,63,94,0.2)]">
          <AlertTriangle className="w-8 h-8 text-rose-400 mx-auto mb-2" />
          <p className="font-semibold">{errorMessage}</p>
        </div>
      )}

      {/* Order Result Details */}
      {order && (
        <div className="clay-card-elevated p-6 sm:p-10 rounded-3xl border border-white/[0.08] animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
          {/* Top Status Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.06]">
            <div>
              <span className="text-[11px] text-slate-400 font-mono uppercase tracking-wider">
                Order ID
              </span>
              <h2 className="text-xl sm:text-2xl font-mono font-bold text-[#1ac8ff]">
                #{order.orderId}
              </h2>
              <span className="text-xs text-slate-400">
                তারিখ: {new Date(order.createdAt).toLocaleString('bn-BD', { timeZone: 'Asia/Dhaka' })}
              </span>
            </div>

            <div className="flex flex-col sm:items-end gap-1">
              <span className="text-[11px] text-slate-400">অর্ডার স্ট্যাটাস:</span>
              {getStatusBadge(order.orderStatus)}
            </div>
          </div>

          {/* Cancellation Rejection Reason Notice (if Cancelled) */}
          {order.orderStatus === 'Cancelled' && (
            <div className="p-5 rounded-2xl bg-rose-950/40 border border-rose-500/50 text-rose-200 shadow-[inset_1.5px_1.5px_3px_rgba(244,63,94,0.25)]">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-rose-300">বাতিলের কারণ:</h4>
                  <p className="text-xs sm:text-sm mt-1 leading-relaxed">
                    {order.rejectionReason || 'ভুল লিঙ্ক বা অপর্যাপ্ত পেমেন্ট তথ্যের কারণে অর্ডারটি বাতিল করা হয়েছে। বিস্তারিত জানতে WhatsApp-এ যোগাযোগ করুন।'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Service Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Service Snapshot */}
            <div className="p-5 rounded-2xl clay-card border border-white/[0.06] space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 border-b border-white/[0.06] pb-2">
                অর্ডারকৃত সার্ভিসের বিবরণ
              </h4>

              <div className="flex justify-between text-xs text-slate-300">
                <span className="text-slate-400">সার্ভিস টাইপ:</span>
                <span className="font-semibold text-white">{order.type}</span>
              </div>

              {order.type === 'SMM' && order.smmDetails && (
                <>
                  <div className="flex justify-between text-xs text-slate-300">
                    <span className="text-slate-400">প্ল্যাটফর্ম:</span>
                    <span className="font-semibold text-white">{order.smmDetails.platform}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-300">
                    <span className="text-slate-400">সার্ভিস:</span>
                    <span className="font-semibold text-white">
                      {order.smmDetails.serviceType} ({order.smmDetails.tierName})
                    </span>
                  </div>
                  {order.smmDetails.reactionType && (
                    <div className="flex justify-between text-xs text-slate-300 items-center">
                      <span className="text-slate-400">রিঅ্যাকশন টাইপ:</span>
                      <span className="font-bold text-rose-300 px-2.5 py-1 rounded-xl clay-badge border border-rose-500/30">
                        {order.smmDetails.reactionType}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs text-slate-300">
                    <span className="text-slate-400">পরিমাণ (Quantity):</span>
                    <span className="font-mono font-semibold text-white">
                      {order.smmDetails.quantity.toLocaleString('en-US')}
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 pt-1">
                    <span className="text-slate-400 block mb-1">টার্গেট লিঙ্ক:</span>
                    <span className="font-mono text-[11px] text-[#1ac8ff] break-all clay-well p-2.5 rounded-xl block border border-blue-500/20">
                      {order.smmDetails.targetLink}
                    </span>
                  </div>
                </>
              )}

              {order.type === 'ADS' && order.adsDetails && (
                <>
                  <div className="flex justify-between text-xs text-slate-300">
                    <span className="text-slate-400">প্ল্যাটফর্ম:</span>
                    <span className="font-semibold text-white">{order.adsDetails.platform}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-300">
                    <span className="text-slate-400">বাজেট:</span>
                    <span className="font-mono font-semibold text-white">৳{order.adsDetails.budget}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-300">
                    <span className="text-slate-400">ক্যাম্পেইন সময়:</span>
                    <span className="font-semibold text-white">{order.adsDetails.campaignDuration}</span>
                  </div>
                </>
              )}

              {order.type === 'WEBSITE' && order.websiteDetails && (
                <>
                  <div className="flex justify-between text-xs text-slate-300">
                    <span className="text-slate-400">প্যাকেজ:</span>
                    <span className="font-semibold text-white">
                      {order.websiteDetails.packageName}
                    </span>
                  </div>
                  {order.websiteDetails.businessName && (
                    <div className="flex justify-between text-xs text-slate-300">
                      <span className="text-slate-400">ব্যবসার নাম:</span>
                      <span className="font-semibold text-white">
                        {order.websiteDetails.businessName}
                      </span>
                    </div>
                  )}
                </>
              )}

              <div className="pt-3 border-t border-white/[0.06] flex justify-between items-center text-xs">
                <span className="text-slate-300 font-bold">সর্বমোট মূল্য:</span>
                <span className="text-lg font-black text-gradient font-mono">৳{order.totalAmount}</span>
              </div>
            </div>

            {/* Payment Record */}
            <div className="p-5 rounded-2xl clay-card border border-white/[0.06] space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 border-b border-white/[0.06] pb-2">
                পেমেন্ট ও ভেরিফিকেশন তথ্য
              </h4>

              <div className="flex justify-between text-xs text-slate-300">
                <span className="text-slate-400">পেমেন্ট স্ট্যাটাস:</span>
                <span
                  className={`font-bold px-2.5 py-0.5 rounded-lg clay-badge ${
                    order.paymentStatus === 'Verified'
                      ? 'text-emerald-400 border border-emerald-500/30'
                      : order.paymentStatus === 'Cancelled'
                      ? 'text-rose-400 border border-rose-500/30'
                      : 'text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </div>

              {order.payment ? (
                <>
                  <div className="flex justify-between text-xs text-slate-300">
                    <span className="text-slate-400">মেথড:</span>
                    <span className="font-semibold text-white">{order.payment.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-300">
                    <span className="text-slate-400">সেন্ডার নাম্বার:</span>
                    <span className="font-mono text-white">{order.payment.senderNumber}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-300">
                    <span className="text-slate-400">Transaction ID:</span>
                    <span className="font-mono font-bold text-[#1ac8ff]">
                      {order.payment.transactionId}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-300">
                    <span className="text-slate-400">পরিশোধিত টাকা:</span>
                    <span className="font-mono font-semibold text-white">
                      ৳{order.payment.paidAmount}
                    </span>
                  </div>
                </>
              ) : (
                <div className="py-4 text-center text-xs text-amber-400 clay-well rounded-xl border border-amber-500/20">
                  এখনও কোনো পেমেন্ট রেকর্ড যুক্ত হয়নি।
                </div>
              )}
            </div>
          </div>

          {/* WhatsApp Support CTA */}
          <div className="p-4 rounded-2xl clay-card border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-300">
              <span className="font-bold text-white">অর্ডারের বিষয়ে কোনো প্রশ্ন আছে?</span>
              <p className="text-slate-400 mt-0.5">আমাদের WhatsApp সাপোর্টে যোগাযোগ করলে সাথে সাথে সমাধান পাবেন।</p>
            </div>
            <a
              href={`https://wa.me/${cleanAdminPhone}?text=${encodeURIComponent(
                `হ্যালো BOOSTARA, আমি আমার অর্ডার #${order.orderId} সম্পর্কে তথ্য জানতে চাই।`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-5 rounded-xl clay-btn-emerald text-white text-xs font-bold flex items-center gap-2 transition-all shrink-0"
            >
              <MessageCircle className="w-4 h-4 fill-white/10" />
              <span>WhatsApp Support</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
