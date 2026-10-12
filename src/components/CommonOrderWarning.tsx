import React from 'react';
import { HelpCircle, MessageSquare } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CommonOrderWarning: React.FC = () => {
  const { settings } = useApp();
  const phone = settings.whatsapp || '01813078583';
  const cleanNumber = phone.startsWith('0') ? `88${phone}` : phone;
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(
    'হ্যালো BOOSTARA, আমি একটি সার্ভিস অর্ডার করতে চাই। কিছু প্রশ্ন রয়েছে।'
  )}`;

  return (
    <div className="p-4 sm:p-5 rounded-2xl clay-card border border-amber-500/30 text-amber-200 text-xs sm:text-sm leading-relaxed mb-6 shadow-[inset_1.5px_1.5px_3px_rgba(245,158,11,0.15),0_8px_20px_rgba(0,0,0,0.5)]">
      <div className="flex items-start gap-3.5">
        <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.2)]">
          <HelpCircle className="w-5 h-5 mt-0.5" />
        </div>
        <div className="space-y-2">
          <p>
            <span className="font-bold text-amber-300">❓ কোনো বিভ্রান্তি বা প্রশ্ন থাকলে</span>{' '}
            অর্ডার করার আগেই WhatsApp-এ আমাদের সাথে কথা বলুন — ভুল লিংক/প্ল্যাটফর্মে অর্ডার হলে সেটা সমাধান করা সম্ভব হয় না।
          </p>
          <div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors clay-badge px-3 py-1 rounded-xl border border-emerald-500/30"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              WhatsApp-এ কথা বলুন ({phone}) →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
