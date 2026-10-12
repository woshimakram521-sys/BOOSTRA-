import {
  AppSettings,
  Order,
  PaymentRecord,
  Review,
  SMMService,
  SMMServiceTier,
  WebsitePackage,
} from '../types';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('boostara_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  // --- Public APIs ---
  async getSettings(): Promise<AppSettings> {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) throw new Error('Failed to load settings');
    return res.json();
  },

  async getTrustStats(): Promise<{ completedOrdersCount: number }> {
    const res = await fetch(`${API_BASE}/trust-stats`);
    if (!res.ok) throw new Error('Failed to load stats');
    return res.json();
  },

  async getSMMServices(): Promise<SMMService[]> {
    const res = await fetch(`${API_BASE}/smm-services`);
    if (!res.ok) throw new Error('Failed to load SMM services');
    return res.json();
  },

  async getWebsitePackages(): Promise<WebsitePackage[]> {
    const res = await fetch(`${API_BASE}/website-packages`);
    if (!res.ok) throw new Error('Failed to load website packages');
    return res.json();
  },

  async createOrder(payload: any): Promise<{ success: boolean; orderId: string; id: string; totalAmount: number; advanceAmount?: number }> {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'অর্ডার প্রক্রিয়া করা যায়নি');
    return data;
  },

  async getOrderForPayment(orderId: string): Promise<any> {
    const res = await fetch(`${API_BASE}/orders/${encodeURIComponent(orderId)}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'অর্ডার পাওয়া যায়নি');
    return data;
  },

  async submitPayment(payload: {
    orderId: string;
    paymentMethod: string;
    senderNumber: string;
    transactionId: string;
    paidAmount: number;
  }): Promise<{ success: boolean; message: string; payment: PaymentRecord }> {
    const res = await fetch(`${API_BASE}/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'পেমেন্ট জমা দেওয়া যায়নি');
    return data;
  },

  async trackOrder(orderId: string, customerWhatsapp: string): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, customerWhatsapp }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'অর্ডার ট্র্যাকিং ব্যর্থ হয়েছে');
    return data;
  },

  async getReviews(): Promise<Review[]> {
    const res = await fetch(`${API_BASE}/reviews`);
    if (!res.ok) throw new Error('Failed to load reviews');
    return res.json();
  },

  // --- Admin APIs ---
  async adminLogin(email: string, password: string): Promise<{ success: boolean; token: string; admin: any }> {
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'লগইন ব্যর্থ হয়েছে');
    return data;
  },

  async getAdminMe(): Promise<{ admin: any }> {
    const res = await fetch(`${API_BASE}/admin/me`, {
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Unauthorized');
    return res.json();
  },

  async getAdminAnalytics(): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/analytics`, {
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to load analytics');
    return res.json();
  },

  async getAdminOrders(params: {
    type?: string;
    orderStatus?: string;
    paymentStatus?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ orders: Order[]; total: number; page: number; totalPages: number }> {
    const query = new URLSearchParams();
    if (params.type) query.append('type', params.type);
    if (params.orderStatus) query.append('orderStatus', params.orderStatus);
    if (params.paymentStatus) query.append('paymentStatus', params.paymentStatus);
    if (params.search) query.append('search', params.search);
    if (params.page) query.append('page', String(params.page));
    if (params.limit) query.append('limit', String(params.limit));

    const res = await fetch(`${API_BASE}/admin/orders?${query.toString()}`, {
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to load orders');
    return res.json();
  },

  async updateOrderStatus(
    orderId: string,
    updates: {
      orderStatus?: string;
      paymentStatus?: string;
      rejectionReason?: string;
    }
  ): Promise<{ success: boolean; order: Order }> {
    const res = await fetch(`${API_BASE}/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update order');
    return data;
  },

  async getAdminSMMServices(): Promise<SMMService[]> {
    const res = await fetch(`${API_BASE}/admin/smm-services`, {
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to load SMM services');
    return res.json();
  },

  async addSMMService(service: Partial<SMMService>): Promise<SMMService> {
    const res = await fetch(`${API_BASE}/admin/smm-services`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(service),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to add service');
    return data;
  },

  async updateSMMService(id: string, updates: Partial<SMMService>): Promise<SMMService> {
    const res = await fetch(`${API_BASE}/admin/smm-services/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update service');
    return data;
  },

  async updateSMMServiceBadge(id: string, badge: 'Featured' | 'Popular' | 'Normal'): Promise<{ success: boolean; service: SMMService }> {
    const res = await fetch(`${API_BASE}/admin/smm-services/${id}/badge`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ badge }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'ব্যাজ পরিবর্তন ব্যর্থ হয়েছে');
    return data;
  },

  async deleteSMMService(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/admin/smm-services/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    return res.ok;
  },

  async addTier(serviceId: string, tier: Partial<SMMServiceTier>): Promise<SMMServiceTier> {
    const res = await fetch(`${API_BASE}/admin/smm-services/${serviceId}/tiers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(tier),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to add tier');
    return data;
  },

  async updateTier(serviceId: string, tierId: string, updates: Partial<SMMServiceTier>): Promise<SMMServiceTier> {
    const res = await fetch(`${API_BASE}/admin/smm-services/${serviceId}/tiers/${tierId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update tier');
    return data;
  },

  async deleteTier(serviceId: string, tierId: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/admin/smm-services/${serviceId}/tiers/${tierId}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    return res.ok;
  },

  async getAdminReviews(): Promise<Review[]> {
    const res = await fetch(`${API_BASE}/admin/reviews`, {
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to load reviews');
    return res.json();
  },

  async addReview(review: Partial<Review>): Promise<Review> {
    const res = await fetch(`${API_BASE}/admin/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(review),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to add review');
    return data;
  },

  async updateReview(id: string, updates: Partial<Review>): Promise<Review> {
    const res = await fetch(`${API_BASE}/admin/reviews/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update review');
    return data;
  },

  async deleteReview(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/admin/reviews/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    return res.ok;
  },

  async getAdminSettings(): Promise<AppSettings> {
    const res = await fetch(`${API_BASE}/admin/settings`, {
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to load settings');
    return res.json();
  },

  async updateAdminSettings(settings: Partial<AppSettings>): Promise<AppSettings> {
    const res = await fetch(`${API_BASE}/admin/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(settings),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update settings');
    return data;
  },

  // --- Website Packages Admin ---
  async getAdminWebsitePackages(): Promise<WebsitePackage[]> {
    const res = await fetch(`${API_BASE}/admin/website-packages`, {
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to load website packages');
    return res.json();
  },

  async addWebsitePackage(pkg: Partial<WebsitePackage>): Promise<WebsitePackage> {
    const res = await fetch(`${API_BASE}/admin/website-packages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(pkg),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to add package');
    return data;
  },

  async updateWebsitePackage(id: string, updates: Partial<WebsitePackage>): Promise<WebsitePackage> {
    const res = await fetch(`${API_BASE}/admin/website-packages/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update package');
    return data;
  },

  async toggleWebsitePackage(id: string): Promise<WebsitePackage> {
    const res = await fetch(`${API_BASE}/admin/website-packages/${id}/toggle`, {
      method: 'PATCH',
      headers: getAuthHeader(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to toggle package status');
    return data;
  },

  async deleteWebsitePackage(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/admin/website-packages/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    return res.ok;
  },

  exportCsvUrl(range: 'today' | 'this_month' | 'all'): string {
    const token = localStorage.getItem('boostara_admin_token') || '';
    return `${API_BASE}/admin/export-csv?range=${range}&token=${encodeURIComponent(token)}`;
  },

  async downloadCsv(range: 'today' | 'this_month' | 'all'): Promise<void> {
    const res = await fetch(`${API_BASE}/admin/export-csv?range=${range}`, {
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error('Failed to download CSV');
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `boostara_orders_${range}_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  },

  async getEmailStatus(): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/email-status`, {
      headers: getAuthHeader(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to load email status');
    return data;
  },

  async sendTestEmail(targetEmail?: string): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/test-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ targetEmail }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to send test email');
    return data;
  },
};
