export type PlatformType = 'Facebook' | 'Instagram' | 'TikTok' | 'YouTube';

export type SMMServiceType = 'Likes' | 'Comments' | 'Reactions' | 'Followers' | 'Subscribers' | 'Views';

export type OrderType = 'SMM' | 'ADS' | 'WEBSITE';

export type OrderStatus = 'Pending' | 'In Review' | 'Completed' | 'Cancelled';

export type PaymentStatus = 'Pending' | 'Verified' | 'Cancelled';

export type PaymentMethod = 'bKash' | 'Nagad' | 'Rocket';

export interface SMMServiceTier {
  id: string;
  serviceId: string;
  tierName: string;
  ratePer1000: number;
  guaranteePeriod: string;
  active: boolean;
  createdAt: string;
}

export interface SMMService {
  id: string;
  platform: PlatformType;
  serviceType: SMMServiceType;
  minQuantity: number;
  maxQuantity: number;
  minOrderPrice: number;
  active: boolean;
  badge?: 'Featured' | 'Popular' | 'Normal';
  tiers: SMMServiceTier[];
  createdAt: string;
}

export type ReactionType = 'Like' | 'Love' | 'Care' | 'Haha' | 'Sad' | 'Angry';

export interface SMMOrderSnapshot {
  platform: PlatformType;
  serviceType: SMMServiceType;
  tierName: string;
  ratePer1000: number;
  quantity: number;
  targetLink: string;
  smmServiceFee: number;
  reactionType?: ReactionType | string;
}

export interface AdsOrderDetails {
  platform: 'Facebook/Instagram' | 'TikTok' | 'YouTube';
  targetLink: string;
  adObjective?: string;
  targetAgeRange?: string;
  gender?: string;
  location?: string;
  interests?: string;
  targetAudience?: string;
  adFormat?: string;
  budget: number;
  campaignDuration: string;
  mediaLink: string;
  serviceFee: number;
}

export interface WebsitePackage {
  id: string;
  name: string;
  totalPrice: number;
  advanceAmount: number;
  remainingAmount: number;
  description: string;
  deliveryTime: string;
  sortOrder: number;
  active: boolean;
  packageType?: 'custom_build' | 'course' | 'general';
  features?: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface WebsiteOrderDetails {
  packageId: string;
  packageName: string;
  totalPrice?: number;
  deliveryTime?: string;
  businessName?: string;
  websiteType?: string;
  preferredColor?: string;
  referenceLink?: string;
  deliveryMethod?: 'WhatsApp' | 'Email';
  advanceAmount: number;
  remainingAmount: number;
}

export interface Order {
  id: string;
  orderId: string;
  type: OrderType;
  customerWhatsapp: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  rejectionReason?: string;
  orderNote?: string;
  totalAmount: number;
  advanceAmount?: number;
  remainingAmount?: number;
  createdAt: string;
  updatedAt: string;
  smmDetails?: SMMOrderSnapshot;
  adsDetails?: AdsOrderDetails;
  websiteDetails?: WebsiteOrderDetails;
  payment?: PaymentRecord;
}

export interface PaymentRecord {
  id: string;
  orderId: string;
  paymentMethod: PaymentMethod;
  senderNumber: string;
  transactionId: string;
  paidAmount: number;
  paymentStatus: PaymentStatus;
  submittedAt: string;
}

export interface Review {
  id: string;
  customerName: string;
  reviewText: string;
  rating: number;
  screenshot?: string;
  visible: boolean;
  createdAt: string;
}

export interface SmmBoostSiteConfig {
  id: string;
  name: string;
  description: string;
  url: string;
  badge?: string;
}

export interface AnnouncementBarConfig {
  enabled: boolean;
  text: string;
  linkText?: string;
  linkUrl?: string;
  badge?: string;
}

export interface DollarCategorySettings {
  enabled: boolean;
  dollarRate: number;
  rateNote?: string;
  virtualCard: {
    serviceName: string;
    currentPrice: number;
    previousPrice: number;
    description: string;
    whatsapp: string;
    deliveryTime?: string;
  };
}

export interface AppSettings {
  siteName: string;
  whatsapp: string;
  bkash: string;
  nagad: string;
  rocket: string;
  adsMinimumBudget: number;
  adsServiceFee: number;
  smmServiceFee: number;
  usdConversionRate: number;
  deliveryMessages: {
    smm: string;
    ads: string;
    website: string;
  };
  adminNotificationEmail?: string;
  maintenanceMode?: {
    enabled: boolean;
    message: string;
    estimatedReturn?: string;
  };
  announcementBar?: AnnouncementBarConfig;
  smmBoostWebsites?: SmmBoostSiteConfig[];
  dollarCategory?: DollarCategorySettings;
}
