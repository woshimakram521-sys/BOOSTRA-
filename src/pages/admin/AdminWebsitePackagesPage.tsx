import React, { useState, useEffect } from 'react';
import {
  Globe,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  DollarSign,
  Layers,
  Save,
  X,
  ListPlus,
  Check,
} from 'lucide-react';
import { AdminNav } from '../../components/AdminNav';
import { api } from '../../services/api';
import { WebsitePackage } from '../../types';
import { useApp } from '../../context/AppContext';

export const AdminWebsitePackagesPage: React.FC = () => {
  const { showToast } = useApp();
  const [packages, setPackages] = useState<WebsitePackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<WebsitePackage | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [totalPrice, setTotalPrice] = useState<number>(500);
  const [advanceAmount, setAdvanceAmount] = useState<number>(250);
  const [remainingAmount, setRemainingAmount] = useState<number>(250);
  const [description, setDescription] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('১ থেকে ১০ ঘণ্টা');
  const [sortOrder, setSortOrder] = useState<number>(1);
  const [active, setActive] = useState(true);
  const [packageType, setPackageType] = useState<'custom_build' | 'course' | 'general'>('custom_build');
  const [features, setFeatures] = useState<string[]>(['রেসপনসিভ ও আধুনিক ডিজাইন', 'ডেলিভারি পর যেকোনো কারেকশন সুবিধা']);
  const [newFeatureText, setNewFeatureText] = useState('');

  // Delete Confirmation Modal State
  const [deletingPackage, setDeletingPackage] = useState<WebsitePackage | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadPackages = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminWebsitePackages();
      setPackages(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'প্যাকেজ লোড করতে সমস্যা হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPackages();
  }, []);

  const openAddModal = () => {
    setEditingPackage(null);
    setName('');
    setTotalPrice(500);
    setAdvanceAmount(250);
    setRemainingAmount(250);
    setDescription('আপনার জন্য professional website তৈরি করে দেব।');
    setDeliveryTime('১ থেকে ১০ ঘণ্টা');
    setSortOrder((packages.length || 0) + 1);
    setActive(true);
    setPackageType('custom_build');
    setFeatures(['রেসপনসিভ ও আধুনিক ডিজাইন', 'ডেলিভারি পর যেকোনো কারেকশন সুবিধা']);
    setNewFeatureText('');
    setIsModalOpen(true);
  };

  const openEditModal = (pkg: WebsitePackage) => {
    setEditingPackage(pkg);
    setName(pkg.name);
    setTotalPrice(pkg.totalPrice);
    setAdvanceAmount(pkg.advanceAmount);
    setRemainingAmount(pkg.remainingAmount);
    setDescription(pkg.description || '');
    setDeliveryTime(pkg.deliveryTime || '১ থেকে ১০ ঘণ্টা');
    setSortOrder(pkg.sortOrder || 1);
    setActive(pkg.active);
    setPackageType(pkg.packageType || 'custom_build');
    setFeatures(Array.isArray(pkg.features) ? [...pkg.features] : []);
    setNewFeatureText('');
    setIsModalOpen(true);
  };

  // Auto-calculate remaining amount when total or advance changes
  const handleTotalPriceChange = (val: number) => {
    setTotalPrice(val);
    setRemainingAmount(Math.max(0, val - advanceAmount));
  };

  const handleAdvanceAmountChange = (val: number) => {
    setAdvanceAmount(val);
    setRemainingAmount(Math.max(0, totalPrice - val));
  };

  const handleAddFeature = () => {
    if (newFeatureText.trim()) {
      setFeatures([...features, newFeatureText.trim()]);
      setNewFeatureText('');
    }
  };

  const handleRemoveFeature = (idx: number) => {
    setFeatures(features.filter((_, i) => i !== idx));
  };

  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name.trim()) {
      setErrorMsg('প্যাকেজের নাম লিখুন।');
      return;
    }

    if (totalPrice < 0 || advanceAmount < 0) {
      setErrorMsg('মূল্য বা অগ্রিম ফি ঋণাত্মক হতে পারবে না।');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: name.trim(),
        totalPrice: Number(totalPrice),
        advanceAmount: Number(advanceAmount),
        remainingAmount: Number(remainingAmount),
        description: description.trim(),
        deliveryTime: deliveryTime.trim(),
        sortOrder: Number(sortOrder) || 1,
        active,
        packageType,
        features,
      };

      if (editingPackage) {
        await api.updateWebsitePackage(editingPackage.id, payload);
        showToast('প্যাকেজ সফলভাবে আপডেট হয়েছে।', 'success');
        setSuccessMsg('প্যাকেজ সফলভাবে আপডেট হয়েছে।');
      } else {
        await api.addWebsitePackage(payload);
        showToast('নতুন প্যাকেজ সফলভাবে যুক্ত হয়েছে।', 'success');
        setSuccessMsg('নতুন প্যাকেজ সফলভাবে যুক্ত হয়েছে।');
      }

      setIsModalOpen(false);
      loadPackages();
    } catch (err: any) {
      const errTxt = err.message || 'প্যাকেজ সংরক্ষণ ব্যর্থ হয়েছে।';
      setErrorMsg(errTxt);
      showToast(errTxt, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (pkg: WebsitePackage) => {
    setTogglingId(pkg.id);
    try {
      const updated = await api.toggleWebsitePackage(pkg.id);
      setPackages((prev) =>
        prev.map((p) => (p.id === pkg.id ? { ...p, active: updated.active } : p))
      );
      showToast(
        `প্যাকেজ "${pkg.name}" ${updated.active ? 'সক্রিয় (Active)' : 'নিষ্ক্রিয় (Inactive)'} করা হয়েছে।`,
        'success'
      );
    } catch (err: any) {
      showToast(err.message || 'স্ট্যাটাস পরিবর্তন ব্যর্থ হয়েছে', 'error');
    } finally {
      setTogglingId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingPackage) return;
    setDeleting(true);
    try {
      await api.deleteWebsitePackage(deletingPackage.id);
      showToast(`প্যাকেজ "${deletingPackage.name}" মুছে ফেলা হয়েছে।`, 'success');
      setDeletingPackage(null);
      loadPackages();
    } catch (err: any) {
      showToast(err.message || 'প্যাকেজ মুছতে সমস্যা হয়েছে।', 'error');
    } finally {
      setDeleting(false);
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
              ওয়েবসাইট প্যাকেজ ও <span className="text-gradient">প্রাইসিং ম্যানেজমেন্ট</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              কাস্টমার পেজে প্রদর্শিত সকল ওয়েবসাইট প্যাকেজ, মোট মূল্য, অগ্রিম পেমেন্ট ও ডেলিভারি সময় কোড পরিবর্তন ছাড়া সরাসরি নিয়ন্ত্রণ করুন।
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="py-2.5 px-4 rounded-xl btn-primary text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg hover:shadow-cyan-500/25 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন প্যাকেজ যোগ করুন</span>
          </button>
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

        {/* Packages Cards Grid */}
        {loading ? (
          <div className="glass-card p-12 rounded-2xl border border-[#132345] text-center">
            <div className="w-7 h-7 rounded-full border-2 border-[#1ac8ff] border-t-transparent animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-400">প্যাকেজ লোড হচ্ছে...</p>
          </div>
        ) : packages.length === 0 ? (
          <div className="glass-card p-12 rounded-2xl border border-[#132345] text-center">
            <Globe className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-300">কোনো ওয়েবসাইট প্যাকেজ পাওয়া যায়নি।</p>
            <p className="text-xs text-slate-400 mt-1">
              উপরের "নতুন প্যাকেজ যোগ করুন" বাটনে ক্লিক করে প্যাকেজ তৈরি করুন।
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => {
              const isToggling = togglingId === pkg.id;
              return (
                <div
                  key={pkg.id}
                  className={`glass-card p-6 rounded-2xl border transition-all flex flex-col justify-between ${
                    pkg.active
                      ? 'border-[#132345] hover:border-cyan-500/40'
                      : 'border-slate-800 opacity-60 bg-[#030712]'
                  }`}
                >
                  <div>
                    {/* Top row: Sort badge & active toggle */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#091534] border border-[#132345] text-slate-400">
                          পজিশন #{pkg.sortOrder || 1}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            pkg.active
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          }`}
                        >
                          {pkg.active ? '● সক্রিয় (Active)' : '○ নিষ্ক্রিয় (Inactive)'}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleActive(pkg)}
                        disabled={isToggling}
                        className={`text-xs px-2.5 py-1 rounded-lg border font-semibold transition-all cursor-pointer ${
                          pkg.active
                            ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                        }`}
                        title={pkg.active ? 'নিষ্ক্রিয় করুন' : 'সক্রিয় করুন'}
                      >
                        {isToggling ? (
                          <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : pkg.active ? (
                          'বন্ধ করুন'
                        ) : (
                          'চালু করুন'
                        )}
                      </button>
                    </div>

                    {/* Title & Type */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-black text-white">{pkg.name}</h3>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded">
                          {pkg.packageType === 'course' ? 'ভিডিও কোর্স' : 'কাস্টম বিল্ড'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{pkg.description}</p>
                    </div>

                    {/* Pricing Breakdown Card */}
                    <div className="p-4 rounded-xl bg-[#050b1c] border border-[#132345] mb-4 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">মোট মূল্য (Total Price):</span>
                        <span className="text-sm font-black text-gradient font-mono">৳{pkg.totalPrice}</span>
                      </div>
                      <div className="flex items-center justify-between border-t border-[#132345] pt-2">
                        <span className="text-slate-400">অগ্রিম পেমেন্ট (Advance):</span>
                        <span className="font-bold text-emerald-400 font-mono">৳{pkg.advanceAmount}</span>
                      </div>
                      <div className="flex items-center justify-between border-t border-[#132345] pt-2">
                        <span className="text-slate-400">বাকি পরিমাণ (Remaining):</span>
                        <span className="font-bold text-amber-400 font-mono">৳{pkg.remainingAmount}</span>
                      </div>
                      <div className="flex items-center justify-between border-t border-[#132345] pt-2">
                        <span className="text-slate-400">ডেলিভারি সময়:</span>
                        <span className="text-cyan-300 font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{pkg.deliveryTime || '১ থেকে ১০ ঘণ্টা'}</span>
                        </span>
                      </div>
                    </div>

                    {/* Features List */}
                    {pkg.features && pkg.features.length > 0 && (
                      <div className="mb-4">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                          ফিচারসমূহ ({pkg.features.length}):
                        </span>
                        <ul className="space-y-1">
                          {pkg.features.map((feat, fIdx) => (
                            <li key={fIdx} className="text-xs text-slate-300 flex items-center gap-2">
                              <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                              <span className="truncate">{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Actions: Edit & Delete */}
                  <div className="pt-4 border-t border-[#132345] flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(pkg)}
                      className="py-2 px-3 rounded-xl bg-[#091534] hover:bg-[#132345] border border-[#132345] text-cyan-400 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>সম্পাদনা করুন</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingPackage(pkg)}
                      className="py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>মুছুন</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Package Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#050b1c] border border-[#132345] rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6 border-b border-[#132345] pb-4">
              <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  {editingPackage ? 'ওয়েবসাইট প্যাকেজ সম্পাদনা' : 'নতুন ওয়েবসাইট প্যাকেজ যোগ করুন'}
                </h3>
                <p className="text-xs text-slate-400">
                  প্যাকেজের মূল্য, অগ্রিম টাকা এবং বিবরণ নির্ধারণ করুন।
                </p>
              </div>
            </div>

            <form onSubmit={handleSavePackage} className="space-y-5">
              {/* Package Name & Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    প্যাকেজের নাম (Package Name) *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="যেমন: আমরা বানিয়ে দেব / নিজে শিখুন"
                    className="w-full boostara-input p-3 text-xs sm:text-sm font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    প্যাকেজের ধরন (Package Type)
                  </label>
                  <select
                    value={packageType}
                    onChange={(e) => setPackageType(e.target.value as any)}
                    className="w-full boostara-input p-3 text-xs sm:text-sm cursor-pointer"
                  >
                    <option value="custom_build">Custom Build (আমরা বানিয়ে দেব)</option>
                    <option value="course">Video Course / Tutorial (নিজে শিখুন)</option>
                    <option value="general">General Website Service</option>
                  </select>
                </div>
              </div>

              {/* Pricing: Total, Advance, Remaining */}
              <div className="p-4 rounded-2xl bg-[#091534] border border-[#132345] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4" />
                    <span>প্রাইসিং কনফিগারেশন (BDT)</span>
                  </span>
                  <span className="text-[11px] text-slate-400">
                    অটো-ক্যালকুলেট হয়, প্রয়োজনে পরিবর্তনযোগ্য
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      মোট মূল্য (Total Price ৳) *
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={totalPrice}
                      onChange={(e) => handleTotalPriceChange(Number(e.target.value))}
                      className="w-full boostara-input p-3 font-mono font-bold text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      অগ্রিম ফি (Advance ৳) *
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={advanceAmount}
                      onChange={(e) => handleAdvanceAmountChange(Number(e.target.value))}
                      className="w-full boostara-input p-3 font-mono font-bold text-sm text-emerald-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      বাকি টাকা (Remaining ৳)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={remainingAmount}
                      onChange={(e) => setRemainingAmount(Number(e.target.value))}
                      className="w-full boostara-input p-3 font-mono font-bold text-sm text-amber-400"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Time & Sort Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    ডেলিভারি সময় (Delivery Time) *
                  </label>
                  <input
                    type="text"
                    value={deliveryTime}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                    placeholder="যেমন: ১ থেকে ১০ ঘণ্টা / তাৎক্ষণিক"
                    className="w-full boostara-input p-3 text-xs sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    ডিসপ্লে পজিশন / ক্রমানুসার (Sort Order)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                    className="w-full boostara-input p-3 text-xs sm:text-sm font-mono"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  প্যাকেজের সংক্ষিপ্ত বিবরণ (Description)
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="যেমন: আপনার ব্যবসার জন্য professional website তৈরি করে দেব।"
                  className="w-full boostara-input p-3 text-xs sm:text-sm"
                />
              </div>

              {/* Features Builder */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  প্যাকেজের ফিচার বা বুলেট পয়েন্ট (Features List)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newFeatureText}
                    onChange={(e) => setNewFeatureText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                    placeholder="নতুন ফিচার লিখুন (যেমন: ফ্রি সাপোর্ট, রেসপনসিভ ডিজাইন)"
                    className="flex-1 boostara-input p-2.5 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-3.5 py-2 rounded-xl bg-[#091534] hover:bg-[#132345] border border-[#132345] text-cyan-400 text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <ListPlus className="w-4 h-4" />
                    <span>যোগ করুন</span>
                  </button>
                </div>

                {features.length > 0 && (
                  <div className="space-y-1.5 max-h-36 overflow-y-auto p-2 rounded-xl bg-[#030712] border border-[#132345]">
                    {features.map((feat, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-2 p-2 rounded-lg bg-[#050b1c] border border-[#132345] text-xs"
                      >
                        <span className="text-slate-300 truncate">{feat}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(idx)}
                          className="text-rose-400 hover:text-rose-300 p-1 cursor-pointer shrink-0"
                          title="মুছুন"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Active Toggle Checkbox */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#050b1c] border border-[#132345]">
                <input
                  type="checkbox"
                  id="activeToggle"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="w-4 h-4 accent-[#1ac8ff] cursor-pointer"
                />
                <label htmlFor="activeToggle" className="text-xs text-slate-300 font-semibold cursor-pointer">
                  এই প্যাকেজটি কাস্টমার পেজে সক্রিয় রাখুন (Active for Customer Orders)
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#132345]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="py-2.5 px-6 rounded-xl btn-primary text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>সংরক্ষণ হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{editingPackage ? 'আপডেট সংরক্ষণ করুন' : 'প্যাকেজ তৈরি করুন'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal (NO window.confirm!) */}
      {deletingPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#050b1c] border border-rose-500/40 rounded-3xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white">প্যাকেজটি মুছে ফেলতে চান?</h3>
              <p className="text-xs text-slate-300 mt-1">
                আপনি কি নিশ্চিত যে <span className="text-rose-400 font-bold">"{deletingPackage.name}"</span> প্যাকেজটি মুছে ফেলতে চান? পূর্ববর্তী ঐতিহাসিক অর্ডারগুলোর তথ্য অক্ষুণ্ণ থাকবে।
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingPackage(null)}
                disabled={deleting}
                className="py-2.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
              >
                বাতিল করুন
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="py-2.5 px-5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg shadow-rose-600/30 disabled:opacity-50"
              >
                {deleting ? (
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
