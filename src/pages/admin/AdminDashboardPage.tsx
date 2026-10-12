import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  CreditCard,
  Download,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';
import { AdminNav } from '../../components/AdminNav';
import { api } from '../../services/api';
import { Order, OrderStatus, PaymentStatus } from '../../types';
import { useApp } from '../../context/AppContext';

export const AdminDashboardPage: React.FC = () => {
  const { showToast } = useApp();
  const [analytics, setAnalytics] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters
  const [activeTab, setActiveTab] = useState<'ALL' | 'SMM' | 'ADS' | 'WEBSITE'>('ALL');
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal / Drawer
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [cancelModalOrder, setCancelModalOrder] = useState<Order | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');

  const [actionLoading, setActionLoading] = useState(false);
  const [downloadingRange, setDownloadingRange] = useState<'today' | 'this_month' | 'all' | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [analyticsData, ordersData] = await Promise.all([
        api.getAdminAnalytics(),
        api.getAdminOrders({
          type: activeTab !== 'ALL' ? activeTab : undefined,
          orderStatus: orderStatusFilter !== 'ALL' ? orderStatusFilter : undefined,
          paymentStatus: paymentStatusFilter !== 'ALL' ? paymentStatusFilter : undefined,
          search: searchQuery.trim() || undefined,
          page,
          limit: 25,
        }),
      ]);
      setAnalytics(analyticsData);
      setOrders(ordersData.orders);
      setTotalOrders(ordersData.total);
      setTotalPages(ordersData.totalPages);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab, orderStatusFilter, paymentStatusFilter, page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadData();
  };

  const handleUpdateStatus = async (
    orderId: string,
    orderStatus?: OrderStatus,
    paymentStatus?: PaymentStatus,
    rejectionReason?: string
  ) => {
    setActionLoading(true);
    setUpdatingOrderId(orderId);
    try {
      await api.updateOrderStatus(orderId, {
        orderStatus,
        paymentStatus,
        rejectionReason,
      });
      await loadData();
      if (selectedOrder && selectedOrder.orderId === orderId) {
        setSelectedOrder((prev) =>
          prev
            ? {
                ...prev,
                orderStatus: orderStatus || prev.orderStatus,
                paymentStatus: paymentStatus || prev.paymentStatus,
                rejectionReason: rejectionReason !== undefined ? rejectionReason : prev.rejectionReason,
              }
            : null
        );
      }
      showToast(`অর্ডার ${orderId} স্ট্যাটাস সফলভাবে আপডেট হয়েছে।`, 'success');
    } catch (err: any) {
      const errTxt = err.message || 'স্ট্যাটাস আপডেট ব্যর্থ হয়েছে।';
      console.error('Failed to update status:', err);
      showToast(errTxt, 'error');
    } finally {
      setActionLoading(false);
      setUpdatingOrderId(null);
    }
  };

  const handleConfirmCancel = async () => {
    if (!cancelModalOrder) return;
    await handleUpdateStatus(
      cancelModalOrder.orderId,
      'Cancelled',
      'Cancelled',
      rejectionReasonInput.trim()
    );
    setCancelModalOrder(null);
    setRejectionReasonInput('');
  };

  const handleDownloadCsv = async (range: 'today' | 'this_month' | 'all') => {
    setDownloadingRange(range);
    try {
      await api.downloadCsv(range);
      showToast('CSV ফাইল সফলভাবে ডাউনলোড হয়েছে।', 'success');
    } catch (err: any) {
      console.error('CSV download error:', err);
      showToast(err.message || 'CSV ডাউনলোড করতে ব্যর্থ হয়েছে।', 'error');
    } finally {
      setDownloadingRange(null);
    }
  };

  return (
    <div className="min-h-screen pb-16">
      <AdminNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header & CSV Export */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              অর্ডার ও <span className="text-gradient">ম্যানেজমেন্ট ড্যাশবোর্ড</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              রিয়েল ডাটাবেস ভিত্তিক সকল কাস্টমার অর্ডার, পেমেন্ট ট্রানজ্যাকশন এবং ডেলিভারি স্ট্যাটাস।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleDownloadCsv('today')}
              disabled={downloadingRange !== null}
              className="py-2 px-3.5 rounded-xl bg-[#091534] border border-[#132345] hover:border-[#1ac8ff] text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              {downloadingRange === 'today' ? (
                <div className="w-3.5 h-3.5 rounded-full border-2 border-[#1ac8ff] border-t-transparent animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5 text-[#1ac8ff]" />
              )}
              <span>Today's CSV</span>
            </button>
            <button
              onClick={() => handleDownloadCsv('this_month')}
              disabled={downloadingRange !== null}
              className="py-2 px-3.5 rounded-xl bg-[#091534] border border-[#132345] hover:border-[#1ac8ff] text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              {downloadingRange === 'this_month' ? (
                <div className="w-3.5 h-3.5 rounded-full border-2 border-purple-400 border-t-transparent animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5 text-purple-400" />
              )}
              <span>This Month CSV</span>
            </button>
            <button
              onClick={() => handleDownloadCsv('all')}
              disabled={downloadingRange !== null}
              className="py-2 px-3.5 rounded-xl btn-primary text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {downloadingRange === 'all' ? (
                <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>Export All Orders</span>
            </button>
            <button
              onClick={loadData}
              className="p-2 rounded-xl bg-[#091534] border border-[#132345] text-slate-400 hover:text-white cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 1. Real Analytics Stat Cards (Today & This Month) */}
        {analytics && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Today Orders */}
            <div className="glass-card p-5 rounded-2xl border border-[#132345]">
              <span className="text-xs text-slate-400 font-medium">আজকের মোট অর্ডার (Today's Orders)</span>
              <div className="text-2xl font-black text-white mt-1">
                {analytics.today.totalOrders} টি
              </div>
              <span className="text-[11px] text-[#1ac8ff] font-medium block mt-1">
                আজকের সক্রিয় ট্রাফিকের হিসেব
              </span>
            </div>

            {/* Card 2: Today Revenue */}
            <div className="glass-card p-5 rounded-2xl border border-[#132345]">
              <span className="text-xs text-slate-400 font-medium">আজকের রেভিনিউ (Today's Revenue)</span>
              <div className="text-2xl font-black text-emerald-400 mt-1">
                ৳{analytics.today.totalRevenue.toLocaleString('en-US')}
              </div>
              <span className="text-[11px] text-slate-400 block mt-1">
                ভেরিফায়েড / সম্পন্ন পেমেন্ট
              </span>
            </div>

            {/* Card 3: Month Orders */}
            <div className="glass-card p-5 rounded-2xl border border-[#132345]">
              <span className="text-xs text-slate-400 font-medium">এই মাসের মোট অর্ডার (Month Orders)</span>
              <div className="text-2xl font-black text-purple-400 mt-1">
                {analytics.thisMonth.totalOrders} টি
              </div>
              <span className="text-[11px] text-slate-400 block mt-1">
                চলতি মাসের সর্বমোট অর্ডার
              </span>
            </div>

            {/* Card 4: Month Revenue */}
            <div className="glass-card p-5 rounded-2xl border border-[#132345]">
              <span className="text-xs text-slate-400 font-medium">এই মাসের মোট রেভিনিউ (Month Revenue)</span>
              <div className="text-2xl font-black text-gradient mt-1">
                ৳{analytics.thisMonth.totalRevenue.toLocaleString('en-US')}
              </div>
              <span className="text-[11px] text-emerald-400 block mt-1">
                মোট সম্পন্ন: {analytics.completedOrdersCount} টি
              </span>
            </div>
          </div>
        )}

        {/* 2. Tabs & Filters */}
        <div className="glass-card p-5 rounded-2xl border border-[#132345] space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Order Type Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {[
                { label: 'সকল অর্ডার (All)', value: 'ALL' },
                { label: 'SMM Orders', value: 'SMM' },
                { label: 'Ads Orders', value: 'ADS' },
                { label: 'Website Orders', value: 'WEBSITE' },
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => {
                    setActiveTab(tab.value as any);
                    setPage(1);
                  }}
                  className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === tab.value
                      ? 'btn-primary'
                      : 'bg-[#050b1c] text-slate-400 border border-[#132345] hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search form */}
            <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full lg:w-80">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Order ID / Phone / TrxID..."
                className="w-full boostara-input px-3.5 py-2 text-xs font-mono"
              />
              <button
                type="submit"
                className="btn-secondary px-3.5 text-xs font-bold cursor-pointer"
              >
                Search
              </button>
            </form>
          </div>

          {/* Secondary Dropdown Filters */}
          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-[#132345] text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Order Status:</span>
              <select
                value={orderStatusFilter}
                onChange={(e) => {
                  setOrderStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="boostara-input px-2.5 py-1.5 text-xs cursor-pointer"
              >
                <option value="ALL">All Status</option>
                <option value="Pending">Pending</option>
                <option value="In Review">In Review</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400">Payment Status:</span>
              <select
                value={paymentStatusFilter}
                onChange={(e) => {
                  setPaymentStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="boostara-input px-2.5 py-1.5 text-xs cursor-pointer"
              >
                <option value="ALL">All Payment</option>
                <option value="Pending">Pending</option>
                <option value="Verified">Verified</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <span className="text-slate-500 ml-auto">
              মোট রেজাল্ট: {totalOrders} টি
            </span>
          </div>
        </div>

        {/* 3. Orders Table */}
        <div className="glass-card rounded-2xl border border-[#132345] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#050b1c] text-slate-400 uppercase font-semibold border-b border-[#132345]">
                <tr>
                  <th className="py-3.5 px-4">Order ID</th>
                  <th className="py-3.5 px-4">Customer WhatsApp</th>
                  <th className="py-3.5 px-4">Service Details</th>
                  <th className="py-3.5 px-4">Target / Link</th>
                  <th className="py-3.5 px-4">Qty / Budget</th>
                  <th className="py-3.5 px-4">Total (BDT)</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Payment Status</th>
                  <th className="py-3.5 px-4">Order Status</th>
                  <th className="py-3.5 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#132345]/50">
                {loading ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-slate-400">
                      <div className="w-7 h-7 rounded-full border-2 border-[#1ac8ff] border-t-transparent animate-spin mx-auto mb-2" />
                      অর্ডার ডাটা লোড হচ্ছে...
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-slate-400">
                      কোনো অর্ডার পাওয়া যায়নি।
                    </td>
                  </tr>
                ) : (
                  orders.map((ord) => {
                    const target =
                      ord.type === 'SMM'
                        ? ord.smmDetails?.targetLink
                        : ord.type === 'ADS'
                        ? ord.adsDetails?.targetLink
                        : ord.websiteDetails?.businessName;

                    const qtyOrBudget =
                      ord.type === 'SMM'
                        ? `${ord.smmDetails?.quantity}`
                        : ord.type === 'ADS'
                        ? `৳${ord.adsDetails?.budget}`
                        : `Adv: ৳${ord.websiteDetails?.advanceAmount}`;

                    const serviceStr =
                      ord.type === 'SMM'
                        ? `${ord.smmDetails?.platform} ${ord.smmDetails?.serviceType} (${ord.smmDetails?.tierName})${
                            ord.smmDetails?.reactionType ? ` • [${ord.smmDetails.reactionType}]` : ''
                          }`
                        : ord.type === 'ADS'
                        ? `${ord.adsDetails?.platform} Boost`
                        : `Website: ${ord.websiteDetails?.packageName}`;

                    return (
                      <tr key={ord.id} className="hover:bg-[#091534]/40 transition-colors">
                        {/* Order ID */}
                        <td className="py-3.5 px-4 font-mono font-bold text-[#1ac8ff]">
                          {ord.orderId}
                          <span className="block text-[10px] text-slate-500 font-sans">
                            {new Date(ord.createdAt).toLocaleDateString('bn-BD')}
                          </span>
                        </td>

                        {/* Customer WhatsApp */}
                        <td className="py-3.5 px-4 font-mono font-medium text-slate-200">
                          {ord.customerWhatsapp}
                          <a
                            href={`https://wa.me/88${ord.customerWhatsapp.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block ml-1 text-emerald-400 hover:text-emerald-300"
                            title="Open WhatsApp chat"
                          >
                            <MessageCircle className="w-3.5 h-3.5 inline" />
                          </a>
                        </td>

                        {/* Service Details */}
                        <td className="py-3.5 px-4 max-w-[200px] truncate text-slate-300">
                          <span className="font-semibold text-white block">{ord.type}</span>
                          <span className="text-[11px] text-slate-400 truncate block">
                            {serviceStr}
                          </span>
                        </td>

                        {/* Target */}
                        <td className="py-3.5 px-4 max-w-[150px] truncate font-mono text-[11px] text-cyan-300">
                          {target ? (
                            <a
                              href={target.startsWith('http') ? target : `https://${target}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline flex items-center gap-1 truncate"
                            >
                              <span className="truncate">{target}</span>
                              <ExternalLink className="w-3 h-3 shrink-0" />
                            </a>
                          ) : (
                            'N/A'
                          )}
                        </td>

                        {/* Qty / Budget */}
                        <td className="py-3.5 px-4 font-mono font-semibold text-slate-200">
                          {qtyOrBudget}
                        </td>

                        {/* Total Amount */}
                        <td className="py-3.5 px-4 font-mono font-bold text-white">
                          ৳{ord.totalAmount}
                        </td>

                        {/* Payment Details */}
                        <td className="py-3.5 px-4">
                          {ord.payment ? (
                            <div className="text-[11px]">
                              <span className="font-semibold text-slate-200">
                                {ord.payment.paymentMethod}
                              </span>
                              <span className="block font-mono text-slate-400">
                                Trx: {ord.payment.transactionId}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-500 italic">No Payment</span>
                          )}
                        </td>

                        {/* Payment Status Dropdown */}
                        <td className="py-3.5 px-4">
                          <select
                            value={ord.paymentStatus}
                            onChange={(e) =>
                              handleUpdateStatus(ord.orderId, undefined, e.target.value as PaymentStatus)
                            }
                            className={`boostara-input py-1 px-2 text-[11px] font-bold cursor-pointer rounded-lg ${
                              ord.paymentStatus === 'Verified'
                                ? 'text-emerald-400 border-emerald-500/40 bg-emerald-950/20'
                                : ord.paymentStatus === 'Cancelled'
                                ? 'text-rose-400 border-rose-500/40 bg-rose-950/20'
                                : 'text-amber-400 border-amber-500/40 bg-amber-950/20'
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Verified">Verified</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>

                        {/* Order Status Dropdown */}
                        <td className="py-3.5 px-4">
                          <select
                            value={ord.orderStatus}
                            onChange={(e) => {
                              const val = e.target.value as OrderStatus;
                              if (val === 'Cancelled') {
                                setCancelModalOrder(ord);
                                setRejectionReasonInput(ord.rejectionReason || '');
                              } else {
                                handleUpdateStatus(ord.orderId, val);
                              }
                            }}
                            className={`boostara-input py-1 px-2 text-[11px] font-bold cursor-pointer rounded-lg ${
                              ord.orderStatus === 'Completed'
                                ? 'text-emerald-400 border-emerald-500/40 bg-emerald-950/20'
                                : ord.orderStatus === 'In Review'
                                ? 'text-[#1ac8ff] border-cyan-500/40 bg-cyan-950/20'
                                : ord.orderStatus === 'Cancelled'
                                ? 'text-rose-400 border-rose-500/40 bg-rose-950/20'
                                : 'text-amber-400 border-amber-500/40 bg-amber-950/20'
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Review">In Review</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => setSelectedOrder(ord)}
                            className="p-1.5 rounded-lg bg-[#091534] border border-[#132345] hover:border-[#1ac8ff] text-slate-300 hover:text-white cursor-pointer"
                            title="View Full Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-[#132345] flex items-center justify-between text-xs text-slate-400">
              <span>
                Page {page} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1.5 rounded-lg bg-[#050b1c] border border-[#132345] disabled:opacity-40 cursor-pointer"
                >
                  Previous
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1.5 rounded-lg bg-[#050b1c] border border-[#132345] disabled:opacity-40 cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal / Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-3xl bg-[#050b1c] border border-[#132345] shadow-2xl text-left space-y-6">
            <div className="flex items-center justify-between border-b border-[#132345] pb-4">
              <div>
                <span className="text-[11px] text-slate-400 font-mono">ORDER DETAILS</span>
                <h3 className="text-xl font-mono font-bold text-[#1ac8ff]">
                  #{selectedOrder.orderId}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-xl bg-[#091534] border border-[#132345] text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-[#091534]">
                <span className="text-slate-400 block mb-0.5">কাস্টমার WhatsApp:</span>
                <span className="font-mono font-bold text-white">
                  {selectedOrder.customerWhatsapp}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#091534]">
                <span className="text-slate-400 block mb-0.5">অর্ডার তৈরির তারিখ:</span>
                <span className="font-mono text-slate-300">
                  {new Date(selectedOrder.createdAt).toLocaleString('bn-BD', {
                    timeZone: 'Asia/Dhaka',
                  })}
                </span>
              </div>
            </div>

            {/* Service Snapshot */}
            <div className="p-4 rounded-2xl bg-[#091534] border border-[#132345] space-y-2 text-xs">
              <h4 className="font-bold text-white text-sm border-b border-[#132345] pb-2">
                সার্ভিস স্পেসিফিকেশন ({selectedOrder.type})
              </h4>
              {selectedOrder.smmDetails && (
                <div className="space-y-1.5 text-slate-300">
                  <p>
                    <strong className="text-white">প্ল্যাটফর্ম:</strong> {selectedOrder.smmDetails.platform}
                  </p>
                  <p>
                    <strong className="text-white">সার্ভিস:</strong> {selectedOrder.smmDetails.serviceType} (
                    {selectedOrder.smmDetails.tierName})
                  </p>
                  {selectedOrder.smmDetails.reactionType && (
                    <p className="flex items-center gap-2">
                      <strong className="text-white">রিঅ্যাকশন টাইপ (Reaction Type):</strong>
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold text-xs">
                        {selectedOrder.smmDetails.reactionType}
                      </span>
                    </p>
                  )}
                  <p>
                    <strong className="text-white">পরিমাণ:</strong> {selectedOrder.smmDetails.quantity.toLocaleString('en-US')}
                  </p>
                  <p className="break-all">
                    <strong className="text-white">টার্গেট লিংক:</strong>{' '}
                    <a
                      href={selectedOrder.smmDetails.targetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1ac8ff] hover:underline"
                    >
                      {selectedOrder.smmDetails.targetLink}
                    </a>
                  </p>
                </div>
              )}

              {selectedOrder.adsDetails && (
                <div className="space-y-1.5 text-slate-300">
                  <p>
                    <strong className="text-white">প্ল্যাটফর্ম:</strong> {selectedOrder.adsDetails.platform}
                  </p>
                  <p>
                    <strong className="text-white">বাজেট:</strong> ৳{selectedOrder.adsDetails.budget}
                  </p>
                  <p>
                    <strong className="text-white">ক্যাম্পেইন সময়:</strong>{' '}
                    {selectedOrder.adsDetails.campaignDuration}
                  </p>
                  <p className="break-all">
                    <strong className="text-white">টার্গেট লিংক:</strong>{' '}
                    <a
                      href={selectedOrder.adsDetails.targetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1ac8ff] hover:underline"
                    >
                      {selectedOrder.adsDetails.targetLink}
                    </a>
                  </p>
                  <p className="break-all">
                    <strong className="text-white">ড্রাইভ মিডিয়া লিংক:</strong>{' '}
                    <a
                      href={selectedOrder.adsDetails.mediaLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:underline"
                    >
                      {selectedOrder.adsDetails.mediaLink}
                    </a>
                  </p>
                </div>
              )}

              {selectedOrder.websiteDetails && (
                <div className="space-y-1.5 text-slate-300">
                  <p>
                    <strong className="text-white">প্যাকেজ:</strong> {selectedOrder.websiteDetails.packageName}
                  </p>
                  {selectedOrder.websiteDetails.businessName && (
                    <p>
                      <strong className="text-white">ব্যবসার নাম:</strong>{' '}
                      {selectedOrder.websiteDetails.businessName}
                    </p>
                  )}
                  {selectedOrder.websiteDetails.websiteType && (
                    <p>
                      <strong className="text-white">ওয়েবসাইট টাইপ:</strong>{' '}
                      {selectedOrder.websiteDetails.websiteType}
                    </p>
                  )}
                </div>
              )}

              {selectedOrder.orderNote && (
                <div className="pt-2 border-t border-[#132345] text-amber-300">
                  <strong>কাস্টমার নোট:</strong> {selectedOrder.orderNote}
                </div>
              )}
            </div>

            {/* Payment Details */}
            <div className="p-4 rounded-2xl bg-[#091534] border border-[#132345] space-y-2 text-xs">
              <h4 className="font-bold text-white text-sm border-b border-[#132345] pb-2">
                পেমেন্ট ইনফরমেশন
              </h4>
              {selectedOrder.payment ? (
                <div className="space-y-1.5 text-slate-300">
                  <p>
                    <strong className="text-white">মেথড:</strong> {selectedOrder.payment.paymentMethod}
                  </p>
                  <p>
                    <strong className="text-white">সেন্ডার মোবাইল:</strong>{' '}
                    {selectedOrder.payment.senderNumber}
                  </p>
                  <p>
                    <strong className="text-white">TrxID:</strong>{' '}
                    <span className="font-mono text-[#1ac8ff] font-bold">
                      {selectedOrder.payment.transactionId}
                    </span>
                  </p>
                  <p>
                    <strong className="text-white">জমা দেওয়া টাকা:</strong> ৳
                    {selectedOrder.payment.paidAmount}
                  </p>
                </div>
              ) : (
                <p className="text-slate-400 italic">এখনও পেমেন্ট জমা দেওয়া হয়নি।</p>
              )}
            </div>

            {selectedOrder.rejectionReason && (
              <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs">
                <strong>বাতিলের কারণ (Rejection Reason):</strong> {selectedOrder.rejectionReason}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cancellation Rejection Reason Dialog */}
      {cancelModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md p-6 rounded-3xl bg-[#050b1c] border border-rose-500/40 shadow-2xl text-left space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-white">অর্ডার বাতিলকরণ ও কারণ</h3>
            </div>
            <p className="text-xs text-slate-300">
              অর্ডারটি বাতিল করার কারণটি লিখুন। এটি কাস্টমার তার Track Order পেজে দেখতে পাবে।
            </p>

            <textarea
              rows={3}
              value={rejectionReasonInput}
              onChange={(e) => setRejectionReasonInput(e.target.value)}
              placeholder="যেমন: ভুল লিঙ্ক প্রদান করা হয়েছে অথবা বিকাশ TrxID ভেরিফাই হয়নি।"
              className="w-full boostara-input p-3 text-xs"
              required
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCancelModalOrder(null)}
                className="btn-secondary px-4 py-2 text-xs font-bold cursor-pointer"
              >
                বাতিল করুন
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all cursor-pointer"
              >
                নিশ্চিত বাতিল করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
