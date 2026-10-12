export interface SmmBoostWebsite {
  id: string;
  name: string;
  description: string;
  url: string;
  badge?: string;
  accent: 'purple-cyan' | 'cyan-blue' | 'purple-pink';
}

/**
 * Configure external/partner SMM Boost websites from this single place.
 * Replace placeholder URLs with actual partner URLs when ready.
 */
export const SMM_BOOST_WEBSITES: SmmBoostWebsite[] = [
  {
    id: 'smm-boost-1',
    name: 'SMM Boost Website 1',
    description: 'প্রিমিয়াম হাই-স্পিড ফলোয়ার, লাইক ও ইনস্ট্যান্ট সার্ভার সার্ভিস।',
    url: 'https://example.com/smm-boost-1',
    badge: 'Ultra Fast',
    accent: 'purple-cyan',
  },
  {
    id: 'smm-boost-2',
    name: 'SMM Boost Website 2',
    description: 'হাই রিটেনশন ভিউজ, সাবস্ক্রাইবার ও ড্রপ-ফ্রি সোশ্যাল গ্রোথ।',
    url: 'https://example.com/smm-boost-2',
    badge: 'Non-Drop',
    accent: 'cyan-blue',
  },
  {
    id: 'smm-boost-3',
    name: 'SMM Boost Website 3',
    description: 'অটোমেটেড অর্গানিক বুস্টিং ও ২৪/৭ ডেডিকেটেড সাপোর্ট সিস্টেম।',
    url: 'https://example.com/smm-boost-3',
    badge: 'Auto API',
    accent: 'purple-pink',
  },
];
