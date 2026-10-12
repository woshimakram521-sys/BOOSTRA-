import React, { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  CheckCircle,
  AlertTriangle,
  Wrench,
  ShieldAlert,
  Clock,
  Megaphone,
  Rocket,
  ExternalLink,
  Globe,
  Sparkles,
  DollarSign,
  CreditCard,
  Mail,
  Send,
  Info,
} from 'lucide-react';
import { AdminNav } from '../../components/AdminNav';
import { api } from '../../services/api';
import { AppSettings, SmmBoostSiteConfig } from '../../types';
import { useApp } from '../../context/AppContext';

export const AdminSettingsPage: React.FC = () => {
  const { refreshSettings, showToast } = useApp();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [emailStatus, setEmailStatus] = useState<any>(null);
  const [testingEmail, setTestingEmail] = useState(false);
  const [testEmailResult, setTestEmailResult] = useState<any>(null);

  const [formData, setFormData] = useState<AppSettings>({
    siteName: 'BOOSTARA',
    whatsapp: '01813078583',
    bkash: '01644633815',
    nagad: '01644633815',
    rocket: '01644633815',
    adsMinimumBudget: 145,
    adsServiceFee: 40,
    smmServiceFee: 0,
    usdConversionRate: 145,
    deliveryMessages: {
      smm: '⏱️ অর্ডার কনফার্ম হওয়ার পর ১ থেকে ৪ ঘণ্টার মধ্যে সম্পন্ন হবে।',
      ads: '⏱️ ক্যাম্পেইন কনফার্ম হওয়ার পর ১ থেকে ২৪ ঘণ্টার মধ্যে শুরু হবে।',
      website: '⏱️ ১ থেকে ১০ ঘণ্টার মধ্যে সম্পন্ন হবে।',
    },
    adminNotificationEmail: 'mdmohammad.644633815@gmail.com',
    maintenanceMode: {
      enabled: false,
      message: 'আমরা বর্তমানে কিছু গুরুত্বপূর্ণ আপডেট করছি। খুব শীঘ্রই BOOSTARA আবার সম্পূর্ণভাবে চালু হবে।',
      estimatedReturn: '',
    },
    announcementBar: {
      enabled: false,
      text: '🔥 বিশেষ অফার: বিকাশ বা নগদে অর্ডারে ১ ঘণ্টায় সুপার ফাস্ট ডেলিভারি! | যেকোনো সহায়তায় লাইভ হোয়াটসঅ্যাপ সাপোর্ট।',
      linkText: 'অর্ডার ট্র্যাক করুন →',
      linkUrl: '/track-order',
      badge: 'LIMITED OFFER',
    },
    smmBoostWebsites: [
      {
        id: 'smm-boost-1',
        name: 'SMM Boost Website 1',
        description: 'প্রিমিয়াম হাই-স্পিড ফলোয়ার, লাইক ও ইনস্ট্যান্ট সার্ভার সার্ভিস।',
        url: 'https://example.com/smm-boost-1',
        badge: 'Ultra Fast',
      },
      {
        id: 'smm-boost-2',
        name: 'SMM Boost Website 2',
        description: 'হাই রিটেনশন ভিউজ, সাবস্ক্রাইবার ও ড্রপ-ফ্রি সোশ্যাল গ্রোথ।',
        url: 'https://example.com/smm-boost-2',
        badge: 'Non-Drop',
      },
      {
        id: 'smm-boost-3',
        name: 'SMM Boost Website 3',
        description: 'অটোমেটেড অর্গানিক বুস্টিং ও ২৪/৭ ডেডিকেটেড সাপোর্ট সিস্টেম।',
        url: 'https://example.com/smm-boost-3',
        badge: 'Auto API',
      },
    ],
    dollarCategory: {
      enabled: true,
      dollarRate: 145,
      rateNote: 'সর্বশেষ লাইভ রেট আপডেট ($1 = ৳145)',
      virtualCard: {
        serviceName: 'International Virtual Visa Card Setup Service',
        currentPrice: 1000,
        previousPrice: 1600,
        description: 'ফেসবুক ও ইনস্টাগ্রাম অ্যাডস বুস্টিং, গুগল অ্যাডস, ক্যানভা প্রো, চ্যাটজিপিটি প্লাস ও যেকোনো আন্তর্জাতিক অনলাইন পেমেন্টের জন্য ইনস্ট্যান্ট অ্যাক্টিভেশন ডুয়েল কারেন্সি ভার্চুয়াল ভিসা কার্ড।',
        whatsapp: '01813078583',
        deliveryTime: '১০-৩০ মিনিট',
      },
    },
  });

  useEffect(() => {
    api
      .getAdminSettings()
      .then((data) => {
        setFormData({
          ...data,
          dollarCategory: data.dollarCategory || {
            enabled: true,
            dollarRate: data.usdConversionRate || 145,
            rateNote: 'সর্বশেষ লাইভ রেট আপডেট',
            virtualCard: {
              serviceName: 'International Virtual Visa Card Setup Service',
              currentPrice: 1000,
              previousPrice: 1600,
              description: 'ফেসবুক ও ইনস্টাগ্রাম অ্যাডস বুস্টিং, গুগল অ্যাডস, ক্যানভা প্রো, চ্যাটজিপিটি প্লাস ও যেকোনো আন্তর্জাতিক অনলাইন পেমেন্টের জন্য ইনস্ট্যান্ট অ্যাক্টিভেশন ডুয়েল কারেন্সি ভার্চুয়াল ভিসা কার্ড।',
              whatsapp: data.whatsapp || '01813078583',
              deliveryTime: '১০-৩০ মিনিট',
            },
          },
          maintenanceMode: data.maintenanceMode || {
            enabled: false,
            message: 'আমরা বর্তমানে কিছু গুরুত্বপূর্ণ আপডেট করছি। খুব শীঘ্রই BOOSTARA আবার সম্পূর্ণভাবে চালু হবে।',
            estimatedReturn: '',
          },
          announcementBar: data.announcementBar || {
            enabled: true,
            text: '🔥 বিশেষ অফার: বিকাশ বা নগদে অর্ডারে ১ ঘণ্টায় সুপার ফাস্ট ডেলিভারি! | যেকোনো সহায়তায় লাইভ হোয়াটসঅ্যাপ সাপোর্ট।',
            linkText: 'অর্ডার ট্র্যাক করুন →',
            linkUrl: '/track-order',
            badge: 'LIMITED OFFER',
          },
          smmBoostWebsites:
            data.smmBoostWebsites && data.smmBoostWebsites.length > 0
              ? data.smmBoostWebsites
              : [
                  {
                    id: 'smm-boost-1',
                    name: 'SMM Boost Website 1',
                    description: 'প্রিমিয়াম হাই-স্পিড ফলোয়ার, লাইক ও ইনস্ট্যান্ট সার্ভার সার্ভিস।',
                    url: 'https://example.com/smm-boost-1',
                    badge: 'Ultra Fast',
                  },
                  {
                    id: 'smm-boost-2',
                    name: 'SMM Boost Website 2',
                    description: 'হাই রিটেনশন ভিউজ, সাবস্ক্রাইবার ও ড্রপ-ফ্রি সোশ্যাল গ্রোথ।',
                    url: 'https://example.com/smm-boost-2',
                    badge: 'Non-Drop',
                  },
                  {
                    id: 'smm-boost-3',
                    name: 'SMM Boost Website 3',
                    description: 'অটোমেটেড অর্গানিক বুস্টিং ও ২৪/৭ ডেডিকেটেড সাপোর্ট সিস্টেম।',
                    url: 'https://example.com/smm-boost-3',
                    badge: 'Auto API',
                  },
                ],
        });
      })
      .catch((err) => {
        setErrorMsg('সেটিংস লোড করতে ব্যর্থ হয়েছে।');
      })
      .finally(() => setLoading(false));

    api
      .getEmailStatus()
      .then(setEmailStatus)
      .catch((err) => console.log('Email status load:', err));
  }, []);

  const handleTestEmail = async () => {
    setTestingEmail(true);
    setTestEmailResult(null);
    try {
      const res = await api.sendTestEmail(formData.adminNotificationEmail);
      setTestEmailResult(res);
      if (res.dispatchedViaSmtp) {
        showToast(`টেস্ট ইমেল সফলভাবে পাঠানো হয়েছে (${formData.adminNotificationEmail})`, 'success');
      } else {
        showToast('টেস্ট নোটিফিকেশন কনসোলে লগ করা হয়েছে। লাইভ ইনবক্সের জন্য SMTP ভ্যারিয়েবল দিন।', 'info');
      }
    } catch (err: any) {
      showToast(`টেস্ট ব্যর্থ: ${err.message}`, 'error');
    } finally {
      setTestingEmail(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setSaving(true);

    try {
      await api.updateAdminSettings(formData);
      await refreshSettings();
      setSuccessMsg('প্ল্যাটফর্ম সেটিংস সফলভাবে আপডেট ও সংরক্ষিত হয়েছে।');
      showToast('প্ল্যাটফর্ম সেটিংস সফলভাবে সংরক্ষিত হয়েছে।', 'success');
    } catch (err: any) {
      const errText = err.message || 'সেটিংস সংরক্ষণ ব্যর্থ হয়েছে।';
      setErrorMsg(errText);
      showToast(errText, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen pb-16">
      <AdminNav />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            প্ল্যাটফর্ম <span className="text-gradient">সিস্টেম সেটিংস</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            পেমেন্ট নাম্বার, হোয়াটসঅ্যাপ হেল্পলাইন, বাজেট কনফিগারেশন এবং ডেলিভারি মেসেজ পরিবর্তন করুন।
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs sm:text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {loading ? (
          <div className="glass-card p-12 rounded-2xl border border-[#132345] text-center">
            <div className="w-7 h-7 rounded-full border-2 border-[#1ac8ff] border-t-transparent animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-400">সেটিংস লোড হচ্ছে...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* General Site info */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-[#132345] space-y-4">
              <h3 className="text-base font-bold text-white border-b border-[#132345] pb-3">
                সাধারণ ব্র্যান্ড ও যোগাযোগ
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">সাইট নেম (Brand Name)</label>
                  <input
                    type="text"
                    value={formData.siteName}
                    onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                    className="w-full boostara-input p-3"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    WhatsApp সাপোর্ট নাম্বার (Float & Helpline)
                  </label>
                  <input
                    type="tel"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full boostara-input p-3 font-mono"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Maintenance Mode Configuration */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-[#132345] space-y-5 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-[#132345] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">মেইনটেন্যান্স মোড (Maintenance Mode)</h3>
                    <p className="text-[11px] text-slate-400">
                      সিস্টেম আপগ্রেড বা জরুরি কাজের সময় সাধারণ ভিজিটরদের জন্য মেইনটেন্যান্স পেজ দেখান।
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full border ${
                      formData.maintenanceMode?.enabled
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                        : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                    }`}
                  >
                    {formData.maintenanceMode?.enabled ? '⚠️ মেইনটেন্যান্স সক্রিয়' : '● নরমাল লাইভ'}
                  </span>
                </div>
              </div>

              {/* Toggle Switch */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#050b1c] border border-[#132345]">
                <div>
                  <label className="text-xs sm:text-sm font-bold text-white block">
                    মেইনটেন্যান্স মোড চালু / বন্ধ
                  </label>
                  <span className="text-[11px] text-slate-400">
                    চালু থাকলে সাধারণ কাস্টমাররা প্রিমিয়াম মেইনটেন্যান্স পেজ দেখবে। আপনি অ্যাডমিন হিসেবে যেকোনো সময় প্রবেশ করতে পারবেন।
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      maintenanceMode: {
                        enabled: !formData.maintenanceMode?.enabled,
                        message:
                          formData.maintenanceMode?.message ||
                          'আমরা বর্তমানে কিছু গুরুত্বপূর্ণ আপডেট করছি। খুব শীঘ্রই BOOSTARA আবার সম্পূর্ণভাবে চালু হবে।',
                        estimatedReturn: formData.maintenanceMode?.estimatedReturn || '',
                      },
                    })
                  }
                  className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                    formData.maintenanceMode?.enabled ? 'bg-amber-500' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
                      formData.maintenanceMode?.enabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Maintenance Message */}
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    কাস্টম মেইনটেন্যান্স মেসেজ (Custom Message)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.maintenanceMode?.message || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maintenanceMode: {
                          enabled: formData.maintenanceMode?.enabled || false,
                          message: e.target.value,
                          estimatedReturn: formData.maintenanceMode?.estimatedReturn || '',
                        },
                      })
                    }
                    placeholder="আমরা বর্তমানে কিছু গুরুত্বপূর্ণ আপডেট করছি। খুব শীঘ্রই BOOSTARA আবার সম্পূর্ণভাবে চালু হবে।"
                    className="w-full boostara-input p-3 text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    আনুমানিক ফিরে আসার সময় (Optional Estimated Return)
                  </label>
                  <input
                    type="text"
                    value={formData.maintenanceMode?.estimatedReturn || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maintenanceMode: {
                          enabled: formData.maintenanceMode?.enabled || false,
                          message: formData.maintenanceMode?.message || '',
                          estimatedReturn: e.target.value,
                        },
                      })
                    }
                    placeholder="যেমন: আজ রাত ১০:০০ টা / ২ ঘণ্টার মধ্যে"
                    className="w-full boostara-input p-3"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    ঐচ্ছিক। যদি খালি রাখা হয় তবে কোনো আনুমানিক সময় পেজে দেখানো হবে না।
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Numbers */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-[#132345] space-y-4">
              <h3 className="text-base font-bold text-white border-b border-[#132345] pb-3">
                পেমেন্ট রিসিভ নাম্বার (Personal Send Money)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-pink-400 mb-1">bKash Personal</label>
                  <input
                    type="tel"
                    value={formData.bkash}
                    onChange={(e) => setFormData({ ...formData, bkash: e.target.value })}
                    className="w-full boostara-input p-3 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-amber-400 mb-1">Nagad Personal</label>
                  <input
                    type="tel"
                    value={formData.nagad}
                    onChange={(e) => setFormData({ ...formData, nagad: e.target.value })}
                    className="w-full boostara-input p-3 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-purple-400 mb-1">Rocket Personal</label>
                  <input
                    type="tel"
                    value={formData.rocket}
                    onChange={(e) => setFormData({ ...formData, rocket: e.target.value })}
                    className="w-full boostara-input p-3 font-mono"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Ads & SMM Pricing Rules */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-[#132345] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#132345] pb-3 gap-2">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>অ্যাড ও বুস্টিং প্রাইসিং এবং প্ল্যাটফর্ম চার্জ</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-normal">
                      লাইভ ওয়েবসাইট সিঙ্ক
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    এখানে যে কোনো রেট পরিবর্তন করলে তা সরাসরি কাস্টমার-ফেসিং Ads Boost পেজ (/ads) ও SMM অর্ডারে স্বয়ংক্রিয়ভাবে আপডেট হয়ে যাবে।
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-3 rounded-2xl bg-[#050b1c] border border-[#132345]">
                  <label className="block font-bold text-slate-300 mb-1">
                    Ads Minimum Budget (BDT)
                  </label>
                  <span className="text-[10px] text-slate-400 block mb-2">কাস্টমারের সর্বনিম্ন অ্যাড বাজেট</span>
                  <div className="relative">
                    <input
                      type="number"
                      min={1}
                      value={formData.adsMinimumBudget}
                      onChange={(e) =>
                        setFormData({ ...formData, adsMinimumBudget: Number(e.target.value) })
                      }
                      className="w-full boostara-input p-2.5 font-mono font-bold pl-7 text-sm"
                      required
                    />
                    <span className="absolute left-2.5 top-2.5 text-slate-500 font-bold">৳</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-[#050b1c] border border-[#132345]">
                  <label className="block font-bold text-slate-300 mb-1">
                    Ads Service Fee (BDT)
                  </label>
                  <span className="text-[10px] text-slate-400 block mb-2">প্রতি অ্যাড সেটআপ ও সার্ভিস ফি</span>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      value={formData.adsServiceFee}
                      onChange={(e) =>
                        setFormData({ ...formData, adsServiceFee: Number(e.target.value) })
                      }
                      className="w-full boostara-input p-2.5 font-mono font-bold pl-7 text-sm text-emerald-400"
                      required
                    />
                    <span className="absolute left-2.5 top-2.5 text-slate-500 font-bold">৳</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-[#050b1c] border border-[#132345]">
                  <label className="block font-bold text-slate-300 mb-1">
                    SMM Service Fee (BDT)
                  </label>
                  <span className="text-[10px] text-slate-400 block mb-2">প্রতি SMM অর্ডারে অতিরিক্ত ফি (যদি থাকে)</span>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      value={formData.smmServiceFee}
                      onChange={(e) =>
                        setFormData({ ...formData, smmServiceFee: Number(e.target.value) })
                      }
                      className="w-full boostara-input p-2.5 font-mono font-bold pl-7 text-sm text-amber-400"
                      required
                    />
                    <span className="absolute left-2.5 top-2.5 text-slate-500 font-bold">৳</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-[#050b1c] border border-[#132345]">
                  <label className="block font-bold text-slate-300 mb-1">
                    USD কনভার্সন রেট (1 USD = BDT)
                  </label>
                  <span className="text-[10px] text-slate-400 block mb-2">অ্যাডের সমতুল্য ডলার প্রদর্শন রেট</span>
                  <div className="relative">
                    <input
                      type="number"
                      min={1}
                      value={formData.usdConversionRate}
                      onChange={(e) =>
                        setFormData({ ...formData, usdConversionRate: Number(e.target.value) })
                      }
                      className="w-full boostara-input p-2.5 font-mono font-bold pl-7 text-sm text-cyan-300"
                      required
                    />
                    <span className="absolute left-2.5 top-2.5 text-slate-500 font-bold">৳</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dollar Category & Virtual Visa Card Settings */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-emerald-500/30 space-y-6 bg-gradient-to-br from-[#091534] via-[#050b1c] to-[#091534] relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#132345] pb-4 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span>ডলার ক্যাটাগরি ও ভার্চুয়াল কার্ড সেটিংস (Dollar Category Settings)</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                        NEW
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      লাইভ ডলার রেট এবং ভার্চুয়াল ভিসা কার্ড সেটআপ সার্ভিস নিয়ন্ত্রণ করুন। এখানে পরিবর্তন করলে /dollar পেজে স্বয়ংক্রিয়ভাবে আপডেট হবে।
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full border ${
                      formData.dollarCategory?.enabled
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {formData.dollarCategory?.enabled ? '● ডলার ক্যাটাগরি সক্রিয়' : '○ ক্যাটাগরি বন্ধ'}
                  </span>
                </div>
              </div>

              {/* Enable / Disable Toggle */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#050b1c] border border-[#132345]">
                <div>
                  <label className="text-xs sm:text-sm font-bold text-white block">
                    Dollar সার্ভিস ক্যাটাগরি চালু / বন্ধ (Enable/Disable Category)
                  </label>
                  <span className="text-[11px] text-slate-400">
                    বন্ধ থাকলে গ্রাহকরা ডলার পেজে রক্ষণাবেক্ষণ বার্তা দেখতে পাবেন এবং নেভিগেশনে সার্ভিসটি সুপ্ত থাকবে।
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      dollarCategory: {
                        ...formData.dollarCategory!,
                        enabled: !formData.dollarCategory?.enabled,
                      },
                    })
                  }
                  className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                    formData.dollarCategory?.enabled ? 'bg-emerald-600' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
                      formData.dollarCategory?.enabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Dollar Exchange Rate Input */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-[#050b1c] border border-emerald-500/30">
                  <label className="block font-bold text-emerald-400 mb-1">
                    বর্তমান ডলার এক্সচেঞ্জ রেট (1 USD = BDT)
                  </label>
                  <span className="text-[10px] text-slate-400 block mb-2">
                    গ্রাহক ডলার পেজে ($1 = ৳___) এই লাইভ রেটটি সরাসরি দেখতে পাবে।
                  </span>
                  <div className="relative">
                    <input
                      type="number"
                      min={1}
                      value={formData.dollarCategory?.dollarRate || 145}
                      onChange={(e) => {
                        const newRate = Number(e.target.value);
                        setFormData({
                          ...formData,
                          usdConversionRate: newRate,
                          dollarCategory: {
                            ...formData.dollarCategory!,
                            dollarRate: newRate,
                          },
                        });
                      }}
                      className="w-full boostara-input p-3 font-mono font-bold pl-8 text-base text-emerald-400"
                      required
                    />
                    <span className="absolute left-3 top-3 text-emerald-500 font-bold">৳</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#050b1c] border border-[#132345]">
                  <label className="block font-bold text-slate-300 mb-1">
                    ডলার রেটের ক্যাপশন / স্ট্যাটাস নোট
                  </label>
                  <span className="text-[10px] text-slate-400 block mb-2">
                    রেটের নিচে গ্রাহকদের কাছে প্রদর্শিত ছোট নোট বা সময়
                  </span>
                  <input
                    type="text"
                    value={formData.dollarCategory?.rateNote || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dollarCategory: {
                          ...formData.dollarCategory!,
                          rateNote: e.target.value,
                        },
                      })
                    }
                    placeholder="যেমন: সর্বশেষ লাইভ রেট আপডেট"
                    className="w-full boostara-input p-3 text-xs"
                  />
                </div>
              </div>

              {/* Virtual Visa Card Setup Service Settings */}
              <div className="p-5 rounded-2xl bg-[#050b1c] border border-[#132345] space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[#132345]">
                  <CreditCard className="w-4 h-4 text-cyan-400" />
                  <h4 className="text-xs sm:text-sm font-bold text-white">
                    ইন্টারন্যাশনাল ভার্চুয়াল ভিসা কার্ড সার্ভিস কনফিগারেশন
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="sm:col-span-3">
                    <label className="block font-semibold text-slate-300 mb-1">
                      সার্ভিস নাম (Service Name)
                    </label>
                    <input
                      type="text"
                      value={formData.dollarCategory?.virtualCard?.serviceName || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dollarCategory: {
                            ...formData.dollarCategory!,
                            virtualCard: {
                              ...formData.dollarCategory!.virtualCard,
                              serviceName: e.target.value,
                            },
                          },
                        })
                      }
                      placeholder="International Virtual Visa Card Setup Service"
                      className="w-full boostara-input p-2.5 text-xs font-semibold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-emerald-400 mb-1">
                      বর্তমান অফার মূল্য (Current Price BDT ৳)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={formData.dollarCategory?.virtualCard?.currentPrice || 1000}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dollarCategory: {
                            ...formData.dollarCategory!,
                            virtualCard: {
                              ...formData.dollarCategory!.virtualCard,
                              currentPrice: Number(e.target.value),
                            },
                          },
                        })
                      }
                      className="w-full boostara-input p-2.5 text-xs font-mono font-bold text-emerald-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-400 mb-1">
                      পূর্বের মূল্য (Previous Price BDT ৳)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={formData.dollarCategory?.virtualCard?.previousPrice || 1600}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dollarCategory: {
                            ...formData.dollarCategory!,
                            virtualCard: {
                              ...formData.dollarCategory!.virtualCard,
                              previousPrice: Number(e.target.value),
                            },
                          },
                        })
                      }
                      className="w-full boostara-input p-2.5 text-xs font-mono line-through text-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-cyan-400 mb-1">
                      কার্ডের জন্য WhatsApp হেল্পলাইন
                    </label>
                    <input
                      type="tel"
                      value={formData.dollarCategory?.virtualCard?.whatsapp || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dollarCategory: {
                            ...formData.dollarCategory!,
                            virtualCard: {
                              ...formData.dollarCategory!.virtualCard,
                              whatsapp: e.target.value,
                            },
                          },
                        })
                      }
                      placeholder="01813078583"
                      className="w-full boostara-input p-2.5 text-xs font-mono"
                      required
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block font-semibold text-slate-300 mb-1">
                      সংক্ষিপ্ত বিবরণ (Service Description)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.dollarCategory?.virtualCard?.description || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dollarCategory: {
                            ...formData.dollarCategory!,
                            virtualCard: {
                              ...formData.dollarCategory!.virtualCard,
                              description: e.target.value,
                            },
                          },
                        })
                      }
                      placeholder="ফেসবুক ও গুগল অ্যাডস বুস্টিং, সাবস্ক্রিপশন ইত্যাদি..."
                      className="w-full boostara-input p-2.5 text-xs"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Messages */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-[#132345] space-y-4">
              <h3 className="text-base font-bold text-white border-b border-[#132345] pb-3">
                ডেলিভারি মেসেজ ও নোটিফিকেশন টেক্সট
              </h3>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    SMM ডেলিভারি মেসেজ
                  </label>
                  <input
                    type="text"
                    value={formData.deliveryMessages.smm}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        deliveryMessages: { ...formData.deliveryMessages, smm: e.target.value },
                      })
                    }
                    className="w-full boostara-input p-3"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Ads Boost ডেলিভারি মেসেজ
                  </label>
                  <input
                    type="text"
                    value={formData.deliveryMessages.ads}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        deliveryMessages: { ...formData.deliveryMessages, ads: e.target.value },
                      })
                    }
                    className="w-full boostara-input p-3"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Website Building ডেলিভারি মেসেজ
                  </label>
                  <input
                    type="text"
                    value={formData.deliveryMessages.website}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        deliveryMessages: { ...formData.deliveryMessages, website: e.target.value },
                      })
                    }
                    className="w-full boostara-input p-3"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Top Announcement Bar Configuration */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-[#132345] space-y-4">
              <div className="flex items-center justify-between border-b border-[#132345] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-gradient-to-tr from-[#8b3dff]/20 to-[#1ac8ff]/20 text-[#1ac8ff] border border-[#1ac8ff]/30">
                    <Megaphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span>টপ নোটিশ / অফার ব্যানার (Top Announcement Bar)</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-normal">
                        লাইভ ব্যানার
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      ওয়েবসাইটের একদম উপরে স্লিম নোটিশ বা স্পেশাল অফার বার দেখান।
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      announcementBar: {
                        enabled: !formData.announcementBar?.enabled,
                        text:
                          formData.announcementBar?.text ||
                          '🔥 বিশেষ অফার: বিকাশ বা নগদে অর্ডারে ১ ঘণ্টায় সুপার ফাস্ট ডেলিভারি! | যেকোনো সহায়তায় লাইভ হোয়াটসঅ্যাপ সাপোর্ট।',
                        linkText: formData.announcementBar?.linkText || 'অর্ডার ট্র্যাক করুন →',
                        linkUrl: formData.announcementBar?.linkUrl || '/track-order',
                        badge: formData.announcementBar?.badge || 'LIMITED OFFER',
                      },
                    })
                  }
                  className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                    formData.announcementBar?.enabled ? 'bg-cyan-500' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
                      formData.announcementBar?.enabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {formData.announcementBar?.enabled && (
                <div className="space-y-4 text-xs pt-2 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">
                        ব্যাজ টেক্সট (Badge)
                      </label>
                      <input
                        type="text"
                        value={formData.announcementBar?.badge || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            announcementBar: {
                              ...formData.announcementBar!,
                              badge: e.target.value,
                            },
                          })
                        }
                        placeholder="LIMITED OFFER"
                        className="w-full boostara-input p-2.5 font-bold uppercase text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">
                        লিংক টেক্সট (Button / Link Text)
                      </label>
                      <input
                        type="text"
                        value={formData.announcementBar?.linkText || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            announcementBar: {
                              ...formData.announcementBar!,
                              linkText: e.target.value,
                            },
                          })
                        }
                        placeholder="অর্ডার ট্র্যাক করুন →"
                        className="w-full boostara-input p-2.5 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">
                        টার্গেট লিঙ্ক (Internal route or URL)
                      </label>
                      <input
                        type="text"
                        value={formData.announcementBar?.linkUrl || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            announcementBar: {
                              ...formData.announcementBar!,
                              linkUrl: e.target.value,
                            },
                          })
                        }
                        placeholder="/track-order অথবা https://..."
                        className="w-full boostara-input p-2.5 text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      ব্যানার মেসেজ (Announcement Text)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.announcementBar?.text || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          announcementBar: {
                            ...formData.announcementBar!,
                            text: e.target.value,
                          },
                        })
                      }
                      placeholder="🔥 বিশেষ অফার: বিকাশ বা নগদে অর্ডারে ১ ঘণ্টায় সুপার ফাস্ট ডেলিভারি!"
                      className="w-full boostara-input p-3 text-xs"
                      required
                    />
                  </div>
                </div>
              )}
            </div>

            {/* SMM Boost Websites Configuration */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-[#132345] space-y-4">
              <div className="flex items-center gap-2.5 border-b border-[#132345] pb-3">
                <div className="p-2 rounded-xl bg-gradient-to-tr from-[#8b3dff]/20 to-[#1ac8ff]/20 text-white border border-[#1ac8ff]/30">
                  <Rocket className="w-5 h-5 text-[#1ac8ff]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>🚀 হোমপেজ SMM বুস্ট ওয়েবসাইট (৩টি পার্টনার বাটন)</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-normal">
                      হোমপেজ সিঙ্ক
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    হোমপেজের "Need More Social Media Boost?" সেকশনের ৩টি ওয়েবসাইটের নাম, বর্ণনা এবং লিঙ্ক এখান থেকে সরাসরি পরিবর্তন করুন।
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 pt-1">
                {(formData.smmBoostWebsites || []).map((site, index) => (
                  <div
                    key={site.id || index}
                    className="p-4 rounded-2xl bg-[#050b1c] border border-[#132345] space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gradient flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-[#1ac8ff]" />
                        <span>ওয়েবসাইট #{index + 1}</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">ID: {site.id}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block font-semibold text-slate-300 mb-1">
                          ওয়েবসাইটের নাম (Website Name)
                        </label>
                        <input
                          type="text"
                          value={site.name}
                          onChange={(e) => {
                            const updated = [...(formData.smmBoostWebsites || [])];
                            updated[index] = { ...updated[index], name: e.target.value };
                            setFormData({ ...formData, smmBoostWebsites: updated });
                          }}
                          className="w-full boostara-input p-2.5 text-xs font-bold"
                          required
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-300 mb-1">
                          ব্যাজ (Badge Tag)
                        </label>
                        <input
                          type="text"
                          value={site.badge || ''}
                          onChange={(e) => {
                            const updated = [...(formData.smmBoostWebsites || [])];
                            updated[index] = { ...updated[index], badge: e.target.value };
                            setFormData({ ...formData, smmBoostWebsites: updated });
                          }}
                          placeholder="Ultra Fast / Non-Drop"
                          className="w-full boostara-input p-2.5 text-xs"
                        />
                      </div>
                    </div>

                    <div className="text-xs">
                      <label className="block font-semibold text-slate-300 mb-1">
                        সংক্ষিপ্ত বিবরণ (One-line description)
                      </label>
                      <input
                        type="text"
                        value={site.description}
                        onChange={(e) => {
                          const updated = [...(formData.smmBoostWebsites || [])];
                          updated[index] = { ...updated[index], description: e.target.value };
                          setFormData({ ...formData, smmBoostWebsites: updated });
                        }}
                        className="w-full boostara-input p-2.5 text-xs"
                        required
                      />
                    </div>

                    <div className="text-xs">
                      <label className="block font-semibold text-slate-300 mb-1">
                        টার্গেট লিঙ্ক (Website URL)
                      </label>
                      <div className="relative">
                        <input
                          type="url"
                          value={site.url}
                          onChange={(e) => {
                            const updated = [...(formData.smmBoostWebsites || [])];
                            updated[index] = { ...updated[index], url: e.target.value };
                            setFormData({ ...formData, smmBoostWebsites: updated });
                          }}
                          placeholder="https://your-smm-partner.com"
                          className="w-full boostara-input p-2.5 pl-8 text-xs font-mono text-[#1ac8ff]"
                          required
                        />
                        <ExternalLink className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-3" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notification Email & Pipeline Diagnostics */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-cyan-500/30 space-y-5 bg-gradient-to-br from-[#091534] via-[#050b1c] to-[#091534] relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#132345] pb-4 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span>অ্যাডমিন ইমেল নোটিফিকেশন সিস্টেম (Order Email Alert Pipeline)</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold">
                        AUTOMATED
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      নতুন অর্ডার, পেমেন্ট সাবমিশন ও স্ট্যাটাস পরিবর্তনে এই ইমেলে ইনস্ট্যান্ট নোটিফিকেশন পৌঁছাবে।
                    </p>
                  </div>
                </div>

                {emailStatus && (
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full border flex items-center gap-1.5 ${
                        emailStatus.isConfigured
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${emailStatus.isConfigured ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                      <span>{emailStatus.isConfigured ? 'লাইভ SMTP সক্রিয়' : 'কনসোল লগ সক্রিয় (SMTP পেন্ডিং)'}</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Notification Email Input */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">
                  অর্ডার নোটিফিকেশন প্রাপক অ্যাডমিন ইমেল (Admin Notification Email)
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={formData.adminNotificationEmail || 'mdmohammad.644633815@gmail.com'}
                    onChange={(e) =>
                      setFormData({ ...formData, adminNotificationEmail: e.target.value })
                    }
                    className="w-full boostara-input p-3 font-mono text-sm text-cyan-300"
                    placeholder="mdmohammad.644633815@gmail.com"
                    required
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  কাস্টমার অর্ডার সাবমিট করলে Order ID, সার্ভিস নাম, পরিমাণ, লিংক ও মোট টাকাসহ যাবতীয় তথ্য স্বয়ংক্রিয়ভাবে এই ইমেলে যাবে।
                </p>
              </div>

              {/* SMTP Pipeline Diagnostics Card */}
              <div className="p-4 rounded-2xl bg-[#050b1c] border border-[#132345] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <Info className="w-4 h-4 text-cyan-400" />
                    <span>ইমেল ডিসপ্যাচ কনফিগারেশন স্ট্যাটাস</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleTestEmail}
                    disabled={testingEmail}
                    className="px-4 py-1.5 rounded-xl text-xs font-bold bg-[#132345] hover:bg-cyan-600 text-cyan-200 hover:text-white border border-cyan-500/40 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {testingEmail ? (
                      <>
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        <span>পাঠানো হচ্ছে...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>টেস্ট নোটিফিকেশন পাঠান</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 rounded-xl bg-[#091534] border border-[#132345]">
                    <span className="text-slate-400 block">প্রাপক ইমেল:</span>
                    <span className="font-mono font-bold text-white">{formData.adminNotificationEmail || 'mdmohammad.644633815@gmail.com'}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#091534] border border-[#132345]">
                    <span className="text-slate-400 block">SMTP Host:</span>
                    <span className="font-mono font-bold text-cyan-400">{emailStatus?.smtpHost || 'Not Set (.env)'}</span>
                  </div>
                </div>

                {emailStatus && emailStatus.missingVariables && emailStatus.missingVariables.length > 0 && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>সরাসরি জিমেইল/ইনবক্সে ইমেল পাঠানোর জন্য প্রয়োজনীয় কনফিগারেশন:</span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      বর্তমানে নোটিফিকেশন সুরক্ষিতভাবে সার্ভার লগ কনসোলে জমা হচ্ছে। সরাসরি ইনবক্সে পাঠানোর জন্য নিচের এনভায়রনমেন্ট ভ্যারিয়েবলগুলো প্রয়োজন:
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {emailStatus.missingVariables.map((v: string) => (
                        <span key={v} className="px-2 py-0.5 rounded bg-[#050b1c] border border-amber-500/40 font-mono text-[10px] text-amber-200">
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {testEmailResult && (
                  <div className={`p-3 rounded-xl border text-xs ${testEmailResult.success ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border-rose-500/30 text-rose-300'}`}>
                    <p className="font-bold">{testEmailResult.message}</p>
                    {testEmailResult.messageId && (
                      <p className="font-mono text-[10px] text-slate-400 mt-1">Message ID: {testEmailResult.messageId}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-4 text-sm font-bold btn-primary flex items-center justify-center gap-2 cursor-pointer shadow-xl hover:shadow-cyan-500/25"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>সংরক্ষণ হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>সেটিংস সেভ করুন (Save Settings)</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
