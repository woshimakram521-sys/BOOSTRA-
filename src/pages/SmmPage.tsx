import React, { useState, useEffect, useMemo } from 'react';
import {
  Share2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Info,
  CheckCircle,
  Calculator,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { SMMService, SMMServiceTier, PlatformType, SMMServiceType, ReactionType } from '../types';
import { CommonOrderWarning } from '../components/CommonOrderWarning';
import { SEO } from '../components/SEO';

export const REACTION_TYPES: Array<{
  id: ReactionType;
  name: string;
  emoji: string;
  activeClass: string;
  textClass: string;
  borderHover: string;
}> = [
  {
    id: 'Like',
    name: 'Like',
    emoji: '👍',
    activeClass: 'bg-blue-500/20 text-white border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.35)]',
    textClass: 'text-blue-300',
    borderHover: 'hover:border-blue-500/60',
  },
  {
    id: 'Love',
    name: 'Love',
    emoji: '❤️',
    activeClass: 'bg-rose-500/20 text-white border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.35)]',
    textClass: 'text-rose-300',
    borderHover: 'hover:border-rose-500/60',
  },
  {
    id: 'Care',
    name: 'Care',
    emoji: '🥰',
    activeClass: 'bg-amber-500/20 text-white border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.35)]',
    textClass: 'text-amber-300',
    borderHover: 'hover:border-amber-500/60',
  },
  {
    id: 'Haha',
    name: 'Haha',
    emoji: '😂',
    activeClass: 'bg-yellow-500/20 text-white border-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.35)]',
    textClass: 'text-yellow-300',
    borderHover: 'hover:border-yellow-500/60',
  },
  {
    id: 'Sad',
    name: 'Sad',
    emoji: '😢',
    activeClass: 'bg-cyan-500/20 text-white border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.35)]',
    textClass: 'text-cyan-300',
    borderHover: 'hover:border-cyan-500/60',
  },
  {
    id: 'Angry',
    name: 'Angry',
    emoji: '😡',
    activeClass: 'bg-orange-500/20 text-white border-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.35)]',
    textClass: 'text-orange-300',
    borderHover: 'hover:border-orange-500/60',
  },
];

export const SmmPage: React.FC = () => {
  const { navigate, settings, showToast } = useApp();
  const [allServices, setAllServices] = useState<SMMService[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form states
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType>('Facebook');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [selectedTierId, setSelectedTierId] = useState<string>('');
  const [selectedReaction, setSelectedReaction] = useState<ReactionType | ''>('');
  const [targetLink, setTargetLink] = useState('');
  const [quantity, setQuantity] = useState<number>(1000);
  const [customerWhatsapp, setCustomerWhatsapp] = useState('');
  const [orderNote, setOrderNote] = useState('');

  const platforms: PlatformType[] = ['Facebook', 'Instagram', 'TikTok', 'YouTube'];

  // Load services dynamically from DB
  useEffect(() => {
    setLoading(true);
    api
      .getSMMServices()
      .then((data) => {
        setAllServices(data);
      })
      .catch((err) => {
        console.error('Failed to load SMM services:', err);
        setErrorMsg('সার্ভিস লোড করতে সমস্যা হয়েছে। অনুগ্রহ করে পেজটি রিফ্রেশ করুন।');
      })
      .finally(() => setLoading(false));
  }, []);

  // Filter services by active platform
  const platformServices = useMemo(() => {
    return allServices.filter((s) => s.platform === selectedPlatform && s.active);
  }, [allServices, selectedPlatform]);

  // When platform changes, reset service and tier
  useEffect(() => {
    if (platformServices.length > 0) {
      setSelectedServiceId(platformServices[0].id);
    } else {
      setSelectedServiceId('');
      setSelectedTierId('');
    }
  }, [selectedPlatform, platformServices]);

  // Selected Service object
  const currentService = useMemo(() => {
    return platformServices.find((s) => s.id === selectedServiceId);
  }, [platformServices, selectedServiceId]);

  // Available Tiers for current service
  const availableTiers = useMemo(() => {
    return currentService?.tiers.filter((t) => t.active) || [];
  }, [currentService]);

  // When current service changes, select first tier
  useEffect(() => {
    if (availableTiers.length > 0) {
      setSelectedTierId(availableTiers[0].id);
    } else {
      setSelectedTierId('');
    }
  }, [availableTiers]);

  // Selected Tier object
  const currentTier = useMemo(() => {
    return availableTiers.find((t) => t.id === selectedTierId);
  }, [availableTiers, selectedTierId]);

  // Check if current service is Facebook Reactions
  const isFacebookReactions =
    selectedPlatform === 'Facebook' && currentService?.serviceType === 'Reactions';

  // Reset reaction if switching away from Facebook Reactions
  useEffect(() => {
    if (!isFacebookReactions) {
      setSelectedReaction('');
    }
  }, [isFacebookReactions]);

  // Determine min quantity based on service type
  const isFollowerOrSub =
    currentService?.serviceType === 'Followers' || currentService?.serviceType === 'Subscribers';
  const minQty = isFollowerOrSub ? 500 : (currentService?.minQuantity || 100);

  // If quantity is less than min, adjust it
  useEffect(() => {
    if (quantity < minQty) {
      setQuantity(minQty);
    }
  }, [minQty]);

  // Price calculation: (quantity / 1000) * selected tier price
  const tierRate = currentTier?.ratePer1000 || 0;
  const calculatedPrice = Math.round((quantity / 1000) * tierRate);
  const smmFee = settings.smmServiceFee || 0;
  const totalAmount = calculatedPrice + smmFee;
  const isPriceValid = calculatedPrice >= 20;

  // Dynamic link guidance
  const linkGuidance = isFollowerOrSub
    ? '⚠️ গাইডলাইন: এখানে আপনার প্রোফাইল বা চ্যানেলের মেইন লিংকটি (Profile/Channel Link) দিন।'
    : '⚠️ গাইডলাইন: এখানে আপনার নির্দিষ্ট পোস্ট বা ভিডিওর লিংকটি (Post/Video Link) দিন।';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!currentService || !currentTier) {
      setErrorMsg('অনুগ্রহ করে একটি সার্ভিস ও টিয়ার নির্বাচন করুন।');
      return;
    }

    if (isFacebookReactions && !selectedReaction) {
      setErrorMsg('অনুগ্রহ করে ফেসবুক পোস্টের জন্য একটি রিঅ্যাকশন টাইপ (Like, Love, Care, Haha, Sad বা Angry) নির্বাচন করুন।');
      return;
    }

    if (!targetLink.trim()) {
      setErrorMsg('অনুগ্রহ করে টার্গেট লিংক প্রদান করুন।');
      return;
    }

    if (quantity < minQty) {
      setErrorMsg(`সর্বনিম্ন পরিমাণ ${minQty} হতে হবে।`);
      return;
    }

    if (calculatedPrice < 20) {
      setErrorMsg('সর্বনিম্ন অর্ডারের মূল্য ২০ টাকা হতে হবে। অনুগ্রহ করে পরিমাণ বাড়ান।');
      return;
    }

    if (!customerWhatsapp.trim() || customerWhatsapp.trim().length < 10) {
      setErrorMsg('সঠিক WhatsApp নাম্বার দিন।');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.createOrder({
        type: 'SMM',
        customerWhatsapp: customerWhatsapp.trim(),
        orderNote: orderNote.trim(),
        smm: {
          platform: currentService.platform,
          serviceType: currentService.serviceType,
          tierName: currentTier.tierName,
          ratePer1000: currentTier.ratePer1000,
          quantity: Number(quantity),
          targetLink: targetLink.trim(),
          reactionType: isFacebookReactions ? selectedReaction : undefined,
        },
      });

      showToast('অর্ডার সফলভাবে তৈরি হয়েছে! পেমেন্ট পেজে রিডাইরেক্ট করা হচ্ছে...', 'success');
      // Redirect to payment page
      navigate(`/payment?orderId=${encodeURIComponent(res.orderId)}`);
    } catch (err: any) {
      const errTxt = err.message || 'অর্ডার সাবমিট করতে সমস্যা হয়েছে।';
      setErrorMsg(errTxt);
      showToast(errTxt, 'error');
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SEO
        title="SMM Panel — Facebook, Instagram, TikTok, YouTube Services | BOOSTARA"
        description="Boost likes, followers, views and subscribers instantly with BOOSTARA's reliable SMM panel in Bangladesh."
        keywords="SMM panel Bangladesh, Facebook followers, Instagram likes, YouTube subscribers, TikTok views, bKash SMM"
        canonicalPath="/smm"
      />

      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl clay-badge text-[#1ac8ff] text-xs font-bold uppercase tracking-wider mb-4">
          <Share2 className="w-4 h-4" />
          <span>Dynamic SMM Growth Panel</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white mb-3 drop-shadow-md">
          সোশ্যাল মিডিয়া <span className="text-gradient">SMM অর্ডার প্যানেল</span>
        </h1>
        <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
          ফেসবুক, ইনস্টাগ্রাম, টিকটক ও ইউটিউবের জন্য ১০০% ড্রপ-মুক্ত ও গ্যারান্টিযুক্ত সার্ভিস। ইনস্ট্যান্ট ডেলিভারি শুরু।
        </p>
      </div>

      {loading ? (
        <div className="clay-card p-12 rounded-3xl text-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#1ac8ff] border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-sm text-slate-400">ডাটাবেজ থেকে লাইভ সার্ভিস ও টিয়ার লোড হচ্ছে...</p>
        </div>
      ) : (
        <div className="clay-card-elevated p-6 sm:p-10 rounded-3xl border border-white/[0.08] relative">
          <form onSubmit={handleSubmit} className="space-y-7">
            {errorMsg && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-center gap-3 shadow-[inset_1px_1px_2px_rgba(244,63,94,0.2)]">
                <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* 1. Platform Selector Tabs */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2.5">
                ১. প্ল্যাটফর্ম নির্বাচন করুন
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-1.5 rounded-2xl clay-well">
                {platforms.map((p) => {
                  const isSelected = selectedPlatform === p;
                  return (
                    <button
                      type="button"
                      key={p}
                      onClick={() => setSelectedPlatform(p)}
                      className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                        isSelected
                          ? 'clay-tab-active text-white'
                          : 'clay-tab-inactive'
                      }`}
                    >
                      <span>{p}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Service Type Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2.5">
                ২. সার্ভিস টাইপ
              </label>
              {platformServices.length === 0 ? (
                <div className="p-4 rounded-2xl clay-well text-xs text-slate-400">
                  এই প্ল্যাটফর্মের জন্য বর্তমানে কোনো সার্ভিস চালু নেই।
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {platformServices.map((s) => {
                    const isSelected = selectedServiceId === s.id;
                    return (
                      <button
                        type="button"
                        key={s.id}
                        onClick={() => setSelectedServiceId(s.id)}
                        className={`p-3.5 rounded-2xl text-xs font-semibold text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'clay-card border-cyan-400/40 text-[#1ac8ff] shadow-[inset_1.5px_1.5px_2px_rgba(255,255,255,0.15),0_6px_16px_rgba(26,200,255,0.2)]'
                            : 'clay-card opacity-80 hover:opacity-100 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1.5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span>{s.serviceType}</span>
                            {s.badge === 'Featured' && (
                              <span className="text-[9px] px-2 py-0.5 rounded-md bg-purple-500/25 text-purple-300 border border-purple-500/40 font-bold shadow-[inset_1px_1px_2px_rgba(255,255,255,0.2)]">
                                ⭐ Featured
                              </span>
                            )}
                            {s.badge === 'Popular' && (
                              <span className="text-[9px] px-2 py-0.5 rounded-md bg-amber-500/25 text-amber-300 border border-amber-500/40 font-bold shadow-[inset_1px_1px_2px_rgba(255,255,255,0.2)]">
                                🔥 Popular
                              </span>
                            )}
                          </div>
                          {isSelected && <CheckCircle className="w-3.5 h-3.5 text-[#1ac8ff] shrink-0" />}
                        </div>
                        <span className="text-[10px] text-slate-500 block mt-1">
                          {s.tiers.length} টিয়ার উপলব্ধ
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 3. Tier Selector */}
            {availableTiers.length > 0 && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2.5">
                  ৩. সার্ভিসের টিয়ার বা প্যাকেজ
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {availableTiers.map((t) => {
                    const isSelected = selectedTierId === t.id;
                    return (
                      <div
                        key={t.id}
                        onClick={() => setSelectedTierId(t.id)}
                        className={`p-4 rounded-2xl transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'clay-card border-purple-500/50 shadow-[inset_2px_2px_3px_rgba(255,255,255,0.15),0_10px_24px_rgba(139,61,255,0.3)]'
                            : 'clay-card opacity-85 hover:opacity-100'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">{t.tierName}</span>
                            <span className="text-[10px] px-2.5 py-0.5 rounded-lg clay-badge text-slate-300">
                              {t.guaranteePeriod}
                            </span>
                          </div>
                          <span className="text-xs text-[#1ac8ff] font-semibold mt-1 block font-mono">
                            ৳{t.ratePer1000} / ১,০০০
                          </span>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                            isSelected
                              ? 'border-[#8b3dff] bg-[#8b3dff] shadow-[inset_1px_1px_2px_rgba(255,255,255,0.4),0_0_10px_rgba(139,61,255,0.5)]'
                              : 'border-slate-600 bg-[#090f1d]'
                          }`}
                        >
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white shadow-sm" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3.1 Reaction Type Selector (Required for Facebook Reactions) */}
            {isFacebookReactions && (
              <div className="p-5 rounded-2xl clay-card border border-purple-500/30 space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-white/[0.06] pb-3">
                  <div>
                    <label className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                      <span>রিঅ্যাকশন টাইপ নির্বাচন করুন (Select Reaction Type)</span>
                      <span className="text-rose-400 font-black">*</span>
                    </label>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      আপনার ফেসবুক পোস্টের জন্য যেকোনো একটি রিঅ্যাকশন নির্বাচন করুন
                    </p>
                  </div>

                  {selectedReaction && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl clay-badge text-cyan-300 text-xs font-bold self-start sm:self-auto border border-cyan-500/30">
                      <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{REACTION_TYPES.find((r) => r.id === selectedReaction)?.emoji} {selectedReaction} সিলেক্টেড</span>
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 pt-1">
                  {REACTION_TYPES.map((item) => {
                    const isSelected = selectedReaction === item.id;
                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => {
                          setSelectedReaction(item.id);
                          setErrorMsg('');
                        }}
                        className={`py-3 px-2 rounded-2xl text-center border transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-1.5 group transform active:scale-95 ${
                          isSelected
                            ? `${item.activeClass} scale-[1.04] shadow-[inset_1.5px_2px_3px_rgba(255,255,255,0.35),0_8px_20px_rgba(0,0,0,0.6)]`
                            : `clay-card text-slate-300 ${item.borderHover}`
                        }`}
                      >
                        <span className="text-2xl sm:text-3xl transition-transform group-hover:scale-110 drop-shadow-sm">
                          {item.emoji}
                        </span>
                        <span className={`text-xs font-bold ${isSelected ? 'text-white' : item.textClass}`}>
                          {item.name}
                        </span>
                        <div
                          className={`w-2 h-2 rounded-full transition-all ${
                            isSelected ? 'bg-cyan-400 shadow-[0_0_8px_#1ac8ff]' : 'bg-transparent'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>

                {!selectedReaction && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs flex items-center gap-2">
                    <Info className="w-4 h-4 shrink-0 text-amber-400" />
                    <span>অর্ডার সম্পন্ন করতে উপরের ৬টি রিঅ্যাকশনের মধ্য থেকে যেকোনো একটি বেছে নিন।</span>
                  </div>
                )}
              </div>
            )}

            {/* 4. Target Link with Dynamic Guidance */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                {isFacebookReactions ? '৫' : '৪'}. টার্গেট লিংক
              </label>
              <div className="p-3 rounded-xl clay-well text-[#1ac8ff] text-xs mb-2 flex items-center gap-2 border border-blue-500/20">
                <Info className="w-4 h-4 shrink-0" />
                <span>{linkGuidance}</span>
              </div>
              <input
                type="url"
                value={targetLink}
                onChange={(e) => setTargetLink(e.target.value)}
                placeholder="https://facebook.com/... অথবা https://instagram.com/..."
                className="w-full clay-input px-4 py-3 text-xs sm:text-sm font-mono"
                required
              />
            </div>

            {/* 5. Quantity & WhatsApp */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    {isFacebookReactions ? '৬' : '৫'}. পরিমাণ (Quantity)
                  </label>
                  <span className="text-[11px] text-slate-400">
                    সর্বনিম্ন: {minQty}
                  </span>
                </div>
                <input
                  type="number"
                  min={minQty}
                  step={100}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full clay-input px-4 py-3 text-xs sm:text-sm font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  {isFacebookReactions ? '৭' : '৬'}. আপনার WhatsApp নাম্বার
                </label>
                <input
                  type="tel"
                  value={customerWhatsapp}
                  onChange={(e) => setCustomerWhatsapp(e.target.value)}
                  placeholder="018XXXXXXXX"
                  className="w-full clay-input px-4 py-3 text-xs sm:text-sm font-mono"
                  required
                />
              </div>
            </div>

            {/* 6. Optional Order Note */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                {isFacebookReactions ? '৮' : '৭'}. অর্ডারের বিশেষ নোট (ঐচ্ছিক)
              </label>
              <input
                type="text"
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
                placeholder="যেমন: দিনে সর্বোচ্চ ৫০০ করে পাঠাবেন বা নির্দিষ্ট কোনো নির্দেশনা"
                className="w-full clay-input px-4 py-3 text-xs sm:text-sm"
              />
            </div>

            {/* Price Breakdown Card */}
            <div className="p-5 rounded-2xl clay-card border border-white/[0.08] space-y-3">
              {isFacebookReactions && selectedReaction && (
                <div className="flex items-center justify-between text-xs text-slate-300 pb-2.5 border-b border-white/[0.06]">
                  <span>নির্বাচিত রিঅ্যাকশন টাইপ:</span>
                  <span className="font-bold text-rose-300 flex items-center gap-1.5 text-xs clay-badge px-3 py-1 rounded-xl border border-rose-500/30">
                    <span className="text-base">{REACTION_TYPES.find((r) => r.id === selectedReaction)?.emoji}</span>
                    <span>{selectedReaction} Reaction</span>
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>সার্ভিস রেট (Rate per 1000):</span>
                <span className="font-mono font-semibold">৳{tierRate}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>নির্বাচিত পরিমাণ (Quantity):</span>
                <span className="font-mono font-semibold">{quantity.toLocaleString('en-US')}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>সার্ভিস চার্জ (SMM Fee):</span>
                <span className="font-mono font-semibold text-emerald-400">৳০ (ফ্রি)</span>
              </div>
              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-sm font-bold text-white">সর্বমোট মূল্য (Total):</span>
                <div className="text-right">
                  <span className="text-xl sm:text-2xl font-black text-gradient">
                    ৳{totalAmount}
                  </span>
                  {!isPriceValid && (
                    <span className="block text-[10px] text-rose-400">
                      ন্যূনতম অর্ডারের মূল্য ২০ টাকা হতে হবে
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Delivery text specified in prompt */}
            <div className="flex items-center gap-2.5 text-xs font-medium text-slate-300 clay-well p-3.5 rounded-2xl">
              <Clock className="w-4 h-4 text-[#1ac8ff] shrink-0" />
              <span>{settings.deliveryMessages?.smm || '⏱️ অর্ডার কনফার্ম হওয়ার পর ১ থেকে ৪ ঘণ্টার মধ্যে সম্পন্ন হবে।'}</span>
            </div>

            {/* Common Order Warning specified in prompt */}
            <CommonOrderWarning />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || !isPriceValid}
              className="w-full py-4 text-sm sm:text-base font-bold clay-btn-primary flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed min-h-[50px] rounded-2xl"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>অর্ডার প্রক্রিয়া করা হচ্ছে...</span>
                </>
              ) : (
                <>
                  <span>অর্ডার করুন ও পেমেন্টে যান (৳{totalAmount})</span>
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
