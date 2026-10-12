import fs from 'fs';
import path from 'path';
import { hashPassword } from './auth';
import {
  AdminUser,
  AppSettings,
  Order,
  PaymentRecord,
  Review,
  SMMService,
  SMMServiceTier,
  WebsitePackage,
} from './types';

interface DatabaseSchema {
  admins: AdminUser[];
  smmServices: SMMService[];
  websitePackages: WebsitePackage[];
  orders: Order[];
  payments: PaymentRecord[];
  reviews: Review[];
  settings: AppSettings;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'boostara-db.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function getInitialData(): DatabaseSchema {
  // Admin password hashing
  const initialAdminPass = '@bOOSTARa@815#';
  const { hash, salt } = hashPassword(initialAdminPass);

  const initialAdmin: AdminUser = {
    id: 'admin_primary_01',
    email: 'mdmohammad.644633815@gmail.com',
    role: 'admin',
    passwordHash: hash,
    salt,
    createdAt: new Date().toISOString(),
  };

  // Seed SMM Services & Tiers as requested
  const now = new Date().toISOString();

  const servicesData: Array<{
    platform: SMMService['platform'];
    serviceType: SMMService['serviceType'];
    minQuantity?: number;
    maxQuantity?: number;
    tiers: Array<{ tierName: string; ratePer1000: number; guaranteePeriod: string }>;
  }> = [
    // Facebook
    {
      platform: 'Facebook',
      serviceType: 'Likes',
      tiers: [
        { tierName: 'Drop', ratePer1000: 50, guaranteePeriod: 'গ্যারান্টি নেই' },
        { tierName: 'Non-Drop', ratePer1000: 80, guaranteePeriod: '৩০ দিন রিফিল গ্যারান্টি' },
      ],
    },
    {
      platform: 'Facebook',
      serviceType: 'Comments',
      tiers: [
        { tierName: 'Drop', ratePer1000: 130, guaranteePeriod: 'গ্যারান্টি নেই' },
        { tierName: 'Non-Drop', ratePer1000: 220, guaranteePeriod: 'লাইফটাইম গ্যারান্টি' },
      ],
    },
    {
      platform: 'Facebook',
      serviceType: 'Reactions',
      tiers: [
        { tierName: 'Drop', ratePer1000: 50, guaranteePeriod: 'গ্যারান্টি নেই' },
        { tierName: 'Non-Drop', ratePer1000: 80, guaranteePeriod: '৩০ দিন রিফিল' },
      ],
    },
    {
      platform: 'Facebook',
      serviceType: 'Followers',
      minQuantity: 500,
      tiers: [
        { tierName: 'Drop', ratePer1000: 40, guaranteePeriod: 'গ্যারান্টি নেই' },
        { tierName: 'Non-Drop', ratePer1000: 190, guaranteePeriod: 'লাইফটাইম গ্যারান্টি' },
      ],
    },
    {
      platform: 'Facebook',
      serviceType: 'Views',
      tiers: [
        { tierName: 'Drop', ratePer1000: 20, guaranteePeriod: 'গ্যারান্টি নেই' },
      ],
    },

    // Instagram
    {
      platform: 'Instagram',
      serviceType: 'Likes',
      tiers: [
        { tierName: 'Drop', ratePer1000: 20, guaranteePeriod: 'গ্যারান্টি নেই' },
        { tierName: 'Non-Drop', ratePer1000: 59, guaranteePeriod: '৩০ দিন রিফিল' },
      ],
    },
    {
      platform: 'Instagram',
      serviceType: 'Comments',
      tiers: [
        { tierName: 'Drop', ratePer1000: 75, guaranteePeriod: 'গ্যারান্টি নেই' },
        { tierName: 'Non-Drop', ratePer1000: 110, guaranteePeriod: 'লাইফটাইম গ্যারান্টি' },
      ],
    },
    {
      platform: 'Instagram',
      serviceType: 'Followers',
      minQuantity: 500,
      tiers: [
        { tierName: 'Drop', ratePer1000: 130, guaranteePeriod: 'গ্যারান্টি নেই' },
        { tierName: 'Non-Drop', ratePer1000: 200, guaranteePeriod: 'লাইফটাইম গ্যারান্টি' },
      ],
    },
    {
      platform: 'Instagram',
      serviceType: 'Views',
      tiers: [
        { tierName: 'Drop', ratePer1000: 20, guaranteePeriod: 'গ্যারান্টি নেই' },
        { tierName: 'Non-Drop', ratePer1000: 50, guaranteePeriod: '৩০ দিন রিফিল' },
      ],
    },

    // TikTok
    {
      platform: 'TikTok',
      serviceType: 'Likes',
      tiers: [
        { tierName: 'Drop', ratePer1000: 50, guaranteePeriod: 'গ্যারান্টি নেই' },
        { tierName: 'Non-Drop', ratePer1000: 70, guaranteePeriod: '৩০ দিন রিফিল' },
      ],
    },
    {
      platform: 'TikTok',
      serviceType: 'Comments',
      tiers: [
        { tierName: 'Drop', ratePer1000: 700, guaranteePeriod: 'গ্যারান্টি নেই' },
        { tierName: 'Non-Drop', ratePer1000: 770, guaranteePeriod: 'লাইফটাইম গ্যারান্টি' },
      ],
    },
    {
      platform: 'TikTok',
      serviceType: 'Followers',
      minQuantity: 500,
      tiers: [
        { tierName: 'Drop', ratePer1000: 140, guaranteePeriod: 'গ্যারান্টি নেই' },
        { tierName: 'Non-Drop', ratePer1000: 290, guaranteePeriod: 'লাইফটাইম গ্যারান্টি' },
      ],
    },
    {
      platform: 'TikTok',
      serviceType: 'Views',
      tiers: [
        { tierName: 'Drop', ratePer1000: 20, guaranteePeriod: 'গ্যারান্টি নেই' },
        { tierName: 'Non-Drop', ratePer1000: 50, guaranteePeriod: '৩০ দিন রিফিল' },
      ],
    },

    // YouTube
    {
      platform: 'YouTube',
      serviceType: 'Likes',
      tiers: [
        { tierName: 'Drop', ratePer1000: 120, guaranteePeriod: 'গ্যারান্টি নেই' },
        { tierName: 'Non-Drop', ratePer1000: 190, guaranteePeriod: '৩০ দিন রিফিল' },
      ],
    },
    {
      platform: 'YouTube',
      serviceType: 'Comments',
      tiers: [
        { tierName: 'Drop', ratePer1000: 150, guaranteePeriod: 'গ্যারান্টি নেই' },
        { tierName: 'Non-Drop', ratePer1000: 250, guaranteePeriod: 'লাইফটাইম গ্যারান্টি' },
      ],
    },
    {
      platform: 'YouTube',
      serviceType: 'Subscribers',
      minQuantity: 500,
      tiers: [
        { tierName: 'Drop', ratePer1000: 2450, guaranteePeriod: 'গ্যারান্টি নেই' },
        { tierName: 'Non-Drop', ratePer1000: 3500, guaranteePeriod: 'লাইফটাইম গ্যারান্টি' },
      ],
    },
    {
      platform: 'YouTube',
      serviceType: 'Views',
      tiers: [
        { tierName: 'Drop', ratePer1000: 90, guaranteePeriod: 'গ্যারান্টি নেই' },
        { tierName: 'Non-Drop', ratePer1000: 170, guaranteePeriod: '৩০ দিন রিফিল' },
      ],
    },
  ];

