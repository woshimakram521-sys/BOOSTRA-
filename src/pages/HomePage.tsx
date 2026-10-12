import React, { useEffect, useState } from 'react';
import {
  Zap,
  Share2,
  TrendingUp,
  Globe,
  Clock,
  MessageCircle,
  ShieldCheck,
  Search,
  Tag,
  Star,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
  CreditCard,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Review, WebsitePackage } from '../types';
import { SEO } from '../components/SEO';

export const HomePage: React.FC = () => {
  const { navigate, completedOrdersCount, settings } = useApp();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [websitePackages, setWebsitePackages] = useState<WebsitePackage[]>([]);
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);
  const [trackOrderId, setTrackOrderId] = useState('');
  const [trackPhone, setTrackPhone] = useState('');

  useEffect(() => {
    api
      .getReviews()
      .then((data) => {
        setReviews(data);
      })
      .catch((err) => console.error('Failed to load reviews:', err))
      .finally(() => setReviewsLoading(false));

    api
      .getWebsitePackages()
      .then((pkgs) => {
        setWebsitePackages(pkgs);
      })
      .catch((err) => console.error('Failed to load website packages:', err));
  }, []);

  // Multi-card auto-sliding reviews
  useEffect(() => {
    if (reviews.length <= 1) return;
    const interval = setInterval(() => {
      setActiveReviewIndex((prev) => (prev + 1) % reviews.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [reviews.length]);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackOrderId.trim() && trackPhone.trim()) {
      navigate(
        `/track-order?orderId=${encodeURIComponent(trackOrderId.trim())}&phone=${encodeURIComponent(
          trackPhone.trim()
        )}`
      );
    }
  };

  // Compact 4 Core Benefits
  const coreBenefits = [
    {
      title: '১-৪ ঘণ্টায় ডেলিভারি',
      desc: 'কনফার্মেশনের সাথে সাথেই স্বয়ংক্রিয় প্রসেসিং শুরু হয়।',
      icon: Clock,
      gradient: 'from-blue-500/20 to-cyan-500/20',
      border: 'hover:border-cyan-500/50',
    },
    {
      title: 'WhatsApp লাইভ সাপোর্ট',
      desc: 'যেকোনো জিজ্ঞাসায় আমাদের টিম সরাসরি হোয়াটসঅ্যাপে সর্বদা প্রস্তুত।',
      icon: MessageCircle,
      gradient: 'from-emerald-500/20 to-teal-500/20',
      border: 'hover:border-emerald-500/50',
    },
    {
      title: 'নিরাপদ বিকাশ ও নগদ',
      desc: 'পার্সোনাল সেন্ড মানি ও তাৎক্ষণিক ভেরিফিকেশন সুবিধা।',
      icon: ShieldCheck,
      gradient: 'from-purple-500/20 to-pink-500/20',
      border: 'hover:border-purple-500/50',
    },
    {
      title: 'স্বচ্ছ রেট ও ট্র্যাকিং',
      desc: 'কোনো গোপন চার্জ নেই। অর্ডার আইডি দিয়ে লাইভ আপডেট জানুন।',
      icon: Tag,
      gradient: 'from-amber-500/20 to-orange-500/20',
      border: 'hover:border-amber-500/50',
    },
  ];

  // 6 Popular Services
  const popularServices = [
    {
      id: 'smm-fb-ig',
      icon: Share2,
      badge: 'Popular',
      badgeColor: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
      iconBg: 'from-[#8b3dff] to-[#1ac8ff]',
      title: 'Facebook ও Instagram গ্রোথ',
      desc: 'পেজ লাইক, ফলোয়ার, পোস্ট রিঅ্যাকশন ও ড্রপ-ফ্রি সার্ভিস।',
      price: 'মাত্র ২০ টাকা থেকে শুরু',
      route: '/smm',
      btnText: 'SMM সার্ভিস',
    },
    {
      id: 'smm-tiktok',
      icon: Zap,
      badge: 'Instant',
      badgeColor: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
      iconBg: 'from-[#8b3dff] to-pink-500',
      title: 'TikTok Followers & Views',
      desc: 'ভিডিও ভিউজ, লাইক ও ফ্যান ফলোয়ার্স দিয়ে ভিডিও ভাইরাল করুন।',
      price: 'মাত্র ২০ টাকা থেকে শুরু',
      route: '/smm',
      btnText: 'TikTok বুস্ট',
    },
    {
      id: 'smm-youtube',
      icon: Sparkles,
      badge: 'Lifetime',
      badgeColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
      iconBg: 'from-red-500 to-amber-500',
      title: 'YouTube Sub & Views',
      desc: 'মনিটাইজেশন সহায়ক সাবস্ক্রাইবার, লাইক ও রিয়েল ভিউজ।',
      price: 'মাত্র ৯০ টাকা থেকে শুরু',
      route: '/smm',
      btnText: 'YouTube বুস্ট',
    },
    {
      id: 'ads-meta',
      icon: TrendingUp,
      badge: 'Targeted',
      badgeColor: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
      iconBg: 'from-blue-600 to-cyan-500',
      title: 'Targeted Meta Ads Boost',
      desc: 'বয়স, এলাকা ও পছন্দের ভিত্তিতে ফেসবুক ও ইনস্টাগ্রাম মেসেজ অ্যাড।',
      price: `বাজেট ৳${settings.adsMinimumBudget || 145} + ফি ৳${settings.adsServiceFee || 40}`,
      route: '/ads',
      btnText: 'Ads Boost অর্ডার',
    },
    {
      id: 'ads-video',
      icon: TrendingUp,
      badge: 'Reach',
      badgeColor: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
      iconBg: 'from-indigo-600 to-[#1ac8ff]',
      title: 'TikTok & YouTube Ads',
      desc: 'ভিডিও ক্রিয়েটিভ দিয়ে নতুন অডিয়েন্স ও সেলস বৃদ্ধি।',
      price: `বাজেট ৳${settings.adsMinimumBudget || 145} + ফি ৳${settings.adsServiceFee || 40}`,
      route: '/ads',
      btnText: 'ভিডিও অ্যাডস',
    },
    {
      id: 'web-solution',
      icon: Globe,
      badge: 'Web',
      badgeColor: 'bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/30',
      iconBg: 'from-purple-500 to-indigo-600',
      title: 'Website Building & Course',
      desc: 'রেডি অনলাইন শপ/ল্যান্ডিং পেজ তৈরি অথবা নিজে শেখার ভিডিও কোর্স।',
      price: websitePackages.length > 0
        ? `অগ্রিম ৳${websitePackages[0].advanceAmount} (মোট ৳${websitePackages[0].totalPrice})`
        : 'অগ্রিম ৳২৫০ (মোট ৳৫০০)',
      route: '/website',
      btnText: 'ওয়েবসাইট প্যাকেজ',
    },
    {
      id: 'virtual-visa-card',
      icon: CreditCard,
      badge: 'Hot Offer',
      badgeColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
      iconBg: 'from-emerald-500 to-cyan-500',
      title: 'Dollar & Virtual Visa Card',
      desc: 'লাইভ ডলার রেট এবং ফেসবুক ও গুগল অ্যাডস বুস্টিংয়ের জন্য আন্তর্জাতিক ডুয়েল কারেন্সি কার্ড।',
      price: `লাইভ রেট $1 = ৳${settings.dollarCategory?.dollarRate || settings.usdConversionRate || 145}`,
      route: '/dollar',
      btnText: 'ডলার ও কার্ড সার্ভিস',
    },
  ];

  // Visible reviews for the 3-card sliding carousel
  const visibleReviews = () => {
    if (reviews.length === 0) return [];
    if (reviews.length <= 3) return reviews;
    const r1 = reviews[activeReviewIndex % reviews.length];
    const r2 = reviews[(activeReviewIndex + 1) % reviews.length];
    const r3 = reviews[(activeReviewIndex + 2) % reviews.length];
    return [r1, r2, r3];
  };

  const currentVisibleReviews = visibleReviews();

  return (
    <div className="w-full">
      <SEO
        title="BOOSTARA — Social Media Growth, Ads Boost & Website Services"
        description="BOOSTARA provides affordable Facebook, Instagram, TikTok and YouTube growth services, Ads Boost and professional website services."
        keywords="BOOSTARA, Social Media Growth, SMM panel Bangladesh, Ads boost, Facebook boost, Website building, bKash payment"
        canonicalPath="/"
      />

      {/* 1. HERO SECTION (Tactile Claymorphism) */}
      <section className="relative overflow-hidden hero-radial-bg pt-6 pb-8 sm:pt-8 sm:pb-10 border-b border-white/[0.06]">
        {/* Soft volumetric ambient glows */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-[#8b3dff]/12 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-[#1ac8ff]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-xl clay-badge text-[#1ac8ff] text-[11px] font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#1ac8ff]" />
            <span>Digital Marketing & SMM Growth</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-2.5 sm:mb-3 max-w-3xl mx-auto leading-tight drop-shadow-md">
            <span>Boost Your Social </span>
            <span className="text-gradient">Presence Instantly</span>
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-slate-300 max-w-xl mx-auto mb-5 sm:mb-6 leading-relaxed">
            ফেসবুক, ইনস্টাগ্রাম, টিকটক ও ইউটিউবের ফলোয়ার, লাইক, অ্যাডস বুস্টিং এবং প্রফেশনাল ওয়েবসাইট সল্যুশন এক প্ল্যাটফর্মে। কোনো অ্যাকাউন্ট খোলার ঝামেলা নেই!
          </p>

          {/* 4 Top CTA Buttons: SMM | Ads Boost | Website | Dollar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto mb-5 sm:mb-6">
            <button
              onClick={() => navigate('/smm')}
              className="clay-btn-primary py-3 px-3.5 rounded-2xl text-xs sm:text-sm cursor-pointer flex items-center justify-center gap-2 min-h-[46px]"
            >
              <Zap className="w-4 h-4 fill-white/20" />
              <span>SMM Panel</span>
            </button>

            <button
              onClick={() => navigate('/ads')}
              className="py-3 px-3.5 rounded-2xl font-bold text-xs sm:text-sm text-white bg-gradient-to-br from-[#0284c7] via-[#0369a1] to-[#1ac8ff] border border-white/20 shadow-[inset_1.5px_2px_3px_rgba(255,255,255,0.4),inset_-2px_-3px_5px_rgba(0,0,0,0.4),0_10px_22px_-4px_rgba(2,132,199,0.5)] hover:shadow-[0_14px_28px_-4px_rgba(2,132,199,0.65)] hover:-translate-y-0.5 active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2 min-h-[46px]"
            >
              <TrendingUp className="w-4 h-4 text-white" />
              <span>Ads Boost</span>
            </button>

            <button
              onClick={() => navigate('/website')}
              className="py-3 px-3.5 rounded-2xl font-bold text-xs sm:text-sm text-white bg-gradient-to-br from-[#7e22ce] via-[#6b21a8] to-[#c026d3] border border-white/20 shadow-[inset_1.5px_2px_3px_rgba(255,255,255,0.4),inset_-2px_-3px_5px_rgba(0,0,0,0.4),0_10px_22px_-4px_rgba(126,34,206,0.5)] hover:shadow-[0_14px_28px_-4px_rgba(126,34,206,0.65)] hover:-translate-y-0.5 active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2 min-h-[46px]"
            >
              <Globe className="w-4 h-4 text-white" />
              <span>Website</span>
            </button>

            <button
              onClick={() => navigate('/dollar')}
              className="clay-btn-emerald py-3 px-3.5 rounded-2xl text-xs sm:text-sm cursor-pointer flex items-center justify-center gap-2 min-h-[46px]"
            >
              <CreditCard className="w-4 h-4 text-white" />
              <span>Dollar ও কার্ড</span>
            </button>
          </div>

          {/* Unified Compact Trust & Payment Badges Row */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 text-xs">
            <div className="px-4 py-1.5 rounded-xl clay-badge flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[11px] sm:text-xs font-bold text-white">
                <span className="text-gradient font-black">{completedOrdersCount}+</span> অর্ডার সম্পন্ন
              </span>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-bold">
              <span className="px-2.5 py-1 rounded-lg bg-[#141b2e] border border-pink-500/30 text-pink-400 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.1),inset_-1px_-1px_2px_rgba(0,0,0,0.5)]">bKash</span>
              <span className="px-2.5 py-1 rounded-lg bg-[#141b2e] border border-amber-500/30 text-amber-400 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.1),inset_-1px_-1px_2px_rgba(0,0,0,0.5)]">Nagad</span>
              <span className="px-2.5 py-1 rounded-lg bg-[#141b2e] border border-purple-500/30 text-purple-400 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.1),inset_-1px_-1px_2px_rgba(0,0,0,0.5)]">Rocket</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. COMPACT TRACKING STRIP (Clay Inset Form) */}
      <section className="max-w-3xl mx-auto -mt-4 sm:-mt-5 px-4 relative z-20">
        <div className="clay-card p-3.5 sm:p-4 rounded-2xl border border-white/[0.08]">
          <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row items-center gap-2.5">
            <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-center">
              <div className="w-6 h-6 rounded-lg bg-[#141d36] flex items-center justify-center shadow-[inset_1px_1px_2px_rgba(255,255,255,0.15),inset_-1px_-1px_2px_rgba(0,0,0,0.6)]">
                <Search className="w-3.5 h-3.5 text-[#1ac8ff]" />
              </div>
              <span className="text-xs font-bold text-white whitespace-nowrap">অর্ডার ট্র্যাকিং:</span>
            </div>
            <input
              type="text"
              value={trackOrderId}
              onChange={(e) => setTrackOrderId(e.target.value)}
              placeholder="Order ID (BST-2026...)"
              className="clay-input px-3 py-2 text-xs font-mono uppercase tracking-wider flex-1 w-full sm:w-auto"
              required
            />
            <input
              type="tel"
              value={trackPhone}
              onChange={(e) => setTrackPhone(e.target.value)}
              placeholder="WhatsApp (018XXXXXXXX)"
              className="clay-input px-3 py-2 text-xs font-mono flex-1 w-full sm:w-auto"
              required
            />
            <button
              type="submit"
              className="clay-btn-primary px-5 py-2 text-xs font-bold whitespace-nowrap cursor-pointer w-full sm:w-auto min-h-[38px]"
            >
              Track Now
            </button>
          </form>
        </div>
      </section>

      {/* 3. POPULAR SERVICES GRID (Tactile Clay Cards) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex items-center justify-between gap-2 mb-4 sm:mb-5">
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-white flex items-center gap-1.5 drop-shadow-sm">
              <span>জনপ্রিয়</span>
              <span className="text-gradient">সার্ভিসসমূহ</span>
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-400">সোশ্যাল মিডিয়া গ্রোথ ও বিজ্ঞাপনের সেরা প্যাকেজ</p>
          </div>
          <button
            onClick={() => navigate('/smm')}
            className="text-xs text-[#1ac8ff] hover:text-white font-semibold flex items-center gap-1 shrink-0 cursor-pointer transition-colors"
          >
            <span>সব দেখুন</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {popularServices.map((srv) => {
            const Icon = srv.icon;
            return (
              <div
                key={srv.id}
                className="clay-card p-4 rounded-2xl flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${srv.iconBg} flex items-center justify-center shadow-[inset_1.5px_2px_3px_rgba(255,255,255,0.4),inset_-2px_-2px_4px_rgba(0,0,0,0.4),0_6px_14px_rgba(0,0,0,0.4)]`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className={`text-[9px] font-bold px-2.5 py-1 rounded-lg border shadow-[inset_1px_1px_2px_rgba(255,255,255,0.15)] ${srv.badgeColor}`}>
                      {srv.badge}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-1 group-hover:text-[#1ac8ff] transition-colors truncate">
                    {srv.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-snug line-clamp-2 mb-3">
                    {srv.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-gradient font-mono truncate">
                    {srv.price}
                  </span>
                  <button
                    onClick={() => navigate(srv.route)}
                    className="py-1.5 px-3 text-[11px] font-bold clay-btn-primary flex items-center gap-1 cursor-pointer rounded-xl shrink-0"
                  >
                    <span>{srv.btnText}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. COMPACT BENEFITS (Tactile Clay Cards) */}
      <section className="bg-[#080e1c] border-y border-white/[0.06] py-6 sm:py-8 shadow-[inset_0_4px_12px_rgba(0,0,0,0.6)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-4">
            <h2 className="text-base sm:text-xl font-bold text-white">
              কেন <span className="text-gradient">BOOSTARA</span> বেছে নেবেন?
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {coreBenefits.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="clay-card p-3.5 rounded-2xl flex flex-col justify-between"
                >
                  <div>
                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${feat.gradient} flex items-center justify-center mb-2 text-[#1ac8ff] border border-white/10 shadow-[inset_1.5px_1.5px_2px_rgba(255,255,255,0.2),inset_-1.5px_-1.5px_3px_rgba(0,0,0,0.5)]`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-white mb-1">{feat.title}</h3>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. DATABASE REVIEWS (Tactile Clay Carousel) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-base sm:text-xl font-bold text-white flex items-center gap-1.5">
              <span>গ্রাহকদের</span>
              <span className="text-gradient">বাস্তব রিভিউ</span>
            </h2>
          </div>

          {reviews.length > 3 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setActiveReviewIndex((prev) => (prev - 1 + reviews.length) % reviews.length)
                }
                className="p-1.5 rounded-xl clay-btn-secondary text-slate-300 hover:text-white cursor-pointer"
                aria-label="Previous review"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveReviewIndex((prev) => (prev + 1) % reviews.length)}
                className="p-1.5 rounded-xl clay-btn-secondary text-slate-300 hover:text-white cursor-pointer"
                aria-label="Next review"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {reviewsLoading ? (
          <div className="flex items-center justify-center py-6">
            <div className="w-6 h-6 rounded-full border-2 border-[#1ac8ff] border-t-transparent animate-spin" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-6 rounded-2xl clay-well text-center text-slate-400 text-xs">
            এখনও কোনো রিভিউ যুক্ত করা হয়নি।
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {currentVisibleReviews.map((rev) => (
              <div
                key={rev.id}
                className="clay-card p-4 rounded-2xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(rev.createdAt).toLocaleDateString('bn-BD')}
                    </span>
                  </div>

                  <blockquote className="text-xs text-slate-200 leading-relaxed italic mb-3 line-clamp-2">
                    "{rev.reviewText}"
                  </blockquote>
                </div>

                <div className="flex items-center justify-between pt-2.5 border-t border-white/[0.06]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-xl bg-gradient-to-tr from-[#8b3dff] to-[#1ac8ff] flex items-center justify-center font-bold text-white text-[11px] shadow-[inset_1px_1px_2px_rgba(255,255,255,0.4)]">
                      {rev.customerName.charAt(0)}
                    </div>
                    <h4 className="text-xs font-bold text-white truncate max-w-[130px]">
                      {rev.customerName}
                    </h4>
                  </div>

                  <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    ভেরিফায়েড
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5. COMPACT FINAL CTA STRIP (Elevated Clay Banner) */}
      <section className="max-w-5xl mx-auto px-4 pb-8 sm:pb-10">
        <div className="clay-card-elevated relative overflow-hidden p-6 sm:p-8 text-center border border-white/[0.08]">
          <div className="relative z-10 max-w-xl mx-auto">
            <h2 className="text-lg sm:text-2xl font-black text-white mb-2">
              সোশ্যাল মিডিয়া গ্রোথ <span className="text-gradient">শুরু করতে প্রস্তুত?</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mb-4 leading-relaxed">
              কোনো রেজিস্ট্রেশন ছাড়াই মাত্র ১ মিনিটে অর্ডার করুন এবং আপনার পেজ বা চ্যানেলকে এগিয়ে নিন।
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => navigate('/smm')}
                className="clay-btn-primary py-2.5 px-5 rounded-2xl text-xs font-bold cursor-pointer flex items-center gap-2 min-h-[42px]"
              >
                <Zap className="w-4 h-4" />
                <span>SMM Panel (৳২০ থেকে)</span>
              </button>
              <button
                onClick={() => navigate('/ads')}
                className="clay-btn-secondary py-2.5 px-5 rounded-2xl text-xs font-bold cursor-pointer flex items-center gap-2 min-h-[42px]"
              >
                <TrendingUp className="w-4 h-4 text-[#1ac8ff]" />
                <span>Ads Boost অর্ডার</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
