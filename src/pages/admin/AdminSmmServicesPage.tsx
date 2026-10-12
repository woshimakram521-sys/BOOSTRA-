import React, { useState, useEffect } from 'react';
import {
  Share2,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronDown,
  Layers,
  Save,
} from 'lucide-react';
import { AdminNav } from '../../components/AdminNav';
import { api } from '../../services/api';
import { SMMService, SMMServiceTier, PlatformType, SMMServiceType } from '../../types';
import { useApp } from '../../context/AppContext';

export const AdminSmmServicesPage: React.FC = () => {
  const { showToast } = useApp();
  const [services, setServices] = useState<SMMService[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [savingService, setSavingService] = useState(false);
  const [savingTier, setSavingTier] = useState(false);
  const [updatingBadgeId, setUpdatingBadgeId] = useState<string | null>(null);

  // Service Modal state
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<SMMService | null>(null);
  const [servicePlatform, setServicePlatform] = useState<PlatformType>('Facebook');
  const [serviceType, setServiceType] = useState<SMMServiceType>('Likes');
  const [minQty, setMinQty] = useState(100);
  const [maxQty, setMaxQty] = useState(100000);
  const [minPrice, setMinPrice] = useState(20);
  const [serviceActive, setServiceActive] = useState(true);
  const [serviceBadge, setServiceBadge] = useState<'Featured' | 'Popular' | 'Normal'>('Normal');

  // Tier Modal state
  const [isTierModalOpen, setIsTierModalOpen] = useState(false);
  const [tierServiceId, setTierServiceId] = useState<string>('');
  const [editingTier, setEditingTier] = useState<SMMServiceTier | null>(null);
  const [tierName, setTierName] = useState('');
  const [ratePer1000, setRatePer1000] = useState(100);
  const [guaranteePeriod, setGuaranteePeriod] = useState('৩০ দিন রিফিল গ্যারান্টি');
  const [tierActive, setTierActive] = useState(true);

  // Deletion modal state (in-UI confirmation, no window.confirm)
  const [serviceToDelete, setServiceToDelete] = useState<SMMService | null>(null);
  const [tierToDelete, setTierToDelete] = useState<{ serviceId: string; tierId: string; tierName: string } | null>(null);
  const [deletingItem, setDeletingItem] = useState(false);

  const loadServices = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminSMMServices();
      setServices(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'সার্ভিস লোড করতে ব্যর্থ হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const openAddServiceModal = () => {
    setEditingService(null);
    setServicePlatform('Facebook');
    setServiceType('Likes');
    setMinQty(100);
    setMaxQty(100000);
    setMinPrice(20);
    setServiceActive(true);
    setServiceBadge('Normal');
    setIsServiceModalOpen(true);
  };

  const openEditServiceModal = (s: SMMService) => {
    setEditingService(s);
    setServicePlatform(s.platform);
    setServiceType(s.serviceType);
    setMinQty(s.minQuantity);
    setMaxQty(s.maxQuantity);
    setMinPrice(s.minOrderPrice);
    setServiceActive(s.active);
    setServiceBadge(s.badge || 'Normal');
    setIsServiceModalOpen(true);
  };

  const handleCycleBadge = async (service: SMMService) => {
    const current = service.badge || 'Normal';
    const nextBadge: 'Normal' | 'Featured' | 'Popular' =
      current === 'Normal' ? 'Popular' : current === 'Popular' ? 'Featured' : 'Normal';

    setUpdatingBadgeId(service.id);
    try {
      await api.updateSMMServiceBadge(service.id, nextBadge);
      setServices((prev) =>
        prev.map((s) => (s.id === service.id ? { ...s, badge: nextBadge } : s))
      );
      showToast(`সার্ভিস ব্যাজ "${nextBadge}" নির্ধারণ করা হয়েছে।`, 'success');
    } catch (err: any) {
      showToast(err.message || 'ব্যাজ পরিবর্তন ব্যর্থ হয়েছে', 'error');
    } finally {
      setUpdatingBadgeId(null);
    }
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setSavingService(true);

    try {
      if (editingService) {
        await api.updateSMMService(editingService.id, {
          platform: servicePlatform,
          serviceType: serviceType,
          minQuantity: Number(minQty),
          maxQuantity: Number(maxQty),
          minOrderPrice: Number(minPrice),
          active: serviceActive,
          badge: serviceBadge,
        });
        setSuccessMsg('সার্ভিস সফলভাবে আপডেট হয়েছে।');
        showToast('সার্ভিস সফলভাবে আপডেট হয়েছে।', 'success');
      } else {
        await api.addSMMService({
          platform: servicePlatform,
          serviceType: serviceType,
          minQuantity: Number(minQty),
          maxQuantity: Number(maxQty),
          minOrderPrice: Number(minPrice),
          active: serviceActive,
          badge: serviceBadge,
          tiers: [],
        });
        setSuccessMsg('নতুন সার্ভিস সফলভাবে যুক্ত হয়েছে।');
        showToast('নতুন সার্ভিস সফলভাবে যুক্ত হয়েছে।', 'success');
      }
      setIsServiceModalOpen(false);
      loadServices();
    } catch (err: any) {
      const errTxt = err.message || 'সার্ভিস সংরক্ষণ ব্যর্থ হয়েছে।';
      setErrorMsg(errTxt);
      showToast(errTxt, 'error');
    } finally {
      setSavingService(false);
    }
  };

  const handleConfirmDeleteService = async () => {
    if (!serviceToDelete) return;
    setDeletingItem(true);
    try {
      await api.deleteSMMService(serviceToDelete.id);
      loadServices();
      setSuccessMsg('সার্ভিস সফলভাবে মোছা হয়েছে।');
      showToast('সার্ভিস সফলভাবে মোছা হয়েছে।', 'success');
      setServiceToDelete(null);
    } catch (err: any) {
      setErrorMsg(err.message || 'সার্ভিস মুছতে সমস্যা হয়েছে।');
      showToast(err.message || 'সার্ভিস মুছতে সমস্যা হয়েছে।', 'error');
    } finally {
      setDeletingItem(false);
    }
  };

  const handleConfirmDeleteTier = async () => {
    if (!tierToDelete) return;
    setDeletingItem(true);
    try {
      await api.deleteTier(tierToDelete.serviceId, tierToDelete.tierId);
      loadServices();
      setSuccessMsg('টিয়ার সফলভাবে মোছা হয়েছে।');
      showToast('টিয়ার সফলভাবে মোছা হয়েছে।', 'success');
      setTierToDelete(null);
    } catch (err: any) {
      setErrorMsg(err.message || 'টিয়ার মুছতে সমস্যা হয়েছে।');
      showToast(err.message || 'টিয়ার মুছতে সমস্যা হয়েছে।', 'error');
    } finally {
      setDeletingItem(false);
    }
  };

  const openAddTierModal = (serviceId: string) => {
    setTierServiceId(serviceId);
    setEditingTier(null);
    setTierName('Non-Drop');
    setRatePer1000(150);
    setGuaranteePeriod('লাইফটাইম গ্যারান্টি');
    setTierActive(true);
    setIsTierModalOpen(true);
  };

  const openEditTierModal = (serviceId: string, t: SMMServiceTier) => {
    setTierServiceId(serviceId);
    setEditingTier(t);
    setTierName(t.tierName);
    setRatePer1000(t.ratePer1000);
    setGuaranteePeriod(t.guaranteePeriod);
    setTierActive(t.active);
    setIsTierModalOpen(true);
  };

  const handleSaveTier = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setSavingTier(true);

    try {
      if (editingTier) {
        await api.updateTier(tierServiceId, editingTier.id, {
          tierName,
          ratePer1000: Number(ratePer1000),
          guaranteePeriod,
          active: tierActive,
        });
        setSuccessMsg('টিয়ার আপডেট হয়েছে।');
        showToast('টিয়ার সফলভাবে আপডেট হয়েছে।', 'success');
      } else {
        await api.addTier(tierServiceId, {
          tierName,
          ratePer1000: Number(ratePer1000),
          guaranteePeriod,
          active: tierActive,
        });
        setSuccessMsg('নতুন টিয়ার যুক্ত হয়েছে।');
        showToast('নতুন টিয়ার সফলভাবে যুক্ত হয়েছে।', 'success');
      }
      setIsTierModalOpen(false);
      loadServices();
    } catch (err: any) {
      const errTxt = err.message || 'টিয়ার সংরক্ষণে সমস্যা হয়েছে।';
      setErrorMsg(errTxt);
      showToast(errTxt, 'error');
    } finally {
      setSavingTier(false);
    }
  };

  return (
    <div className="min-h-screen pb-16">
      <AdminNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header & Add Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              SMM সার্ভিস ও <span className="text-gradient">প্রাইসিং ম্যানেজমেন্ট</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              যেকোনো প্ল্যাটফর্মের সার্ভিস এবং আনলিমিটেড টিয়ার (যেমন: Drop, Non-Drop, Super Cheap) যোগ ও সম্পাদনা করুন।
            </p>
          </div>

          <button
            onClick={openAddServiceModal}
            className="py-2.5 px-4 rounded-xl btn-primary text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg hover:shadow-cyan-500/25"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন সার্ভিস যুক্ত করুন</span>
          </button>
        </div>

        {/* Alerts */}
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

        {/* Services List with Tiers */}
        {loading ? (
          <div className="glass-card p-12 rounded-2xl border border-[#132345] text-center">
            <div className="w-7 h-7 rounded-full border-2 border-[#1ac8ff] border-t-transparent animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-400">সার্ভিস ডাটা লোড হচ্ছে...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {services.map((s) => (
              <div
                key={s.id}
                className="glass-card p-6 rounded-2xl border border-[#132345] shadow-xl space-y-4"
              >
                {/* Service Header Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#132345] pb-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-[#091534] border border-[#1ac8ff]/40 text-[#1ac8ff]">
                      {s.platform}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      {s.serviceType}
                    </h3>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        s.active
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {s.active ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                    </span>

                    {/* Badge Quick Switcher */}
                    <button
                      type="button"
                      onClick={() => handleCycleBadge(s)}
                      disabled={updatingBadgeId === s.id}
                      className={`text-[11px] px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                        s.badge === 'Featured'
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 hover:bg-purple-500/30 shadow-[0_0_10px_rgba(139,61,255,0.25)]'
                          : s.badge === 'Popular'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.25)]'
                          : 'bg-[#050b1c] text-slate-400 border-[#132345] hover:border-slate-500 hover:text-slate-200'
                      }`}
                      title="ক্লিক করে ব্যাজ পরিবর্তন করুন (Normal -> Popular -> Featured -> Normal)"
                    >
                      {updatingBadgeId === s.id ? (
                        <div className="w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin" />
                      ) : (
                        <>
                          {s.badge === 'Featured' && <span>⭐ Featured</span>}
                          {s.badge === 'Popular' && <span>🔥 Popular</span>}
                          {(!s.badge || s.badge === 'Normal') && <span>স্বাভাবিক ব্যাজ (Normal)</span>}
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openAddTierModal(s.id)}
                      className="py-1.5 px-3 rounded-lg bg-[#091534] border border-purple-500/40 hover:bg-purple-950/40 text-purple-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>টিয়ার যোগ করুন</span>
                    </button>
                    <button
                      onClick={() => openEditServiceModal(s)}
                      className="p-1.5 rounded-lg bg-[#091534] border border-[#132345] text-slate-300 hover:text-white cursor-pointer"
                      title="Edit Service"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setServiceToDelete(s)}
                      className="p-1.5 rounded-lg bg-rose-950/30 border border-rose-500/40 text-rose-400 hover:bg-rose-900/40 cursor-pointer"
                      title="Delete Service"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Service Specs info */}
                <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                  <span>
                    সর্বনিম্ন পরিমাণ: <strong className="text-white">{s.minQuantity}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    সর্বোচ্চ পরিমাণ: <strong className="text-white">{s.maxQuantity}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    সর্বনিম্ন মূল্য: <strong className="text-white">৳{s.minOrderPrice}</strong>
                  </span>
                </div>

                {/* Nested Tiers List */}
                <div className="pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#1ac8ff]" />
                    <span>উপলব্ধ প্যাকেজ ও টিয়ারসমূহ ({s.tiers.length} টিয়ার)</span>
                  </h4>

                  {s.tiers.length === 0 ? (
                    <div className="p-4 rounded-xl bg-[#050b1c] text-xs text-slate-500 italic text-center">
                      এই সার্ভিসের জন্য এখনও কোনো টিয়ার তৈরি করা হয়নি। 'টিয়ার যোগ করুন' বাটনে ক্লিক করুন।
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {s.tiers.map((t) => (
                        <div
                          key={t.id}
                          className={`p-3.5 rounded-xl border flex items-center justify-between ${
                            t.active
                              ? 'bg-[#050b1c] border-[#132345]'
                              : 'bg-rose-950/10 border-rose-500/20 opacity-70'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white">{t.tierName}</span>
                              {!t.active && (
                                <span className="text-[9px] text-rose-400 bg-rose-950 px-1.5 py-0.5 rounded">
                                  অফ
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-[#1ac8ff] font-mono font-bold block mt-0.5">
                              ৳{t.ratePer1000} / ১০০০
                            </span>
                            <span className="text-[10px] text-slate-400 block">
                              {t.guaranteePeriod}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => openEditTierModal(s.id, t)}
                              className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
                              title="Edit Tier"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setTierToDelete({ serviceId: s.id, tierId: t.id, tierName: t.tierName })}
                              className="p-1 rounded text-rose-400 hover:text-rose-300 cursor-pointer"
                              title="Delete Tier"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Service Modal */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md p-6 rounded-3xl bg-[#050b1c] border border-[#132345] shadow-2xl text-left space-y-4">
            <h3 className="text-lg font-bold text-white border-b border-[#132345] pb-3">
              {editingService ? 'সার্ভিস এডিট করুন' : 'নতুন SMM সার্ভিস যোগ করুন'}
            </h3>

            <form onSubmit={handleSaveService} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">প্ল্যাটফর্ম *</label>
                <select
                  value={servicePlatform}
                  onChange={(e) => setServicePlatform(e.target.value as PlatformType)}
                  className="w-full boostara-input p-2.5 cursor-pointer"
                >
                  <option value="Facebook">Facebook</option>
                  <option value="Instagram">Instagram</option>
                  <option value="TikTok">TikTok</option>
                  <option value="YouTube">YouTube</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">সার্ভিস টাইপ *</label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value as SMMServiceType)}
                  className="w-full boostara-input p-2.5 cursor-pointer"
                >
                  <option value="Likes">Likes</option>
                  <option value="Comments">Comments</option>
                  <option value="Reactions">Reactions</option>
                  <option value="Followers">Followers</option>
                  <option value="Subscribers">Subscribers</option>
                  <option value="Views">Views</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">সর্বনিম্ন পরিমাণ</label>
                  <input
                    type="number"
                    value={minQty}
                    onChange={(e) => setMinQty(Number(e.target.value))}
                    className="w-full boostara-input p-2.5 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">সর্বোচ্চ পরিমাণ</label>
                  <input
                    type="number"
                    value={maxQty}
                    onChange={(e) => setMaxQty(Number(e.target.value))}
                    className="w-full boostara-input p-2.5 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  সার্ভিস ব্যাজ (Featured / Popular Badge)
                </label>
                <select
                  value={serviceBadge}
                  onChange={(e) => setServiceBadge(e.target.value as any)}
                  className="w-full boostara-input p-2.5 cursor-pointer font-medium"
                >
                  <option value="Normal">স্বাভাবিক (কোনো ব্যাজ নেই - Normal)</option>
                  <option value="Popular">🔥 Popular (জনপ্রিয়)</option>
                  <option value="Featured">⭐ Featured (ফিচার্ড)</option>
                </select>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  মূল্যের ওপর কোনো প্রভাব ফেলবে না। কাস্টমার কার্ডে ব্যাজ হিসেবে দেখানো হবে।
                </span>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="srvActive"
                  checked={serviceActive}
                  onChange={(e) => setServiceActive(e.target.checked)}
                  className="rounded accent-[#1ac8ff] cursor-pointer"
                />
                <label htmlFor="srvActive" className="text-slate-300 cursor-pointer">
                  সার্ভিসটি সক্রিয় (Active) রাখুন
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#132345]">
                <button
                  type="button"
                  disabled={savingService}
                  onClick={() => setIsServiceModalOpen(false)}
                  className="btn-secondary px-4 py-2 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={savingService}
                  className="btn-primary px-5 py-2 cursor-pointer flex items-center gap-2"
                >
                  {savingService ? (
                    <>
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      <span>সংরক্ষণ হচ্ছে...</span>
                    </>
                  ) : (
                    <span>সংরক্ষণ করুন</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tier Modal */}
      {isTierModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md p-6 rounded-3xl bg-[#050b1c] border border-purple-500/40 shadow-2xl text-left space-y-4">
            <h3 className="text-lg font-bold text-white border-b border-[#132345] pb-3">
              {editingTier ? 'টিয়ার এডিট করুন' : 'নতুন টিয়ার যোগ করুন'}
            </h3>

            <form onSubmit={handleSaveTier} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  টিয়ার নাম (যেমন: Drop, Non-Drop, Super Cheap) *
                </label>
                <input
                  type="text"
                  value={tierName}
                  onChange={(e) => setTierName(e.target.value)}
                  placeholder="Non-Drop"
                  className="w-full boostara-input p-2.5"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  প্রতি ১,০০০ রেট (Rate per 1000 BDT) *
                </label>
                <input
                  type="number"
                  value={ratePer1000}
                  onChange={(e) => setRatePer1000(Number(e.target.value))}
                  className="w-full boostara-input p-2.5 font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  গ্যারান্টি সময়কাল (Guarantee Period) *
                </label>
                <input
                  type="text"
                  value={guaranteePeriod}
                  onChange={(e) => setGuaranteePeriod(e.target.value)}
                  placeholder="লাইফটাইম গ্যারান্টি অথবা গ্যারান্টি নেই"
                  className="w-full boostara-input p-2.5"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="tierActive"
                  checked={tierActive}
                  onChange={(e) => setTierActive(e.target.checked)}
                  className="rounded accent-[#1ac8ff] cursor-pointer"
                />
                <label htmlFor="tierActive" className="text-slate-300 cursor-pointer">
                  টিয়ারটি সক্রিয় (Active) রাখুন
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#132345]">
                <button
                  type="button"
                  disabled={savingTier}
                  onClick={() => setIsTierModalOpen(false)}
                  className="btn-secondary px-4 py-2 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={savingTier}
                  className="btn-primary px-5 py-2 cursor-pointer flex items-center gap-2"
                >
                  {savingTier ? (
                    <>
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      <span>সংরক্ষণ হচ্ছে...</span>
                    </>
                  ) : (
                    <span>সংরক্ষণ করুন</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Service Confirmation Modal */}
      {serviceToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#050b1c] border border-rose-500/40 rounded-3xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white">সার্ভিসটি মুছে ফেলতে চান?</h3>
              <p className="text-xs text-slate-300 mt-1">
                আপনি কি নিশ্চিত যে <span className="text-rose-400 font-bold">{serviceToDelete.platform} - {serviceToDelete.serviceType}</span> সার্ভিস এবং এর সকল টিয়ার মুছে ফেলতে চান?
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setServiceToDelete(null)}
                disabled={deletingItem}
                className="py-2.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
              >
                বাতিল করুন
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteService}
                disabled={deletingItem}
                className="py-2.5 px-5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg shadow-rose-600/30 disabled:opacity-50"
              >
                {deletingItem ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>মুছে ফেলা হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>হ্যাঁ, নিশ্চিত মুছুন</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Tier Confirmation Modal */}
      {tierToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#050b1c] border border-rose-500/40 rounded-3xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white">টিয়ারটি মুছে ফেলতে চান?</h3>
              <p className="text-xs text-slate-300 mt-1">
                আপনি কি নিশ্চিত যে <span className="text-rose-400 font-bold">"{tierToDelete.tierName}"</span> টিয়ারটি মুছে ফেলতে চান?
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setTierToDelete(null)}
                disabled={deletingItem}
                className="py-2.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
              >
                বাতিল করুন
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteTier}
                disabled={deletingItem}
                className="py-2.5 px-5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg shadow-rose-600/30 disabled:opacity-50"
              >
                {deletingItem ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>মুছে ফেলা হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>হ্যাঁ, নিশ্চিত মুছুন</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