  let servIdCounter = 1;
  let tierIdCounter = 1;

  const smmServices: SMMService[] = servicesData.map((s) => {
    const serviceId = `smm_${servIdCounter++}`;
    const minQty = s.minQuantity || (s.serviceType === 'Followers' || s.serviceType === 'Subscribers' ? 500 : 100);
    const tiers: SMMServiceTier[] = s.tiers.map((t) => ({
      id: `tier_${tierIdCounter++}`,
      serviceId,
      tierName: t.tierName,
      ratePer1000: t.ratePer1000,
      guaranteePeriod: t.guaranteePeriod,
      active: true,
      createdAt: now,
    }));

    return {
      id: serviceId,
      platform: s.platform,
      serviceType: s.serviceType,
      minQuantity: minQty,
      maxQuantity: 100000,
      minOrderPrice: 20,
      active: true,
      badge: (s.platform === 'Facebook' && s.serviceType === 'Followers') ? 'Popular' : (s.platform === 'Instagram' && s.serviceType === 'Followers') ? 'Featured' : 'Normal',
      tiers,
      createdAt: now,
    };
  });

  const initialSettings: AppSettings = {
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
      enabled: true,
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
  };

  const initialReviews: Review[] = [
    {
      id: 'rev_1',
      customerName: 'তানভীর আহমেদ',
      reviewText: 'অর্ডার দেওয়ার ১ ঘণ্টার মধ্যেই ফেসবুক ফলোয়ার আসা শুরু হয়েছে। খুব দ্রুত এবং নির্ভরযোগ্য সার্ভিস!',
      rating: 5,
      visible: true,
      createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    },
    {
      id: 'rev_2',
      customerName: 'সামিরা ইসলাম',
      reviewText: 'ইউটিউব সাবস্ক্রাইবার প্যাকেজ নিয়েছিলাম। কোনো প্রকার ড্রপ হয়নি, লাইফটাইম গ্যারান্টি আসলেই সত্যি।',
      rating: 5,
      visible: true,
      createdAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
    },
    {
      id: 'rev_3',
      customerName: 'মেহেদী হাসান (E-com Owner)',
      reviewText: 'ফেসবুক অ্যাডস ক্যাম্পেইন চালু করেছিলাম। আলহামদুলিল্লাহ প্রচুর সেল এসেছে। কাস্টমার সাপোর্ট দারুণ!',
      rating: 5,
      visible: true,
      createdAt: new Date(Date.now() - 6 * 24 * 3600 * 1000).toISOString(),
    },
    {
      id: 'rev_4',
      customerName: 'রাফিদ মাহমুদ',
      reviewText: 'ওয়েবসাইট বিল্ডিং সার্ভিস অনেক প্রফেশনাল ছিল। মাত্র ৫০০ টাকায় সুন্দর শপ ওয়েবসাইট বানিয়ে দিয়েছে।',
      rating: 5,
      visible: true,
      createdAt: new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString(),
    },
  ];

