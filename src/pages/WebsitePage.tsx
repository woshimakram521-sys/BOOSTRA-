import React, { useState, useEffect } from 'react';
import {
  Globe,
  Clock,
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  Video,
  Code,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { WebsitePackage } from '../types';
import { CommonOrderWarning } from '../components/CommonOrderWarning';
import { SEO } from '../components/SEO';

export const WebsitePage: React.FC = () => {
  const { navigate, settings, showToast } = useApp();
  const [packages, setPackages] = useState<WebsitePackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackageId, setSelectedPackageId] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Custom Build fields
  const [businessName, setBusinessName] = useState('');
  const [websiteType, setWebsiteType] = useState('E-commerce / Shop');
  const [preferredColor, setPreferredColor] = useState('Dark / Modern Blue');
  const [referenceLink, setReferenceLink] = useState('');

  // Course fields
  const [deliveryMethod, setDeliveryMethod] = useState<'WhatsApp' | 'Email'>('WhatsApp');

  // Common fields
  const [customerWhatsapp, setCustomerWhatsapp] = useState('');
  const [orderNote, setOrderNote] = useState('');

  // Load packages dynamically from backend/database
  useEffect(() => {
    setLoading(true);
    api
      .getWebsitePackages()
      .then((data) => {
        setPackages(data);
        if (data.length > 0) {
          setSelectedPackageId(data[0].id);
        }
      })
      .catch((err) => {
        console.error('Failed to load website packages:', err);
        setErrorMsg('ওয়েবসাইট প্যাকেজ লোড করতে সমস্যা হয়েছে। অনুগ্রহ করে পেজটি রিফ্রেশ করুন।');
      })
      .finally(() => setLoading(false));
  }, []);

  const selectedPackage = packages.find((p) => p.id === selectedPackageId) || packages[0];
  const isCourse = selectedPackage?.packageType === 'course';

  const totalAmount = selectedPackage ? selectedPackage.totalPrice : 0;
  const advanceAmount = selectedPackage ? selectedPackage.advanceAmount : 0;
  const remainingAmount = selectedPackage
    ? (selectedPackage.remainingAmount !== undefined ? selectedPackage.remainingAmount : (totalAmount - advanceAmount))
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!selectedPackage) {
      setErrorMsg('অনুগ্রহ করে একটি ওয়েবসাইট প্যাকেজ নির্বাচন করুন।');
      return;
    }

    if (!isCourse && !businessName.trim()) {
      setErrorMsg('ব্যবসা বা প্রতিষ্ঠানের নাম উল্লেখ করুন।');
      return;
    }

    if (!customerWhatsapp.trim() || customerWhatsapp.trim().length < 10) {
      setErrorMsg('সঠিক WhatsApp নাম্বার দিন।');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.createOrder({
        type: 'WEBSITE',
        customerWhatsapp: customerWhatsapp.trim(),
        orderNote: orderNote.trim(),
        website: {
          packageId: selectedPackage.id,
          businessName: !isCourse ? businessName.trim() : undefined,
          websiteType: !isCourse ? websiteType : undefined,
          preferredColor: !isCourse ? preferredColor : undefined,
          referenceLink: !isCourse ? referenceLink.trim() : undefined,
          deliveryMethod: isCourse ? deliveryMethod : undefined,
        },
      });

      showToast('ওয়েবসাইট অর্ডার সফলভাবে তৈরি হয়েছে! পেমেন্ট পেজে রিডাইরেক্ট করা হচ্ছে...', 'success');
      navigate(`/payment?orderId=${encodeURIComponent(res.orderId)}`);
    } catch (err: any) {
      const errTxt = err.message || 'অর্ডার প্রক্রিয়া করা যায়নি।';
      setErrorMsg(errTxt);
      showToast(errTxt, 'error');
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SEO
        title="Website Building — Custom Business & E-Commerce Websites | BOOSTARA"
        description="Professional landing pages and e-commerce websites with BOOSTARA fast delivery."
        keywords="website building Bangladesh, landing page design, eCommerce website, web development, BOOSTARA website"
        canonicalPath="/website"
      />

      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl clay-badge text-purple-400 text-xs font-bold uppercase tracking-wider mb-4">
          <Globe className="w-4 h-4" />
          <span>Professional Web Presence</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white mb-3 drop-shadow-md">
          ওয়েবসাইট <span className="text-gradient">বিল্ডিং সল্যুশন</span>
        </h1>
        <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
          আপনার ব্যবসার জন্য প্রফেশনাল ল্যান্ডিং পেজ/ওয়েবসাইট তৈরি করিয়ে নিন অথবা নিজে শেখার পূর্ণাঙ্গ ভিডিও কোর্স পান।
        </p>
      </div>

      {loading ? (
        <div className="clay-card p-12 rounded-3xl text-center mb-8">
          <div className="w-8 h-8 rounded-full border-2 border-[#8b3dff] border-t-transparent animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-400">লাইভ ওয়েবসাইট প্যাকেজ লোড হচ্ছে...</p>
        </div>
      ) : packages.length === 0 ? (
        <div className="clay-card p-12 rounded-3xl text-center mb-8 text-slate-400 text-sm">
          বর্তমানে কোনো প্যাকেজ সক্রিয় নেই। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।
        </div>
      ) : (
        /* Dynamic Package Selector Cards */
        <div className={`grid grid-cols-1 ${packages.length === 1 ? 'max-w-lg mx-auto' : 'md:grid-cols-2'} gap-6 mb-8`}>
          {packages.map((pkg, idx) => {
            const isSelected = selectedPackage?.id === pkg.id;
            const isPkgCourse = pkg.packageType === 'course';
            const pkgRemaining = pkg.remainingAmount !== undefined ? pkg.remainingAmount : (pkg.totalPrice - pkg.advanceAmount);

            return (
              <div
                key={pkg.id}
                onClick={() => setSelectedPackageId(pkg.id)}
                className={`p-6 sm:p-8 rounded-3xl transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? isPkgCourse
                      ? 'clay-card-elevated border-cyan-400/50 shadow-[inset_2.5px_2.5px_5px_rgba(255,255,255,0.15),0_18px_40px_rgba(26,200,255,0.25)]'
                      : 'clay-card-elevated border-purple-500/50 shadow-[inset_2.5px_2.5px_5px_rgba(255,255,255,0.15),0_18px_40px_rgba(139,61,255,0.25)]'
                    : 'clay-card opacity-85 hover:opacity-100 hover:scale-[1.01]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xs font-bold uppercase tracking-wider ${isPkgCourse ? 'text-cyan-400' : 'text-purple-400'}`}>
                      প্যাকেজ {idx + 1}
                    </span>
                    <div
                      className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                        isSelected
                          ? isPkgCourse
                            ? 'border-[#1ac8ff] bg-[#1ac8ff] shadow-[inset_1px_1px_2px_rgba(255,255,255,0.4),0_0_10px_rgba(26,200,255,0.5)]'
                            : 'border-[#8b3dff] bg-[#8b3dff] shadow-[inset_1px_1px_2px_rgba(255,255,255,0.4),0_0_10px_rgba(139,61,255,0.5)]'
                          : 'border-slate-600 bg-[#090f1d]'
                      }`}
                    >
                      {isSelected && (
                        <CheckCircle className={`w-4 h-4 ${isPkgCourse ? 'text-[#050b1b]' : 'text-white'}`} />
                      )}
                    </div>
                  </div>

                  <h3 className="text-xl font-black text-white mb-2">{pkg.name}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">{pkg.description}</p>

                  {/* Features List */}
                  {pkg.features && pkg.features.length > 0 && (
                    <div className="space-y-1.5 text-xs text-slate-400 mb-6">
                      {pkg.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2">
                          {isPkgCourse ? (
                            <Video className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                          ) : (
                            <Code className="w-3.5 h-3.5 text-[#1ac8ff] shrink-0" />
                          )}
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Delivery time indicator */}
                  {pkg.deliveryTime && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl clay-well text-[11px] text-cyan-300 mb-4 border border-cyan-500/20">
                      <Clock className="w-3 h-3 shrink-0" />
                      <span>ডেলিভারি সময়: {pkg.deliveryTime}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-white/[0.06]">
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-xs text-slate-400">মোট মূল্য:</span>
                    <span className="text-lg font-bold text-white font-mono">৳{pkg.totalPrice}</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-emerald-400 font-bold">এখন প্রদেয় অগ্রিম:</span>
                    <span className="text-xl font-black text-gradient font-mono">৳{pkg.advanceAmount}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 block text-right mt-0.5 font-mono">
                    (বাকি ৳{pkgRemaining} কাজ শেষে পরিশোধযোগ্য)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Form Details */}
      {selectedPackage && (
        <div className="clay-card-elevated p-6 sm:p-10 rounded-3xl border border-white/[0.08] relative">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMsg && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-center gap-3 shadow-[inset_1px_1px_2px_rgba(244,63,94,0.2)]">
                <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            {!isCourse ? (
              /* Custom Website Build Requirement Fields */
              <div className="space-y-5">
                <h4 className="text-sm font-bold text-white border-b border-white/[0.06] pb-2.5 flex items-center justify-between">
                  <span>ওয়েবসাইট রিকোয়ারমেন্ট ফর্ম ({selectedPackage.name})</span>
                  <span className="text-[11px] text-purple-400 font-normal">অগ্রিম ৳{advanceAmount}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Business / Shop Name (ব্যবসার নাম) *
                    </label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="যেমন: ফ্যাশন হাউজ বিডি"
                      className="w-full clay-input px-3.5 py-2.5 text-xs sm:text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Website Type (ওয়েবসাইটের ধরন) *
                    </label>
                    <select
                      value={websiteType}
                      onChange={(e) => setWebsiteType(e.target.value)}
                      className="w-full clay-input px-3.5 py-2.5 text-xs sm:text-sm cursor-pointer"
                    >
                      <option value="E-commerce / Shop">ই-কমার্স / অনলাইন শপ</option>
                      <option value="Landing Page">প্রোডাক্ট সিঙ্গেল ল্যান্ডিং পেজ</option>
                      <option value="Business Portfolio">কোম্পানি / পার্সোনাল পোর্টফোলিও</option>
                      <option value="Service Agency">সার্ভিস বা এজেন্সি ওয়েবসাইট</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Preferred Color / Style (পছন্দের কালার ও থিম)
                    </label>
                    <input
                      type="text"
                      value={preferredColor}
                      onChange={(e) => setPreferredColor(e.target.value)}
                      placeholder="যেমন: ডার্ক নিয়ন, ব্লু, রেড, ক্লিন মিনিমাল"
                      className="w-full clay-input px-3.5 py-2.5 text-xs sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Reference Website Link (ঐচ্ছিক ডেমো লিংক)
                    </label>
                    <input
                      type="url"
                      value={referenceLink}
                      onChange={(e) => setReferenceLink(e.target.value)}
                      placeholder="https://example.com"
                      className="w-full clay-input px-3.5 py-2.5 text-xs sm:text-sm font-mono"
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* Course / Tutorial Delivery Fields */
              <div className="space-y-5">
                <h4 className="text-sm font-bold text-white border-b border-white/[0.06] pb-2.5 flex items-center justify-between">
                  <span>কোর্স রিকোয়ারমেন্ট ফর্ম ({selectedPackage.name})</span>
                  <span className="text-[11px] text-cyan-400 font-normal">অগ্রিম ৳{advanceAmount}</span>
                </h4>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Delivery Method (কোর্স ডেলিভারির মাধ্যম) *
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <label
                      className={`p-3.5 rounded-2xl flex items-center gap-3 cursor-pointer transition-all ${
                        deliveryMethod === 'WhatsApp'
                          ? 'clay-tab-active text-white'
                          : 'clay-tab-inactive'
                      }`}
                    >
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value="WhatsApp"
                        checked={deliveryMethod === 'WhatsApp'}
                        onChange={() => setDeliveryMethod('WhatsApp')}
                        className="accent-[#1ac8ff]"
                      />
                      <span className="text-xs font-bold">হোয়াটসঅ্যাপে ড্রাইভ লিংক</span>
                    </label>

                    <label
                      className={`p-3.5 rounded-2xl flex items-center gap-3 cursor-pointer transition-all ${
                        deliveryMethod === 'Email'
                          ? 'clay-tab-active text-white'
                          : 'clay-tab-inactive'
                      }`}
                    >
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value="Email"
                        checked={deliveryMethod === 'Email'}
                        onChange={() => setDeliveryMethod('Email')}
                        className="accent-[#1ac8ff]"
                      />
                      <span className="text-xs font-bold">ইমেলে ড্রাইভ লিংক</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Common fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  আপনার WhatsApp নাম্বার *
                </label>
                <input
                  type="tel"
                  value={customerWhatsapp}
                  onChange={(e) => setCustomerWhatsapp(e.target.value)}
                  placeholder="018XXXXXXXX"
                  className="w-full clay-input px-3.5 py-2.5 text-xs sm:text-sm font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  বিশেষ কোনো নোট (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  placeholder="নির্দিষ্ট কোনো রিকোয়ারমেন্ট থাকলে লিখুন"
                  className="w-full clay-input px-3.5 py-2.5 text-xs sm:text-sm"
                />
              </div>
            </div>

            {/* Dynamic Price Breakdown */}
            <div className="p-5 rounded-2xl clay-card border border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>নির্বাচিত প্যাকেজ:</span>
                <span className="font-semibold text-white">{selectedPackage.name}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>প্যাকেজের সর্বমোট মূল্য:</span>
                <span className="font-mono font-semibold">৳{totalAmount}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>অবশিষ্ট টাকা (কাজ শেষে প্রদেয়):</span>
                <span className="font-mono font-semibold text-slate-400">৳{remainingAmount}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>ডেলিভারি সময়:</span>
                <span className="font-mono font-semibold text-cyan-300">{selectedPackage.deliveryTime || '১ থেকে ১০ ঘণ্টা'}</span>
              </div>
              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-sm font-bold text-white">বর্তমানে প্রদেয় অগ্রিম (Advance):</span>
                <span className="text-2xl font-black text-gradient font-mono">৳{advanceAmount}</span>
              </div>
            </div>

            {/* Delivery Note */}
            <div className="flex items-center gap-2.5 text-xs font-medium text-slate-300 clay-well p-3.5 rounded-2xl">
              <Clock className="w-4 h-4 text-purple-400 shrink-0" />
              <span>{settings.deliveryMessages?.website || '⏱️ ১ থেকে ১০ ঘণ্টার মধ্যে সম্পন্ন হবে।'}</span>
            </div>

            {/* Common Order Warning */}
            <CommonOrderWarning />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 text-sm sm:text-base font-bold clay-btn-primary flex items-center justify-center gap-2 cursor-pointer min-h-[50px] rounded-2xl"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>অর্ডার প্রক্রিয়া করা হচ্ছে...</span>
                </>
              ) : (
                <>
                  <span>অগ্রিম পরিশোধ ও অর্ডার কনফার্ম করুন (৳{advanceAmount})</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
