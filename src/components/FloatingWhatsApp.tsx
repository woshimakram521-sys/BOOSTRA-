import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FloatingWhatsApp: React.FC = () => {
  const { settings } = useApp();
  const phone = settings.whatsapp || '01813078583';

  // Format international number (Bangladesh +88)
  const cleanNumber = phone.startsWith('0') ? `88${phone}` : phone;
  const prefilledMessage = encodeURIComponent(
    `হ্যালো BOOSTARA, আমি সার্ভিস সম্পর্কে বিস্তারিত জানতে চাই এবং একটি প্রশ্ন রয়েছে।`
  );
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${prefilledMessage}`;

  return (
    <aside
      aria-label="Direct WhatsApp Support"
      className="fixed bottom-6 right-6 z-50 flex items-center group focus-within:ring-2 focus-within:ring-green-400 rounded-full"
    >
      <span className="hidden sm:inline-block mr-3 px-4 py-2 rounded-2xl text-xs font-semibold clay-badge text-emerald-400 border border-emerald-500/30 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 pointer-events-none">
        সরাসরি WhatsApp Support
      </span>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="relative flex items-center justify-center w-14 h-14 rounded-2xl whatsapp-clay-orb text-white whatsapp-pulse cursor-pointer"
      >
        <MessageCircle className="w-7 h-7 fill-white/10 stroke-[2.2]" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-[#060b17] shadow-sm"></span>
        </span>
      </a>
    </aside>
  );
};