  const initialWebsitePackages: WebsitePackage[] = [
    {
      id: 'pkg_built_for_you',
      name: 'আমরা বানিয়ে দেব',
      totalPrice: 500,
      advanceAmount: 250,
      remainingAmount: 250,
      description: 'আপনার জন্য professional website তৈরি করে দেব।',
      deliveryTime: '১ থেকে ১০ ঘণ্টা',
      sortOrder: 1,
      active: true,
      packageType: 'custom_build',
      features: [
        'রেসপনসিভ ও আধুনিক ডিজাইন',
        'ডেলিভারি পর যেকোনো কারেকশন সুবিধা',
      ],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'pkg_learn_yourself',
      name: 'নিজে শিখুন',
      totalPrice: 1000,
      advanceAmount: 500,
      remainingAmount: 500,
      description: 'Recorded video tutorial দিয়ে website তৈরি শেখানো হবে।',
      deliveryTime: 'ভিডিও delivery after payment',
      sortOrder: 2,
      active: true,
      packageType: 'course',
      features: [
        'সহজ বাংলায় বিস্তারিত গাইডলাইন',
        'লাইফটাইম এক্সেস ও সাপোর্ট',
      ],
      createdAt: now,
      updatedAt: now,
    },
  ];

  return {
    admins: [initialAdmin],
    smmServices,
    websitePackages: initialWebsitePackages,
    orders: [],
    payments: [],
    reviews: initialReviews,
    settings: initialSettings,
  };
}

class Database {
  private data: DatabaseSchema;

