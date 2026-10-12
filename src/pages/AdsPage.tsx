import React, { useState } from 'react';
import {
  TrendingUp,
  Clock,
  AlertTriangle,
  ArrowRight,
  Info,
  Link as LinkIcon,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { CommonOrderWarning } from '../components/CommonOrderWarning';
import { SEO } from '../components/SEO';

type AdsPlatform = 'Facebook/Instagram' | 'TikTok' | 'YouTube';

export const AdsPage: React.FC = () => {
  const { navigate, settings, showToast } = useApp();
  const [platform, setPlatform] = useState<AdsPlatform>('Facebook/Instagram');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Common fields
  const [targetLink, setTargetLink] = useState('');
  const [budget, setBudget] = useState<number>(settings.adsMinimumBudget || 145);
  const [campaignDuration, setCampaignDuration] = useState('3 Days');
  const [mediaLink, setMediaLink] = useState('');
  const [customerWhatsapp, setCustomerWhatsapp] = useState('');
  const [orderNote, setOrderNote] = useState('');

  // Facebook/Instagram specific
  const [adObjective, setAdObjective] = useState('Messages');
  const [targetAgeRange, setTargetAgeRange] = useState('18-45');
  const [gender, setGender] = useState('All (সকল)');
  const [location, setLocation] = useState('Bangladesh (সমগ্র বাংলাদেশ)');
  const [interests, setInterests] = useState('Online Shopping, Fashion, Business');

  // TikTok specific
  const [tiktokAudience, setTiktokAudience] = useState('Youth & E-commerce buyers');

  // YouTube specific
  const [adFormat, setAdFormat] = useState('Skippable');

  // Sync budget with admin configured minimum budget
  React.useEffect(() => {
    if (settings.adsMinimumBudget && (!budget || budget < settings.adsMinimumBudget)) {
      setBudget(settings.adsMinimumBudget);
    }
  }, [settings.adsMinimumBudget]);

  const minBudget = settings.adsMinimumBudget || 145;
  const serviceFee = settings.adsServiceFee || 40;
  const usdRate = settings.usdConversionRate || 145;

  const usdEquivalent = (budget / usdRate).toFixed(2);
  const totalAmount = budget + serviceFee;
  const isBudgetValid = budget >= minBudget;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!targetLink.trim()) {
      setErrorMsg('টার্গেট পোস্ট বা পেজের লিঙ্ক দিন।');
      return;
    }

    if (budget < minBudget) {
      setErrorMsg(`সর্বনিম্ন বাজেট ৳${minBudget} ($1.00) হতে হবে।`);
      return;
    }

    if (!mediaLink.trim()) {
      setErrorMsg('অ্যাডের জন্য Google Drive পাবলিক মিডিয়া লিঙ্ক প্রদান করুন।');
      return;
    }

    if (!customerWhatsapp.trim() || customerWhatsapp.trim().length < 10) {
      setErrorMsg('সঠিক WhatsApp নাম্বার দিন।');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.createOrder({
        type: 'ADS',
        customerWhatsapp: customerWhatsapp.trim(),
        orderNote: orderNote.trim(),
        ads: {
          platform,
          targetLink: targetLink.trim(),
          adObjective: platform === 'Facebook/Instagram' ? adObjective : undefined,
          targetAgeRange: platform === 'Facebook/Instagram' ? targetAgeRange : undefined,
          gender: platform !== 'YouTube' ? gender : undefined,
          location: platform === 'Facebook/Instagram' ? location : undefined,
          interests: platform === 'Facebook/Instagram' ? interests : undefined,
          targetAudience: platform === 'TikTok' ? tiktokAudience : platform === 'YouTube' ? tiktokAudience : undefined,
          adFormat: platform === 'YouTube' ? adFormat : undefined,
          budget: Number(budget),
          campaignDuration,
          mediaLink: mediaLink.trim(),
          serviceFee,
        },
      });

      showToast('অ্যাড অর্ডার সফলভাবে তৈরি হয়েছে! পেমেন্ট পেজে রিডাইরেক্ট করা হচ্ছে...', 'success');
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
        title="Ads Boost — Facebook, Instagram, TikTok & YouTube Ads | BOOSTARA"
        description="Targeted social media advertising campaigns for higher reach, engagement, and sales with BOOSTARA."
        keywords="Facebook boost, Instagram ads, TikTok ads Bangladesh, YouTube promotion, digital marketing, BOOSTARA ads"
        canonicalPath="/ads"
      />

      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl clay-badge text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4">
          <TrendingUp className="w-4 h-4" />
          <span>Professional Paid Advertising</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white mb-4 drop-shadow-md">
          টার্গেটেড <span className="text-gradient">Ads Boost</span> সার্ভিস
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
          ফেসবুক, টিকটক ও ইউটিউব ক্যাম্পেইন দিয়ে আপনার পণ্যের বিক্রয় ও ব্র্যান্ড ভ্যালু বাড়িয়ে তুলুন।
        </p>
      </div>

      {/* Ads Campaign Form */}
      <div className="clay-card-elevated p-6 sm:p-10 rounded-3xl border border-white/[0.08] relative">
        <div className="mb-6 pb-4 border-b border-white/[0.06]">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shadow-[inset_1px_1px_2px_rgba(255,255,255,0.2)]">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span>Ads Campaign Boost অর্ডার ফর্ম</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            আমাদের এক্সপার্ট টিম দিয়ে ফেসবুক, টিকটক বা ইউটিউব বিজ্ঞাপন রান করতে নিচের ফর্মটি পূরণ করুন:
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-7">
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-center gap-3 shadow-[inset_1px_1px_2px_rgba(244,63,94,0.2)]">
              <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. Platform Tabs */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2.5">
              ১. অ্যাডস প্ল্যাটফর্ম নির্বাচন করুন
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-1.5 rounded-2xl clay-well">
              {(['Facebook/Instagram', 'TikTok', 'YouTube'] as AdsPlatform[]).map((p) => {
                const isSelected = platform === p;
                return (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setPlatform(p)}
                    className={`py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'clay-tab-active text-white'
                        : 'clay-tab-inactive'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Platform Specific Fields */}
          {platform === 'Facebook/Instagram' && (
            <div className="space-y-5 p-5 rounded-2xl clay-card border border-white/[0.06]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Ad Objective (বিজ্ঞাপনের লক্ষ্য)
                  </label>
                  <select
                    value={adObjective}
                    onChange={(e) => setAdObjective(e.target.value)}
                    className="w-full clay-input px-3.5 py-2.5 text-xs sm:text-sm cursor-pointer"
                  >
                    <option value="Messages">Messages (ইনবক্স মেসেজ ও সেল)</option>
                    <option value="Engagement">Engagement (পোস্ট লাইক ও কমেন্ট)</option>
                    <option value="Reach">Reach (সর্বোচ্চ মানুষের কাছে পৌঁছানো)</option>
                    <option value="Followers">Followers (পেজ ফলোয়ার বৃদ্ধি)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Target Age Range (বয়সসীমা)
                  </label>
                  <select
                    value={targetAgeRange}
                    onChange={(e) => setTargetAgeRange(e.target.value)}
                    className="w-full clay-input px-3.5 py-2.5 text-xs sm:text-sm cursor-pointer"
                  >
                    <option value="18-35">১৮ থেকে ৩৫ বছর (Youth & Tech)</option>
                    <option value="18-45">১৮ থেকে ৪৫ বছর (Standard Recommended)</option>
                    <option value="25-55">২৫ থেকে ৫৫ বছর (Mature & High Value)</option>
                    <option value="All">সকল বয়সের জন্য</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Gender (লিঙ্গ)
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full clay-input px-3.5 py-2.5 text-xs sm:text-sm cursor-pointer"
                  >
                    <option value="All">All (নারী ও পুরুষ উভয়ই)</option>
                    <option value="Men">Men (শুধুমাত্র পুরুষ)</option>
                    <option value="Women">Women (শুধুমাত্র নারী)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Location (অঞ্চল)
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="যেমন: সমগ্র বাংলাদেশ, ঢাকা ও চট্টগ্রাম ইত্যাদি"
                    className="w-full clay-input px-3.5 py-2.5 text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Interests / Keywords (পছন্দের বিষয়সমূহ)
                </label>
                <input
                  type="text"
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  placeholder="যেমন: E-commerce, Fashion, Food, Tech, Gadgets"
                  className="w-full clay-input px-3.5 py-2.5 text-xs sm:text-sm"
                />
              </div>
            </div>
          )}

          {platform === 'TikTok' && (
            <div className="space-y-5 p-5 rounded-2xl clay-card border border-white/[0.06]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Target Audience
                  </label>
                  <input
                    type="text"
                    value={tiktokAudience}
                    onChange={(e) => setTiktokAudience(e.target.value)}
                    placeholder="যেমন: Gen Z, তরুণ ক্রেতা, গ্যাজেট লাভার"
                    className="w-full clay-input px-3.5 py-2.5 text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full clay-input px-3.5 py-2.5 text-xs sm:text-sm cursor-pointer"
                  >
                    <option value="All">All (উভয়)</option>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {platform === 'YouTube' && (
            <div className="space-y-5 p-5 rounded-2xl clay-card border border-white/[0.06]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Ad Format (বিজ্ঞাপনের ফরম্যাট)
                  </label>
                  <select
                    value={adFormat}
                    onChange={(e) => setAdFormat(e.target.value)}
                    className="w-full clay-input px-3.5 py-2.5 text-xs sm:text-sm cursor-pointer"
                  >
                    <option value="Skippable">Skippable In-Stream (ভিডিওর শুরুতে স্কিপেবল)</option>
                    <option value="Discovery">In-Feed / Discovery (সার্চ রেজাল্ট ও ফিডে)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Target Audience / Category
                  </label>
                  <input
                    type="text"
                    value={tiktokAudience}
                    onChange={(e) => setTiktokAudience(e.target.value)}
                    placeholder="যেমন: মিউজিক, টেক রিভিউ, এডুকেশন"
                    className="w-full clay-input px-3.5 py-2.5 text-xs sm:text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 3. Target Link */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              ২. টার্গেট পোস্ট / পেজ / ভিডিও লিংক
            </label>
            <input
              type="url"
              value={targetLink}
              onChange={(e) => setTargetLink(e.target.value)}
              placeholder="https://facebook.com/... বা https://tiktok.com/@... বা https://youtube.com/watch?v=..."
              className="w-full clay-input px-4 py-3 text-xs sm:text-sm font-mono"
              required
            />
          </div>

          {/* 4. Budget & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  ৩. ক্যাম্পেইন বাজেট (BDT)
                </label>
                <span className="text-[11px] text-cyan-400 font-semibold font-mono">
                  মিনিমাম ৳{minBudget} (${(minBudget / usdRate).toFixed(2)})
                </span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  min={minBudget}
                  step={10}
                  value={budget}
                  onChange={(e) => setBudget(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full clay-input px-4 py-3 text-xs sm:text-sm font-mono font-bold pl-8"
                  required
                />
                <span className="absolute left-3 top-3.5 text-slate-500 font-bold">৳</span>
                <span className="absolute right-3 top-3.5 text-xs text-slate-400 font-mono">
                  ≈ ${usdEquivalent} USD
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                ৪. ক্যাম্পেইনের মেয়াদ (Duration)
              </label>
              <select
                value={campaignDuration}
                onChange={(e) => setCampaignDuration(e.target.value)}
                className="w-full clay-input px-4 py-3 text-xs sm:text-sm cursor-pointer"
              >
                <option value="1 Day">১ দিন (24 Hours)</option>
                <option value="3 Days">৩ দিন (Recommended)</option>
                <option value="5 Days">৫ দিন</option>
                <option value="7 Days">৭ দিন (1 Week)</option>
                <option value="15 Days">১৫ দিন</option>
                <option value="30 Days">৩০ দিন (1 Month)</option>
              </select>
            </div>
          </div>

          {/* 5. Google Drive Media Link */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              ৫. Google Drive Public Media Link (ছবি বা ভিডিও)
            </label>
            <div className="p-3 rounded-xl clay-well text-[#1ac8ff] text-xs mb-2 flex items-center gap-2 border border-blue-500/20">
              <Info className="w-4 h-4 shrink-0" />
              <span>আপনার বিজ্ঞাপন ক্রিয়েটিভ (ছবি/ভিডিও) ড্রাইভ লিঙ্কটি 'Anyone with the link' পাবলিক রাখুন।</span>
            </div>
            <input
              type="url"
              value={mediaLink}
              onChange={(e) => setMediaLink(e.target.value)}
              placeholder="https://drive.google.com/file/d/..."
              className="w-full clay-input px-4 py-3 text-xs sm:text-sm font-mono"
              required
            />
          </div>

          {/* 6. WhatsApp & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                ৬. আপনার WhatsApp নাম্বার
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

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                ৭. বিশেষ কোনো নোট (ঐচ্ছিক)
              </label>
              <input
                type="text"
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
                placeholder="অ্যাড সম্পর্কিত কোনো বিশেষ নোট"
                className="w-full clay-input px-4 py-3 text-xs sm:text-sm"
              />
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="p-5 rounded-2xl clay-card border border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>অ্যাড বাজেট (Ad Budget):</span>
              <span className="font-mono font-semibold">
                ৳{budget} (${usdEquivalent})
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>অ্যাড সেটআপ ও সার্ভিস ফি (Service Fee):</span>
              <span className="font-mono font-semibold text-emerald-400">৳{serviceFee}</span>
            </div>
            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-sm font-bold text-white">সর্বমোট প্রদেয় বিল (Total):</span>
              <div className="text-right">
                <span className="text-xl sm:text-2xl font-black text-gradient">
                  ৳{totalAmount}
                </span>
                {!isBudgetValid && (
                  <span className="block text-[10px] text-rose-400">
                    সর্বনিম্ন বাজেট ৳{minBudget} হতে হবে
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Delivery Note */}
          <div className="flex items-center gap-2.5 text-xs font-medium text-slate-300 clay-well p-3.5 rounded-2xl">
            <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{settings.deliveryMessages?.ads || '⏱️ ক্যাম্পেইন কনফার্ম হওয়ার পর ১ থেকে ২৪ ঘণ্টার মধ্যে শুরু হবে।'}</span>
          </div>

          {/* Common Order Warning */}
          <CommonOrderWarning />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting || !isBudgetValid}
            className="w-full py-4 text-sm sm:text-base font-bold clay-btn-primary flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed min-h-[50px] rounded-2xl"
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>অর্ডার প্রক্রিয়া করা হচ্ছে...</span>
              </>
            ) : (
              <>
                <span>Ads Boost অর্ডার করুন (৳{totalAmount})</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
