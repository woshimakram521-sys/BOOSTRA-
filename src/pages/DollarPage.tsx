import React, { useState } from 'react';
import {
  DollarSign,
  CreditCard,
  MessageCircle,
  ShieldCheck,
  Zap,
  ArrowRight,
  TrendingUp,
  UserCheck,
  Mail,
  FileText,
  BadgePercent,
  CheckCircle2,
  Clock,
  Sparkles,
  RefreshCw,
  Lock,
  Globe,
  HelpCircle,
  AlertCircle,
  Calculator,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SEO } from '../components/SEO';
import virtualVisaImg from '../assets/images/virtual_visa_card_1790480298567.jpg';

export const DollarPage: React.FC = () => {
  const { settings, navigate } = useApp();

  const dollarConfig = settings.dollarCategory;
  const isEnabled = dollarConfig?.enabled !== false;
  const dollarRate = dollarConfig?.dollarRate || settings.usdConversionRate || 145;
  const rateNote = dollarConfig?.rateNote || 'সর্বশেষ আপডেটকৃত লাইভ রেট';

  const virtualCardConfig = dollarConfig?.virtualCard || {
    serviceName: 'International Virtual Visa Card Setup Service',
    currentPrice: 1000,
    previousPrice: 1600,
    description:
      'ফেসবুক ও ইনস্টাগ্রাম অ্যাডস বুস্টিং, গুগল অ্যাডস, ক্যানভা প্রো, চ্যাটজিপিটি প্লাস ও যেকোনো আন্তর্জাতিক অনলাইন পেমেন্টের জন্য ইনস্ট্যান্ট অ্যাক্টিভেশন ডুয়েল কারেন্সি ভার্চুয়াল ভিসা কার্ড।',
    whatsapp: '01813078583',
    deliveryTime: '১০-৩০ মিনিট',
  };

  const whatsappNumber = virtualCardConfig.whatsapp || settings.whatsapp || '01813078583';
  const prefilledMessage =
    'হ্যালো BOOSTARA, আমি আপনাদের International Virtual Visa Card Setup Service নিতে আগ্রহী। বিস্তারিত তথ্য, কার্ড ফি এবং NID/KYC ভেরিফিকেশন প্রসেস সম্পর্কে জানতে চাই।';
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '').startsWith('88') ? whatsappNumber.replace(/[^0-9]/g, '') : `88${whatsappNumber.replace(/[^0-9]/g, '')}`}?text=${encodeURIComponent(prefilledMessage)}`;

  // Quick Currency Converter State
  const [calcUsd, setCalcUsd] = useState<number | string>(10);
  const [calcBdt, setCalcBdt] = useState<number | string>(10 * dollarRate);

  const handleUsdChange = (val: string) => {
    setCalcUsd(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num >= 0) {
      setCalcBdt(Math.round(num * dollarRate));
    } else {
      setCalcBdt('');
    }
  };

  const handleBdtChange = (val: string) => {
    setCalcBdt(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num >= 0 && dollarRate > 0) {
      setCalcUsd((num / dollarRate).toFixed(2));
    } else {
      setCalcUsd('');
    }
  };

  const requirements = [
    {
      icon: UserCheck,
      title: 'জাতীয় পরিচয়পত্র (NID) / KYC ভেরিফিকেশন',
      desc: 'গ্রাহকের আসল NID কার্ডের উভয় পাশের স্পষ্ট রঙিন ছবি (অথবা স্মার্টকার্ড / পাসপোর্ট / ড্রাইভিং লাইসেন্স)।',
      badge: 'বাধ্যতামূলক',
    },
    {
      icon: Mail,
      title: 'সক্রিয় ব্যক্তিগত ইমেইল এড্রেস',
      desc: 'কার্ডের সংবেদনশীল ক্রেডেনশিয়াল (16-Digit Card Number, Expiry & CVV) নিরাপদে রিসিভ করার জন্য।',
      badge: 'বাধ্যতামূলক',
    },
    {
      icon: MessageCircle,
      title: 'সচল WhatsApp ও মোবাইল নম্বর',
      desc: 'লেনদেনের ওটিপি (OTP) কোড, কার্ড অ্যাক্টিভেশন ও তাৎক্ষণিক কাস্টমার সাপোর্টের জন্য প্রয়োজন।',
      badge: 'বাধ্যতামূলক',
    },
    {
      icon: FileText,
      title: 'ব্যবহারের উদ্দেশ্য ঘোষণা',
      desc: 'কার্ডটি কোন প্ল্যাটফর্মে ব্যবহার করবেন (যেমন: Meta/Facebook Ads, Google Ads, Canva, ইত্যাদি)।',
      badge: 'প্রয়োজনীয়',
    },
  ];

  const features = [
    {
      icon: Zap,
      title: '১০-৩০ মিনিটে ইনস্ট্যান্ট ডেলিভারি',
      desc: 'ডকুমেন্ট সাবমিট ও যাচাইয়ের অল্প সময়ের মধ্যেই আপনার ভার্চুয়াল কার্ড অ্যাক্টিভ হয়ে যাবে।',
    },
    {
      icon: Globe,
      title: 'মেটা ও গুগল অ্যাডস ১০০% সাপোর্টেড',
      desc: 'Facebook, Instagram, Google Ads, TikTok Ads ও আন্তর্জাতিক সাবস্ক্রিপশনে শতভাগ কার্যকর।',
    },
    {
      icon: Lock,
      title: '3D Secure OTP প্রোটেকশন',
      desc: 'প্রতিটি ট্রানজ্যাকশনে নিজস্ব ওটিপি ভেরিফিকেশন নিরাপত্তা, ব্যালেন্স ১০০% নিরাপদ।',
    },
    {
      icon: RefreshCw,
      title: 'বিকাশ ও নগদে সহজ ডলার রিলোড',
      desc: 'যেকোনো সময় সরাসরি বিকাশ বা নগদে টাকা পাঠিয়ে সুবিধাজনক রেটে ডলার রিচার্জ করার সুবিধা।',
    },
  ];

  const discountPercentage =
    virtualCardConfig.previousPrice > virtualCardConfig.currentPrice
      ? Math.round(
          ((virtualCardConfig.previousPrice - virtualCardConfig.currentPrice) /
            virtualCardConfig.previousPrice) *
            100
        )
      : 38;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      <SEO
        title="ডলার সার্ভিস ও ভার্চুয়াল ভিসা কার্ড — Dollar Rate & Virtual Visa Card | BOOSTARA"
        description="BOOSTARA ডলার সার্ভিস: লাইভ ডলার রেট এবং ডুয়েল কারেন্সি ইন্টারন্যাশনাল ভার্চুয়াল ভিসা কার্ড সেটআপ সার্ভিস। ফেসবুক ও গুগল অ্যাডসে ১০০% সাপোর্টেড।"
        keywords="Dollar rate Bangladesh, Virtual visa card Bangladesh, dual currency card, Facebook boost card, Google ads card, BOOSTARA dollar"
        canonicalPath="/dollar"
      />

      {/* 1. Header Banner */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl clay-badge text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4">
          <DollarSign className="w-4 h-4 text-emerald-400" />
          <span>BOOSTARA Official Dollar & Virtual Card Hub</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3 drop-shadow-md">
          ডলার সার্ভিস ও <span className="text-gradient">ভার্চুয়াল কার্ড</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
          লাইভ অফিশিয়াল ডলার রেট এবং ফেসবুক, গুগল ও আন্তর্জাতিক পেমেন্টের জন্য ইনস্ট্যান্ট ইন্টারন্যাশনাল ভার্চুয়াল ভিসা কার্ড সেটআপ সল্যুশন।
        </p>
      </div>

      {!isEnabled ? (
        /* Disabled Category Notice */
        <div className="clay-card p-8 rounded-3xl border border-amber-500/30 text-center space-y-4 max-w-xl mx-auto">
          <AlertCircle className="w-12 h-12 text-amber-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">ডলার সার্ভিস সাময়িকভাবে বিরতিতে রয়েছে</h2>
          <p className="text-xs sm:text-sm text-slate-300">
            আমরা ডলার ও কার্ড সার্ভিসের সিস্টেম আপডেট করছি। খুব শীঘ্রই আবার চালু হবে। যেকোনো জরুরি তথ্যের জন্য আমাদের WhatsApp-এ যোগাযোগ করুন।
          </p>
          <a
            href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl clay-btn-primary text-xs font-bold"
          >
            <MessageCircle className="w-4 h-4" />
            <span>হোয়াটসঅ্যাপে যোগাযোগ</span>
          </a>
        </div>
      ) : (
        <>
          {/* 2. DOLLAR RATE SECTION (Prominent, Live & Interactive Clay Surface) */}
          <div className="clay-card-elevated rounded-3xl border border-emerald-500/40 p-6 sm:p-8 bg-gradient-to-br from-[#0c162e] via-[#091124] to-[#0c162e] relative overflow-hidden">
            {/* Ambient Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#1ac8ff]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
              {/* Left: Dollar Rate Highlight */}
              <div className="lg:col-span-6 space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl clay-badge border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>লাইভ ডলার এক্সচেঞ্জ রেট</span>
                </div>

                <div className="pt-1">
                  <span className="text-xs sm:text-sm text-slate-400 font-medium block">
                    বর্তমান অফিশিয়াল রেট:
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl sm:text-5xl font-black text-white font-mono tracking-tight">
                      $1 =
                    </span>
                    <span className="text-4xl sm:text-6xl font-black text-emerald-400 font-mono tracking-tight drop-shadow-[0_0_20px_rgba(52,211,153,0.3)]">
                      ৳{dollarRate}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{rateNote}</span>
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  BOOSTARA প্ল্যাটফর্মে যেকোনো বিজ্ঞাপন বা ভার্চুয়াল কার্ডে ডলার রিচার্জের জন্য এই স্বচ্ছ রেট প্রযোজ্য। কোনো লুকায়িত অতিরিক্ত কনভার্সন ফি নেই।
                </p>
              </div>

              {/* Right: Interactive Currency Converter */}
              <div className="lg:col-span-6 clay-well rounded-2xl p-5 border border-white/[0.04] space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Calculator className="w-4 h-4 text-[#1ac8ff]" />
                    <span>দ্রুত কারেন্সি কনভার্টার (USD ⇄ BDT)</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold clay-badge px-2 py-0.5 border border-emerald-500/40">
                    Live Calculator
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                      ডলার পরিমাণ (USD $)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">
                        $
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={calcUsd}
                        onChange={(e) => handleUsdChange(e.target.value)}
                        placeholder="10"
                        className="w-full clay-input pl-8 pr-3 py-2.5 text-sm font-mono font-bold text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                      সমপরিমাণ টাকা (BDT ৳)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">
                        ৳
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={calcBdt}
                        onChange={(e) => handleBdtChange(e.target.value)}
                        placeholder="1450"
                        className="w-full clay-input pl-8 pr-3 py-2.5 text-sm font-mono font-bold text-emerald-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>হিসাব সূত্র: {calcUsd || 0} USD × ৳{dollarRate}</span>
                  <span className="font-mono font-bold text-white">= ৳{calcBdt || 0} BDT</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. VIRTUAL VISA CARD SETUP SERVICE (Tactile Clay Card Presentation) */}
          <div className="clay-card-elevated rounded-3xl border border-white/[0.08] overflow-hidden relative">
            {/* Header Ambient Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-r from-[#8b3dff]/20 via-[#1ac8ff]/25 to-emerald-500/20 blur-2xl pointer-events-none" />

            <div className="p-6 sm:p-8 lg:p-10 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Visual Image / 3D Card Presentation */}
                <div className="lg:col-span-5 flex flex-col items-center">
                  <div className="relative w-full max-w-sm group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#1ac8ff] via-[#8b3dff] to-emerald-400 rounded-3xl blur-lg opacity-40 group-hover:opacity-75 transition duration-500" />

                    <div className="relative rounded-2xl overflow-hidden border border-white/[0.1] bg-[#060b17] shadow-[inset_1.5px_2px_4px_rgba(255,255,255,0.15),0_12px_32px_rgba(0,0,0,0.8)]">
                      <img
                        src={virtualVisaImg}
                        alt={virtualCardConfig.serviceName}
                        className="w-full h-52 sm:h-56 object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-[#060b17] via-[#060b17]/40 to-transparent p-4 flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl clay-badge border-white/20 text-[#1ac8ff] text-[10px] font-bold tracking-wider uppercase">
                            <Sparkles className="w-3 h-3 text-[#1ac8ff]" />
                            <span>International Dual Currency</span>
                          </span>
                          <span className="font-mono text-[11px] font-bold text-emerald-400 clay-badge px-2 py-0.5 border border-emerald-500/40">
                            INSTANT ACTIVE
                          </span>
                        </div>

                        <div className="space-y-1">
                          <div className="font-mono text-sm tracking-widest text-white/90 drop-shadow">
                            •••• •••• •••• 8583
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-slate-300 font-mono">
                            <span>CARDHOLDER: BOOSTARA VIP</span>
                            <span>EXP: 05/29</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Supported Platforms */}
                    <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-[10px] text-slate-300 font-medium">
                      <span className="px-2.5 py-1 rounded-xl clay-badge text-slate-300">Meta Ads</span>
                      <span className="px-2.5 py-1 rounded-xl clay-badge text-slate-300">Google Ads</span>
                      <span className="px-2.5 py-1 rounded-xl clay-badge text-slate-300">TikTok Ads</span>
                      <span className="px-2.5 py-1 rounded-xl clay-badge text-slate-300">Canva Pro</span>
                      <span className="px-2.5 py-1 rounded-xl clay-badge text-slate-300">ChatGPT Plus</span>
                    </div>
                  </div>
                </div>

                {/* Service Details & Pricing */}
                <div className="lg:col-span-7 space-y-4">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl clay-badge text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2 border border-emerald-500/30">
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Standalone Dollar Service</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight drop-shadow-sm">
                      {virtualCardConfig.serviceName}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      আন্তর্জাতিক ডুয়েল কারেন্সি ভার্চুয়াল ভিসা কার্ড সেটআপ — ইনস্ট্যান্ট অ্যাক্টিভেশন
                    </p>
                  </div>

                  {/* Price Block */}
                  <div className="p-4 sm:p-5 rounded-2xl clay-well border border-white/[0.04] flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
                        কার্ড সেটআপ ও ইস্যু ফি (Setup Fee)
                      </span>
                      <div className="flex items-baseline gap-3">
                        <span className="text-2xl sm:text-3xl font-black text-gradient font-mono">
                          ৳{virtualCardConfig.currentPrice}
                        </span>
                        {virtualCardConfig.previousPrice > virtualCardConfig.currentPrice && (
                          <span className="text-sm sm:text-base text-slate-400 line-through font-mono">
                            ৳{virtualCardConfig.previousPrice}
                          </span>
                        )}
                        {discountPercentage > 0 && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg clay-badge text-emerald-300 text-[11px] font-bold border border-emerald-500/40">
                            <BadgePercent className="w-3 h-3" />
                            <span>{discountPercentage}% ছাড়</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-medium">ডেলিভারি সময়:</span>
                      <span className="text-xs font-bold text-cyan-400 flex items-center gap-1 justify-end">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{virtualCardConfig.deliveryTime || '১০–৩০ মিনিট'}</span>
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {virtualCardConfig.description}
                  </p>

                  {/* WhatsApp Action Button (Prominent) */}
                  <div className="pt-2">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-4 px-6 rounded-2xl clay-btn-emerald flex items-center justify-center gap-3 text-center group cursor-pointer"
                    >
                      <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center shrink-0 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.4)]">
                        <MessageCircle className="w-4 h-4 text-white fill-white" />
                      </div>
                      <div className="text-left sm:text-center">
                        <span className="block font-black tracking-wide text-white">
                          WhatsApp এ যোগাযোগ করুন ({whatsappNumber})
                        </span>
                        <span className="block text-[11px] text-emerald-100 font-normal opacity-90">
                          সরাসরি কথা বলে KYC ভেরিফিকেশন ও কার্ড সংগ্রহ করুন
                        </span>
                      </div>
                      <ArrowRight className="w-5 h-5 text-white/80 group-hover:translate-x-1 transition-transform shrink-0 hidden sm:block" />
                    </a>

                    {/* Notice for Contact Flow */}
                    <div className="mt-2.5 p-3 rounded-2xl clay-well border border-cyan-500/20 text-cyan-300/90 text-[11px] flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-cyan-400 mt-0.5" />
                      <span>
                        <strong>অর্ডার ও পেমেন্ট প্রসেস:</strong> এই সার্ভিসের জন্য সাধারণ SMM বা Ads Boost পেমেন্ট ফর্ম পূরণ করতে হয় না। প্রয়োজনীয় NID/KYC ভেরিফিকেশন ও কার্ড সিকিউরিটির জন্য সরাসরি আমাদের অফিসিয়াল WhatsApp <strong>{whatsappNumber}</strong>-এ যোগাযোগ করে কার্ড ইস্যু সম্পন্ন হবে।
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. NID / KYC & Document Requirements Section */}
            <div className="border-t border-white/[0.06] bg-[#080e1c] p-6 sm:p-8 lg:p-10">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-1.5">
                  <ShieldCheck className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    প্রয়োজনীয় NID / KYC ও ডকুমেন্ট রিকোয়ারমেন্ট (Document Requirements)
                  </h3>
                </div>
                <p className="text-xs text-slate-400">
                  আন্তর্জাতিক কার্ড প্রোভাইডার নীতি ও সিকিউরিটির অংশ হিসেবে কার্ড সেটআপের পূর্বে নিচের তথ্য ও ডকুমেন্টগুলো হোয়াটসঅ্যাপে প্রদান করতে হবে:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {requirements.map((req, idx) => {
                  const Icon = req.icon;
                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl clay-card border border-white/[0.05] hover:border-cyan-500/30 transition-all flex items-start gap-3.5 group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0 group-hover:bg-cyan-500/20 transition-colors shadow-[inset_1px_1px_2px_rgba(255,255,255,0.15)]">
                        <Icon className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#1ac8ff] transition-colors">
                            {req.title}
                          </h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg clay-badge text-cyan-300 border border-cyan-500/30 shrink-0">
                            {req.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {req.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 5. Features / Why Choose BOOSTARA Virtual Card */}
            <div className="border-t border-white/[0.06] bg-[#0a1226]/50 p-6 sm:p-8">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>ভার্চুয়াল ভিসা কার্ডের প্রধান সুবিধাসমূহ</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {features.map((feat, idx) => {
                  const Icon = feat.icon;
                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl clay-card border border-white/[0.04] space-y-1.5"
                    >
                      <div className="w-7 h-7 rounded-lg bg-[#8b3dff]/15 flex items-center justify-center text-cyan-400 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.15)]">
                        <Icon className="w-3.5 h-3.5 text-[#1ac8ff]" />
                      </div>
                      <h5 className="text-xs font-bold text-white">{feat.title}</h5>
                      <p className="text-[11px] text-slate-400 leading-snug">{feat.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Bar with Links */}
            <div className="border-t border-white/[0.06] bg-[#070d1a] p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <span className="text-xs text-slate-300 block font-medium">
                  ডলার রেট বা কার্ড সম্পর্কে যেকোনো প্রশ্নের জন্য:
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  WhatsApp: {whatsappNumber}
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-4 rounded-xl text-xs font-bold text-white clay-btn-emerald flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-white" />
                  <span>WhatsApp চ্যাট শুরু করুন</span>
                </a>

                <button
                  type="button"
                  onClick={() => navigate('/ads')}
                  className="py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-300 hover:text-white clay-btn-secondary flex items-center gap-1 cursor-pointer"
                >
                  <span>Ads Boost সার্ভিস দেখুন</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
