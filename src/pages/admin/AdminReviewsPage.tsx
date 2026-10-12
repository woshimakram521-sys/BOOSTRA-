import React, { useState, useEffect } from 'react';
import {
  Star,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Eye,
  EyeOff,
  AlertTriangle,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';
import { AdminNav } from '../../components/AdminNav';
import { api } from '../../services/api';
import { Review } from '../../types';
import { useApp } from '../../context/AppContext';

export const AdminReviewsPage: React.FC = () => {
  const { showToast } = useApp();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingReview, setSavingReview] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [screenshot, setScreenshot] = useState('');
  const [visible, setVisible] = useState(true);
  const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null);
  const [deletingReview, setDeletingReview] = useState(false);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminReviews();
      setReviews(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'রিভিউ লোড করতে ব্যর্থ হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const openAddModal = () => {
    setEditingReview(null);
    setCustomerName('');
    setReviewText('');
    setRating(5);
    setScreenshot('');
    setVisible(true);
    setIsModalOpen(true);
  };

  const openEditModal = (r: Review) => {
    setEditingReview(r);
    setCustomerName(r.customerName);
    setReviewText(r.reviewText);
    setRating(r.rating);
    setScreenshot(r.screenshot || '');
    setVisible(r.visible);
    setIsModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrorMsg('অনুগ্রহ করে শুধুমাত্র ইমেজ ফাইল আপলোড করুন।');
        return;
      }
      // Validate file size (< 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setErrorMsg('ফাইলের সাইজ সর্বোচ্চ ২ মেগাবাইট হতে পারবে।');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setScreenshot(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setSavingReview(true);

    try {
      if (editingReview) {
        await api.updateReview(editingReview.id, {
          customerName,
          reviewText,
          rating,
          screenshot,
          visible,
        });
        setSuccessMsg('রিভিউ সফলভাবে আপডেট হয়েছে।');
        showToast('রিভিউ সফলভাবে আপডেট হয়েছে।', 'success');
      } else {
        await api.addReview({
          customerName,
          reviewText,
          rating,
          screenshot,
          visible,
        });
        setSuccessMsg('নতুন রিভিউ যুক্ত হয়েছে।');
        showToast('নতুন রিভিউ সফলভাবে যুক্ত হয়েছে।', 'success');
      }
      setIsModalOpen(false);
      loadReviews();
    } catch (err: any) {
      const errTxt = err.message || 'রিভিউ সংরক্ষণ ব্যর্থ হয়েছে।';
      setErrorMsg(errTxt);
      showToast(errTxt, 'error');
    } finally {
      setSavingReview(false);
    }
  };

  const handleConfirmDeleteReview = async () => {
    if (!reviewToDelete) return;
    setDeletingReview(true);
    try {
      await api.deleteReview(reviewToDelete.id);
      loadReviews();
      setSuccessMsg('রিভিউ মুছে ফেলা হয়েছে।');
      showToast('রিভিউ মুছে ফেলা হয়েছে।', 'success');
      setReviewToDelete(null);
    } catch (err: any) {
      const errTxt = err.message || 'রিভিউ মুছতে সমস্যা হয়েছে।';
      setErrorMsg(errTxt);
      showToast(errTxt, 'error');
    } finally {
      setDeletingReview(false);
    }
  };

  const handleToggleVisible = async (r: Review) => {
    setTogglingId(r.id);
    try {
      await api.updateReview(r.id, { visible: !r.visible });
      await loadReviews();
      showToast(`রিভিউ ভিজিবিলিটি ${!r.visible ? 'চালু' : 'বন্ধ'} করা হয়েছে।`, 'success');
    } catch (err: any) {
      const errTxt = err.message || 'স্ট্যাটাস আপডেট ব্যর্থ হয়েছে।';
      setErrorMsg(errTxt);
      showToast(errTxt, 'error');
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="min-h-screen pb-16">
      <AdminNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              কাস্টমার <span className="text-gradient">রিভিউ ম্যানেজমেন্ট</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              হোমপেজের ক্যারোসালে প্রদর্শিত সত্য গ্রাহক রিভিউ, রেটিং ও স্ক্রিনশট নিয়ন্ত্রণ করুন।
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="py-2.5 px-4 rounded-xl btn-primary text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg hover:shadow-cyan-500/25"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন রিভিউ যোগ করুন</span>
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

        {loading ? (
          <div className="glass-card p-12 rounded-2xl border border-[#132345] text-center">
            <div className="w-7 h-7 rounded-full border-2 border-[#1ac8ff] border-t-transparent animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-400">রিভিউ লোড হচ্ছে...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="glass-card p-12 rounded-2xl border border-[#132345] text-center text-slate-400 text-xs">
            এখনও কোনো রিভিউ যুক্ত করা হয়নি। 'নতুন রিভিউ যোগ করুন' বাটনে ক্লিক করুন।
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((r) => (
              <div
                key={r.id}
                className={`glass-card p-6 rounded-2xl border transition-all flex flex-col justify-between ${
                  r.visible ? 'border-[#132345]' : 'border-rose-500/30 opacity-70'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                          }`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={() => handleToggleVisible(r)}
                      disabled={togglingId === r.id}
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 cursor-pointer transition-all ${
                        r.visible
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {togglingId === r.id ? (
                        <div className="w-3 h-3 rounded-full border border-current border-t-transparent animate-spin" />
                      ) : r.visible ? (
                        <Eye className="w-3 h-3" />
                      ) : (
                        <EyeOff className="w-3 h-3" />
                      )}
                      <span>{r.visible ? 'Visible' : 'Hidden'}</span>
                    </button>
                  </div>

                  <blockquote className="text-xs sm:text-sm text-slate-200 italic mb-4">
                    "{r.reviewText}"
                  </blockquote>

                  {r.screenshot && (
                    <div className="mb-4 rounded-xl overflow-hidden border border-[#132345] max-h-32 bg-[#050b1c]">
                      <img
                        src={r.screenshot}
                        alt="Screenshot"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-[#132345] flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">{r.customerName}</h4>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(r.createdAt).toLocaleDateString('bn-BD')}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(r)}
                      className="p-1.5 rounded-lg bg-[#091534] border border-[#132345] text-slate-300 hover:text-white cursor-pointer"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setReviewToDelete(r)}
                      className="p-1.5 rounded-lg bg-rose-950/30 border border-rose-500/40 text-rose-400 hover:bg-rose-900/40 cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md p-6 rounded-3xl bg-[#050b1c] border border-[#132345] shadow-2xl text-left space-y-4">
            <h3 className="text-lg font-bold text-white border-b border-[#132345] pb-3">
              {editingReview ? 'রিভিউ এডিট করুন' : 'নতুন রিভিউ যোগ করুন'}
            </h3>

            <form onSubmit={handleSaveReview} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">কাস্টমার নাম *</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="যেমন: তানভীর আহমেদ"
                  className="w-full boostara-input p-2.5"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">রিভিউ টেক্সট *</label>
                <textarea
                  rows={3}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="গ্রাহকের মন্তব্য লিখুন..."
                  className="w-full boostara-input p-2.5"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">রেটিং (১-৫)</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full boostara-input p-2.5 cursor-pointer"
                >
                  <option value={5}>★★★★★ (৫ স্টার)</option>
                  <option value={4}>★★★★☆ (৪ স্টার)</option>
                  <option value={3}>★★★☆☆ (৩ স্টার)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  স্ক্রিনশট (ইমেজ ফাইল আপলোড অথবা লিঙ্ক)
                </label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full text-slate-400 text-xs"
                  />
                  <input
                    type="url"
                    value={screenshot}
                    onChange={(e) => setScreenshot(e.target.value)}
                    placeholder="অথবা সরাসরি ইমেজ URL পেস্ট করুন"
                    className="w-full boostara-input p-2 font-mono text-[11px]"
                  />
                  {screenshot && (
                    <div className="h-20 rounded-lg overflow-hidden border border-[#132345]">
                      <img src={screenshot} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="revVisible"
                  checked={visible}
                  onChange={(e) => setVisible(e.target.checked)}
                  className="rounded accent-[#1ac8ff] cursor-pointer"
                />
                <label htmlFor="revVisible" className="text-slate-300 cursor-pointer">
                  হোমপেজে দৃশ্যমান (Visible) রাখুন
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#132345]">
                <button
                  type="button"
                  disabled={savingReview}
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary px-4 py-2 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={savingReview}
                  className="btn-primary px-5 py-2 cursor-pointer flex items-center gap-2"
                >
                  {savingReview ? (
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

      {/* Delete Review Confirmation Modal */}
      {reviewToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#050b1c] border border-rose-500/40 rounded-3xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white">রিভিউটি মুছে ফেলতে চান?</h3>
              <p className="text-xs text-slate-300 mt-1">
                গ্রাহক <span className="text-rose-400 font-bold">"{reviewToDelete.customerName}"</span>-এর রিভিউটি মুছে ফেলতে নিশ্চিত করুন।
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setReviewToDelete(null)}
                disabled={deletingReview}
                className="py-2.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
              >
                বাতিল করুন
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteReview}
                disabled={deletingReview}
                className="py-2.5 px-5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg shadow-rose-600/30 disabled:opacity-50"
              >
                {deletingReview ? (
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