  constructor() {
    ensureDataDir();
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        // Ensure all collections exist
        if (!this.data.admins || this.data.admins.length === 0) {
          const init = getInitialData();
          this.data.admins = init.admins;
          this.persist();
        }
        if (!this.data.smmServices) this.data.smmServices = [];
        if (!this.data.websitePackages || this.data.websitePackages.length === 0) {
          this.data.websitePackages = getInitialData().websitePackages;
          this.persist();
        }
        if (!this.data.orders) this.data.orders = [];
        if (!this.data.payments) this.data.payments = [];
        if (!this.data.reviews) this.data.reviews = [];
        if (!this.data.settings) {
          this.data.settings = getInitialData().settings;
          this.persist();
        } else if (!this.data.settings.maintenanceMode) {
          this.data.settings.maintenanceMode = {
            enabled: false,
            message: 'আমরা বর্তমানে কিছু গুরুত্বপূর্ণ আপডেট করছি। খুব শীঘ্রই BOOSTARA আবার সম্পূর্ণভাবে চালু হবে।',
            estimatedReturn: '',
          };
          this.persist();
        }
        // Ensure services have badge
        let modifiedServices = false;
        for (const s of this.data.smmServices) {
          if (!s.badge) {
            s.badge = (s.platform === 'Facebook' && s.serviceType === 'Followers') ? 'Popular' : (s.platform === 'Instagram' && s.serviceType === 'Followers') ? 'Featured' : 'Normal';
            modifiedServices = true;
          }
        }
        if (modifiedServices) {
          this.persist();
        }
      } catch (err) {
        console.error('Error reading database file, re-initializing...', err);
        this.data = getInitialData();
        this.persist();
      }
    } else {
      this.data = getInitialData();
      this.persist();
    }
  }

  private persist() {
    try {
      ensureDataDir();
      const tmpFile = `${DB_FILE}.tmp`;
      fs.writeFileSync(tmpFile, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tmpFile, DB_FILE);
    } catch (err) {
      console.error('Failed to persist database:', err);
    }
  }

  // Generate unique public Order ID: BST-YYYYMMDD-XXXX
  public generateOrderId(): string {
    const date = new Date();
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}${mm}${dd}`;

    let uniqueId = '';
    let exists = true;
    while (exists) {
      const rand = Math.floor(1000 + Math.random() * 9000); // 4 digit random
      uniqueId = `BST-${dateStr}-${rand}`;
      exists = this.data.orders.some((o) => o.orderId === uniqueId);
    }
    return uniqueId;
  }

  // --- Orders ---
  public getOrders(): Order[] {
    return [...this.data.orders];
  }

  public getOrderById(id: string): Order | undefined {
    return this.data.orders.find((o) => o.id === id || o.orderId === id);
  }

  public findOrderByTrack(orderId: string, phone: string): Order | undefined {
    const cleanOrderId = orderId.trim().toUpperCase();
    const cleanPhone = phone.trim().replace(/[^0-9]/g, '');
    return this.data.orders.find((o) => {
      const oIdMatch = o.orderId.toUpperCase() === cleanOrderId;
      const oPhoneMatch = o.customerWhatsapp.trim().replace(/[^0-9]/g, '') === cleanPhone;
      return oIdMatch && oPhoneMatch;
    });
  }

  public createOrder(orderData: Omit<Order, 'id' | 'orderId' | 'createdAt' | 'updatedAt'>): Order {
    const now = new Date().toISOString();
    const newOrder: Order = {
      ...orderData,
      id: `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      orderId: this.generateOrderId(),
      createdAt: now,
      updatedAt: now,
    };
    this.data.orders.unshift(newOrder);
    this.persist();
    return newOrder;
  }

  public updateOrderStatus(
    orderId: string,
    updates: {
      orderStatus?: Order['orderStatus'];
      paymentStatus?: Order['paymentStatus'];
      rejectionReason?: string;
    }
  ): Order | null {
    const order = this.data.orders.find((o) => o.id === orderId || o.orderId === orderId);
    if (!order) return null;

    if (updates.orderStatus) order.orderStatus = updates.orderStatus;
    if (updates.paymentStatus) {
      order.paymentStatus = updates.paymentStatus;
      if (order.payment) {
        order.payment.paymentStatus = updates.paymentStatus;
      }
    }
    if (updates.rejectionReason !== undefined) {
      order.rejectionReason = updates.rejectionReason;
    }
    order.updatedAt = new Date().toISOString();
    this.persist();
    return order;
  }

  // --- Payments ---
  public addPayment(paymentData: Omit<PaymentRecord, 'id' | 'submittedAt'>): PaymentRecord | null {
    const order = this.data.orders.find((o) => o.orderId === paymentData.orderId);
    if (!order) return null;

    const payment: PaymentRecord = {
      ...paymentData,
      id: `pay_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      submittedAt: new Date().toISOString(),
    };

    this.data.payments.push(payment);
    order.payment = payment;
    order.paymentStatus = 'Pending';
    order.updatedAt = new Date().toISOString();
    this.persist();
    return payment;
  }

  // --- SMM Services ---
  public getSMMServices(onlyActive = true): SMMService[] {
    if (onlyActive) {
      return this.data.smmServices
        .filter((s) => s.active)
        .map((s) => ({
          ...s,
          tiers: s.tiers.filter((t) => t.active),
        }));
    }
    return [...this.data.smmServices];
  }

  public addSMMService(service: Omit<SMMService, 'id' | 'createdAt'>): SMMService {
    const newService: SMMService = {
      ...service,
      id: `smm_${Date.now()}`,
      createdAt: new Date().toISOString(),
      badge: service.badge || 'Normal',
      tiers: service.tiers || [],
    };
    this.data.smmServices.push(newService);
    this.persist();
    return newService;
  }

  public updateSMMService(id: string, updates: Partial<SMMService>): SMMService | null {
    const idx = this.data.smmServices.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    this.data.smmServices[idx] = { ...this.data.smmServices[idx], ...updates };
    this.persist();
    return this.data.smmServices[idx];
  }

  public deleteSMMService(id: string): boolean {
    const initialLen = this.data.smmServices.length;
    this.data.smmServices = this.data.smmServices.filter((s) => s.id !== id);
    if (this.data.smmServices.length !== initialLen) {
      this.persist();
      return true;
    }
    return false;
  }

  public addTier(serviceId: string, tier: Omit<SMMServiceTier, 'id' | 'serviceId' | 'createdAt'>): SMMServiceTier | null {
    const service = this.data.smmServices.find((s) => s.id === serviceId);
    if (!service) return null;

    const newTier: SMMServiceTier = {
      ...tier,
      id: `tier_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      serviceId,
      createdAt: new Date().toISOString(),
    };
    service.tiers.push(newTier);
    this.persist();
    return newTier;
  }

  public updateTier(serviceId: string, tierId: string, updates: Partial<SMMServiceTier>): SMMServiceTier | null {
    const service = this.data.smmServices.find((s) => s.id === serviceId);
    if (!service) return null;

    const tierIdx = service.tiers.findIndex((t) => t.id === tierId);
    if (tierIdx === -1) return null;

    service.tiers[tierIdx] = { ...service.tiers[tierIdx], ...updates };
    this.persist();
    return service.tiers[tierIdx];
  }

  public deleteTier(serviceId: string, tierId: string): boolean {
    const service = this.data.smmServices.find((s) => s.id === serviceId);
    if (!service) return false;

    const initialLen = service.tiers.length;
    service.tiers = service.tiers.filter((t) => t.id !== tierId);
    if (service.tiers.length !== initialLen) {
      this.persist();
      return true;
    }
    return false;
  }

  // --- Reviews ---
  public getReviews(onlyVisible = true): Review[] {
    if (onlyVisible) {
      return this.data.reviews.filter((r) => r.visible);
    }
    return [...this.data.reviews];
  }

  public addReview(review: Omit<Review, 'id' | 'createdAt'>): Review {
    const newReview: Review = {
      ...review,
      id: `rev_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.data.reviews.unshift(newReview);
    this.persist();
    return newReview;
  }

  public updateReview(id: string, updates: Partial<Review>): Review | null {
    const idx = this.data.reviews.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    this.data.reviews[idx] = { ...this.data.reviews[idx], ...updates };
    this.persist();
    return this.data.reviews[idx];
  }

  public deleteReview(id: string): boolean {
    const initialLen = this.data.reviews.length;
    this.data.reviews = this.data.reviews.filter((r) => r.id !== id);
    if (this.data.reviews.length !== initialLen) {
      this.persist();
      return true;
    }
    return false;
  }

  // --- Settings ---
  public getSettings(): AppSettings {
    const s = this.data.settings;
    if (!s.smmBoostWebsites || s.smmBoostWebsites.length === 0) {
      s.smmBoostWebsites = [
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
      ];
    }
    if (!s.announcementBar) {
      s.announcementBar = {
        enabled: true,
        text: '🔥 বিশেষ অফার: বিকাশ বা নগদে অর্ডারে ১ ঘণ্টায় সুপার ফাস্ট ডেলিভারি! | যেকোনো সহায়তায় লাইভ হোয়াটসঅ্যাপ সাপোর্ট।',
        linkText: 'অর্ডার ট্র্যাক করুন →',
        linkUrl: '/track-order',
        badge: 'LIMITED OFFER',
      };
    }
    if (!s.dollarCategory) {
      s.dollarCategory = {
        enabled: true,
        dollarRate: s.usdConversionRate || 145,
        rateNote: 'সর্বশেষ লাইভ রেট আপডেট',
        virtualCard: {
          serviceName: 'International Virtual Visa Card Setup Service',
          currentPrice: 1000,
          previousPrice: 1600,
          description: 'ফেসবুক ও ইনস্টাগ্রাম অ্যাডস বুস্টিং, গুগল অ্যাডস, ক্যানভা প্রো, চ্যাটজিপিটি প্লাস ও যেকোনো আন্তর্জাতিক অনলাইন পেমেন্টের জন্য ইনস্ট্যান্ট অ্যাক্টিভেশন ডুয়েল কারেন্সি ভার্চুয়াল ভিসা কার্ড।',
          whatsapp: s.whatsapp || '01813078583',
          deliveryTime: '১০-৩০ মিনিট',
        },
      };
    }
    return { ...s };
  }

  public updateSettings(updates: Partial<AppSettings>): AppSettings {
    this.data.settings = { ...this.data.settings, ...updates };
    this.persist();
    return { ...this.data.settings };
  }

  // --- Trust Stats ---
  public getCompletedOrdersCount(): number {
    return this.data.orders.filter((o) => o.orderStatus === 'Completed').length;
  }

  // --- Admins ---
  public getAdminByEmail(email: string): AdminUser | undefined {
    return this.data.admins.find((a) => a.email.toLowerCase() === email.toLowerCase());
  }

  public getAdminById(id: string): AdminUser | undefined {
    return this.data.admins.find((a) => a.id === id);
  }

  // --- Analytics ---
  public getAnalytics() {
    const orders = this.data.orders;
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    const thisMonthStr = now.toISOString().slice(0, 7);

    let todayOrders = 0;
    let todayRevenue = 0;
    let monthOrders = 0;
    let monthRevenue = 0;

    for (const ord of orders) {
      const ordDate = ord.createdAt.slice(0, 10);
      const ordMonth = ord.createdAt.slice(0, 7);

      if (ordDate === todayStr) {
        todayOrders++;
        if (ord.paymentStatus === 'Verified' || ord.orderStatus === 'Completed') {
          todayRevenue += ord.totalAmount;
        }
      }

      if (ordMonth === thisMonthStr) {
        monthOrders++;
        if (ord.paymentStatus === 'Verified' || ord.orderStatus === 'Completed') {
          monthRevenue += ord.totalAmount;
        }
      }
    }

    return {
      today: {
        totalOrders: todayOrders,
        totalRevenue: todayRevenue,
      },
      thisMonth: {
        totalOrders: monthOrders,
        totalRevenue: monthRevenue,
      },
      totalAllOrders: orders.length,
      completedOrdersCount: this.getCompletedOrdersCount(),
    };
  }

  // --- Export CSV ---
  public exportOrdersCsv(range: 'today' | 'this_month' | 'all'): string {
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    const thisMonthStr = now.toISOString().slice(0, 7);

    let filtered = this.data.orders;
    if (range === 'today') {
      filtered = filtered.filter((o) => o.createdAt.slice(0, 10) === todayStr);
    } else if (range === 'this_month') {
      filtered = filtered.filter((o) => o.createdAt.slice(0, 7) === thisMonthStr);
    }

    const headers = [
      'Order ID',
      'Date',
      'Service',
      'Platform',
      'Customer WhatsApp',
      'Target',
      'Quantity/Budget',
      'Total',
      'Payment Method',
      'Sender',
      'Transaction ID',
      'Payment Status',
      'Order Status',
      'Order Note',
      'Rejection Reason',
    ];

    const rows = filtered.map((o) => {
      let platform = '';
      let target = '';
      let qtyOrBudget = '';

      if (o.type === 'SMM' && o.smmDetails) {
        platform = o.smmDetails.reactionType
          ? `${o.smmDetails.platform} (${o.smmDetails.serviceType}: ${o.smmDetails.reactionType})`
          : `${o.smmDetails.platform} (${o.smmDetails.serviceType})`;
        target = o.smmDetails.targetLink;
        qtyOrBudget = `${o.smmDetails.quantity}`;
      } else if (o.type === 'ADS' && o.adsDetails) {
        platform = o.adsDetails.platform;
        target = o.adsDetails.targetLink;
        qtyOrBudget = `Budget: ৳${o.adsDetails.budget}`;
      } else if (o.type === 'WEBSITE' && o.websiteDetails) {
        platform = 'Website';
        target = o.websiteDetails.businessName || o.websiteDetails.packageName;
        qtyOrBudget = `Advance: ৳${o.websiteDetails.advanceAmount}`;
      }

      return [
        o.orderId,
        new Date(o.createdAt).toLocaleString('bn-BD', { timeZone: 'Asia/Dhaka' }),
        o.type,
        platform,
        `="${o.customerWhatsapp}"`,
        `"${(target || '').replace(/"/g, '""')}"`,
        `"${qtyOrBudget.replace(/"/g, '""')}"`,
        o.totalAmount,
        o.payment?.paymentMethod || 'N/A',
        o.payment ? `="${o.payment.senderNumber}"` : 'N/A',
        o.payment ? `="${o.payment.transactionId}"` : 'N/A',
        o.paymentStatus,
        o.orderStatus,
        `"${(o.orderNote || '').replace(/"/g, '""')}"`,
        `"${(o.rejectionReason || '').replace(/"/g, '""')}"`,
      ].join(',');
    });

    return [headers.join(','), ...rows].join('\n');
  }

  // ==========================================
  // WEBSITE PACKAGES METHODS
  // ==========================================
  public getWebsitePackages(includeInactive = false): WebsitePackage[] {
    const list = includeInactive
      ? [...(this.data.websitePackages || [])]
      : (this.data.websitePackages || []).filter((p) => p.active);
    return list.sort((a, b) => {
      const orderA = a.sortOrder !== undefined ? a.sortOrder : 999;
      const orderB = b.sortOrder !== undefined ? b.sortOrder : 999;
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
  }

  public getWebsitePackageById(id: string): WebsitePackage | undefined {
    return (this.data.websitePackages || []).find((p) => p.id === id);
  }

  public addWebsitePackage(pkg: Omit<WebsitePackage, 'id' | 'createdAt' | 'updatedAt'>): WebsitePackage {
    const now = new Date().toISOString();
    const newPkg: WebsitePackage = {
      ...pkg,
      id: `wpkg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      totalPrice: Number(pkg.totalPrice) || 0,
      advanceAmount: Number(pkg.advanceAmount) || 0,
      remainingAmount: Number(pkg.remainingAmount) !== undefined ? Number(pkg.remainingAmount) : (Number(pkg.totalPrice) - Number(pkg.advanceAmount)),
      sortOrder: Number(pkg.sortOrder) || ((this.data.websitePackages?.length || 0) + 1),
      active: pkg.active !== undefined ? Boolean(pkg.active) : true,
      features: Array.isArray(pkg.features) ? pkg.features : [],
      createdAt: now,
      updatedAt: now,
    };
    if (!this.data.websitePackages) this.data.websitePackages = [];
    this.data.websitePackages.push(newPkg);
    this.persist();
    return newPkg;
  }

  public updateWebsitePackage(id: string, updates: Partial<WebsitePackage>): WebsitePackage | null {
    if (!this.data.websitePackages) this.data.websitePackages = [];
    const idx = this.data.websitePackages.findIndex((p) => p.id === id);
    if (idx === -1) return null;

    const existing = this.data.websitePackages[idx];
    const updated: WebsitePackage = {
      ...existing,
      ...updates,
      id: existing.id,
      createdAt: existing.createdAt,
      totalPrice: updates.totalPrice !== undefined ? Number(updates.totalPrice) : existing.totalPrice,
      advanceAmount: updates.advanceAmount !== undefined ? Number(updates.advanceAmount) : existing.advanceAmount,
      remainingAmount: updates.remainingAmount !== undefined ? Number(updates.remainingAmount) : existing.remainingAmount,
      sortOrder: updates.sortOrder !== undefined ? Number(updates.sortOrder) : existing.sortOrder,
      active: updates.active !== undefined ? Boolean(updates.active) : existing.active,
      features: updates.features !== undefined ? updates.features : existing.features,
      updatedAt: new Date().toISOString(),
    };

    this.data.websitePackages[idx] = updated;
    this.persist();
    return updated;
  }

  public toggleWebsitePackageActive(id: string): WebsitePackage | null {
    if (!this.data.websitePackages) this.data.websitePackages = [];
    const pkg = this.data.websitePackages.find((p) => p.id === id);
    if (!pkg) return null;
    pkg.active = !pkg.active;
    pkg.updatedAt = new Date().toISOString();
    this.persist();
    return pkg;
  }

  public deleteWebsitePackage(id: string): boolean {
    if (!this.data.websitePackages) this.data.websitePackages = [];
    const idx = this.data.websitePackages.findIndex((p) => p.id === id);
    if (idx === -1) return false;
    this.data.websitePackages.splice(idx, 1);
    this.persist();
    return true;
  }
}

export const db = new Database();
