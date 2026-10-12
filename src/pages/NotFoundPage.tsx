import React from 'react';
import { Home, Search, MessageCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SEO } from '../components/SEO';

export const NotFoundPage: React.FC = () => {
  const { navigate, settings } = useApp();

  const whatsappNumber = settings.whatsapp || '01813078583';
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
  const internationalNumber = cleanNumber.startsWith('88') ? cleanNumber : `88${cleanNumber}`;
  const whatsappUrl = `https://wa.me/${internationalNumber}?text=${encodeURIComponent(
    'হ্যালো BOOSTARA সাপোর্ট, আমি ওয়েবসাইটের একটি পেজ খুঁজে পাচ্ছি না। অনুগ্রহ করে সাহায্য করবেন?'
  )}`;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 relative overflow-hidden">
      <SEO
        title="404 — Page Not Found | BOOSTARA"
        description="আপনি যে পৃষ্ঠাটি খুঁজছেন সেটি পাওয়া যায়নি। BOOSTARA হোমপেজ বা অর্ডার ট্র্যাকিং পেজে ফিরে যান।"
        noindex={true}
      />

      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-[#8b3dff]/15 to-[#1ac8ff]/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="glass-card max-w-lg w-full p-8 sm:p-12 rounded-3xl border border-[#132345] shadow-2xl text-center relative z-10">
        {/* Brand Stamp */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#050b1c] border border-[#132345] text-[11px] font-semibold text-slate-400 mb-6 uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1ac8ff]" />
          <span>{settings.siteName || 'BOOSTARA'} Error 404</span>
        </div>

        {/* 404 Big Gradient Number */}
        <div className="relative mb-4">
          <h1 className="text-7xl sm:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#8b3dff] via-[#1ac8ff] to-[#8b3dff] drop-shadow-[0_0_35px_rgba(26,200,255,0.3)]">
            404
          </h1>
        </div>

        {/* Heading */}
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
          404 — Page Not Found
        </h2>

        {/* Friendly Message */}
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm mx-auto mb-8 font-normal">
          দুঃখিত, আপনি যে পাতাটি খুঁজছেন তা পাওয়া যায়নি অথবা স্থানান্তর করা হয়েছে। অনুগ্রহ করে সঠিক ইউআরএল পরীক্ষা করুন।
        </p>

        {/* Navigation Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
          <button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-full text-xs sm:text-sm font-bold btn-primary flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
          >
            <Home className="w-4 h-4" />
            <span>হোমে ফিরে যান</span>
          </button>

          <button
            onClick={() => navigate('/track-order')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-full text-xs sm:text-sm font-bold bg-[#050b1c] text-[#1ac8ff] border border-[#132345] hover:border-[#1ac8ff]/50 hover:bg-[#091534] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>অর্ডার ট্র্যাকিং</span>
          </button>
        </div>

        {/* WhatsApp Support Button */}
        <div className="pt-6 border-t border-[#132345]/70">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>কোনো সমস্যা হলে সরাসরি WhatsApp সাপোর্ট নিন</span>
          </a>
        </div>
      </div>
    </div>
  );
};
