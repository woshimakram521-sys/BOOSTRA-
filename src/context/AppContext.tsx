import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { AppSettings } from '../types';
import { api } from '../services/api';
import { ToastContainer, ToastMessage } from '../components/Toast';

interface AppContextType {
  settings: AppSettings;
  currentPath: string;
  navigate: (path: string) => void;
  completedOrdersCount: number;
  refreshSettings: () => Promise<void>;
  refreshStats: () => Promise<void>;
  isLoading: boolean;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const defaultSettings: AppSettings = {
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
};

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [completedOrdersCount, setCompletedOrdersCount] = useState<number>(0);
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname + window.location.search);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastMessage = { id, message, type };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const refreshSettings = async () => {
    try {
      const data = await api.getSettings();
      setSettings(data);
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  };

  const refreshStats = async () => {
    try {
      const data = await api.getTrustStats();
      setCompletedOrdersCount(data.completedOrdersCount);
    } catch (err) {
      console.error('Failed to load trust stats:', err);
    }
  };

  useEffect(() => {
    Promise.all([refreshSettings(), refreshStats()]).finally(() => {
      setIsLoading(false);
    });

    const handlePopState = () => {
      setCurrentPath(window.location.pathname + window.location.search);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (path !== currentPath) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <AppContext.Provider
      value={{
        settings,
        currentPath,
        navigate,
        completedOrdersCount,
        refreshSettings,
        refreshStats,
        isLoading,
        showToast,
      }}
    >
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
