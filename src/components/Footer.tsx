import React from 'react';
import {
  Zap,
  MessageCircle,
  ShieldCheck,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { settings, navigate } = useApp();
  const phone = settings.whatsapp || '01813078583';
  const cleanPhone = phone.startsWith('0') ? `88${phone}` : phone;

  return (
    <footer className="w-full bg-[#080e1c] border-t border-white/[0.06] pt-14 pb-12 mt-20 relative overflow-hidden shadow-[inset_0_8px_20px_rgba(0,0,0,0.8)]">
      {/* Background glow decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-r from-[#8b3dff]/10 via-[#1ac8ff]/10 to-[#8b3dff]/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#8b3dff] to-[#1ac8ff] flex items-center justify-center p-[2px] shadow-[inset_1.5px_2px_3px_rgba(255,255,255,0.45),inset_-2px_-3px_5px_rgba(0,0,0,0.4),0_6px_16px_rgba(139,61,255,0.4)]">
                <div className="w-full h-full bg-[#0b1226] rounded-[13px] flex items-center justify-center">
                  <Zap className="w-4 h-4 text-[#1ac8ff]" />
                </div>
              </div>
              <span className="text-xl font-black tracking-wider text-gradient">
                {settings.siteName || 'BOOSTARA'}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              বাংলাদেশের সবথেকে নির্ভরযোগ্য ডিজিটাল গ্রোথ প্ল্যাটফর্ম। দ্রুত ডেলিভারি, রিয়েল টাইম ট্র্যাকিং ও ইনস্ট্যান্ট WhatsApp সাপোর্ট।
            </p>
            <div className="pt-2">
              <a
                href={`https://wa.me/${cleanPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl clay-btn-secondary text-emerald-400 text-xs font-semibold hover:text-emerald-300 transition-all border border-emerald-500/20"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp: {phone}</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              সার্ভিসসমূহ
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => navigate('/smm')}
                  className="hover:text-[#1ac8ff] transition-colors cursor-pointer"
                >
                  SMM Panel (Likes, Followers, Views)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/ads')}
                  className="hover:text-[#1ac8ff] transition-colors cursor-pointer"
                >
                  Ads Boost (FB, TikTok, YouTube)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/website')}
                  className="hover:text-[#1ac8ff] transition-colors cursor-pointer"
                >
                  Website Building (শপ ও বিজনেস সাইট)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/dollar')}
                  className="hover:text-[#1ac8ff] transition-colors cursor-pointer text-emerald-400 font-medium"
                >
                  Dollar & Virtual Card (ডলার রেট ও কার্ড)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/track-order')}
                  className="hover:text-[#1ac8ff] transition-colors cursor-pointer"
                >
                  Track Order (অর্ডার ট্র্যাকিং)
                </button>
              </li>
            </ul>
          </div>

          {/* Policy & Help */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              সহায়তা ও পলিসি
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => navigate('/faq')}
                  className="hover:text-[#1ac8ff] transition-colors cursor-pointer"
                >
                  FAQ (সাধারণ প্রশ্নোত্তর)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/terms')}
                  className="hover:text-[#1ac8ff] transition-colors cursor-pointer"
                >
                  Terms & Conditions (নিয়মাবলী)
                </button>
              </li>
              <li>
                <a
                  href={`https://wa.me/${cleanPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1"
                >
                  <span>সরাসরি হেল্পলাইন</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <button
                  onClick={() => navigate('/admin/login')}
                  className="hover:text-purple-400 transition-colors text-slate-500 cursor-pointer"
                >
                  Admin Portal Login
                </button>
              </li>
            </ul>
          </div>

          {/* Payment Trust Badges */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              নিরাপদ পেমেন্ট মেথড
            </h4>
            <p className="text-xs text-slate-400">
              আমরা শুধুমাত্র নিরাপদ পার্সোনাল পেমেন্ট গ্রহণ করি।
            </p>
            <div className="grid grid-cols-3 gap-2.5 pt-1">
              {/* bKash */}
              <div className="flex flex-col items-center justify-center p-2.5 rounded-xl clay-card border border-pink-500/20">
                <span className="text-xs font-bold text-pink-400">bKash</span>
                <span className="text-[10px] text-slate-400">Personal</span>
              </div>
              {/* Nagad */}
              <div className="flex flex-col items-center justify-center p-2.5 rounded-xl clay-card border border-amber-500/20">
                <span className="text-xs font-bold text-amber-400">Nagad</span>
                <span className="text-[10px] text-slate-400">Personal</span>
              </div>
              {/* Rocket */}
              <div className="flex flex-col items-center justify-center p-2.5 rounded-xl clay-card border border-purple-500/20">
                <span className="text-xs font-bold text-purple-400">Rocket</span>
                <span className="text-[10px] text-slate-400">Personal</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400/90 pt-1">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>১০০% নিরাপদ ও ম্যানুয়াল ভেরিফিকেশন</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} BOOSTARA. সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              <CheckCircle className="w-3.5 h-3.5 text-[#1ac8ff]" />
              Guest Checkout Enabled
            </span>
            <span>•</span>
            <span>WhatsApp: {phone}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
