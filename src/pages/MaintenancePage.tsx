import React from 'react';
import { Wrench, MessageCircle, Clock, ShieldCheck, ArrowRight, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SEO } from '../components/SEO';

export const MaintenancePage: React.FC = () => {
  const { settings, navigate } = useApp();

  const maintenance = settings.maintenanceMode || {
    enabled: true,
    message: 'আমরা বর্তমানে কিছু গুরুত্বপূর্ণ আপডেট করছি। খুব শীঘ্রই BOOSTARA আবার সম্পূর্ণভাবে চালু হবে।',
    estimatedReturn: '',
  };

  const whatsappNumber = settings.whatsapp || '01813078583';
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
  const internationalNumber = cleanNumber.startsWith('88') ? cleanNumber : `88${cleanNumber}`;
  const whatsappUrl = `https://wa.me/${internationalNumber}?text=${encodeURIComponent(
    'হ্যালো BOOSTARA সাপোর্ট, আমি ওয়েবসাইট মেইনটেন্যান্স সম্পর্কিত তথ্য বা জরুরি সার্ভিসের জন্য যোগাযোগ করছি।'
  )}`;

  return (
    <div className="min-h-screen bg-[#030817] flex flex-col justify-between relative overflow-hidden select-none">
      <SEO
        title="সিস্টেম রক্ষণাবেক্ষণ — BOOSTARA (Maintenance Mode)"
        description="BOOSTARA প্ল্যাটফর্মে বর্তমানে জরুরি সিস্টেম আপগ্রেড চলছে। খুব শীঘ্রই আমরা সম্পূর্ণ গতিতে ফিরে আসছি।"
        noindex={true}
      />

      {/* Background radial neon effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#8b3dff]/15 to-[#1ac8ff]/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Header Bar */}
      <header className="w-full border-b border-[#132345] bg-[#050b1b]/80 backdrop-blur-xl px-6 py-4 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#8b3dff] to-[#1ac8ff] p-0.5 shadow-md shadow-[#8b3dff]/20">
            <div className="w-full h-full bg-[#050b1b] rounded-[10px] flex items-center justify-center">
              <Wrench className="w-4 h-4 text-[#1ac8ff]" />
            </div>
          </div>
          <div>
            <span className="text-xl font-black text-gradient tracking-wider block">
              {settings.siteName || 'BOOSTARA'}
            </span>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold block">
              Maintenance Mode
            </span>
          </div>
        </div>

        <button
          onClick={() => navigate('/admin/login')}
          className="text-xs text-slate-400 hover:text-[#1ac8ff] flex items-center gap-1.5 transition-colors cursor-pointer px-3 py-1.5 rounded-lg border border-[#132345] hover:border-[#1ac8ff]/40"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>অ্যাডমিন প্রবেশ</span>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 relative z-10 my-10">
        <div className="glass-card max-w-xl w-full p-8 sm:p-12 rounded-3xl border border-[#132345] shadow-2xl text-center relative overflow-hidden">
          {/* Subtle top glowing accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8b3dff] via-[#1ac8ff] to-[#8b3dff]" />

          {/* Animated Maintenance Icon */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#8b3dff]/20 to-[#1ac8ff]/20 border border-[#1ac8ff]/40 mx-auto flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(26,200,255,0.25)]">
            <Wrench className="w-10 h-10 text-[#1ac8ff] animate-pulse" />
          </div>

          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#091534] border border-[#1ac8ff]/30 text-[#1ac8ff] text-xs font-semibold uppercase tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-[#1ac8ff] animate-ping" />
            <span>সিস্টেম আপগ্রেড চলছে</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white mb-4 leading-tight">
            আমরা শীঘ্রই <span className="text-gradient">ফিরে আসছি</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6 font-normal">
            {maintenance.message ||
              'আমরা বর্তমানে কিছু গুরুত্বপূর্ণ আপডেট করছি। খুব শীঘ্রই BOOSTARA আবার সম্পূর্ণভাবে চালু হবে।'}
          </p>

          {/* Optional Estimated Return Message */}
          {maintenance.estimatedReturn && maintenance.estimatedReturn.trim() !== '' && (
            <div className="mb-8 p-4 rounded-2xl bg-[#050b1c] border border-[#132345] flex items-center justify-center gap-3 text-xs sm:text-sm text-cyan-300">
              <Clock className="w-4 h-4 text-[#1ac8ff] shrink-0" />
              <span>
                <strong>আনুমানিক সময়:</strong> {maintenance.estimatedReturn}
              </span>
            </div>
          )}

          {/* Direct WhatsApp Support */}
          <div className="pt-2 border-t border-[#132345]/60 flex flex-col gap-3">
            <p className="text-xs text-slate-400">
              জরুরি কোনো অর্ডার বা সেবা সম্পর্কিত তথ্যের জন্য সরাসরি যোগাযোগ করুন:
            </p>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 text-sm font-bold btn-primary flex items-center justify-center gap-2.5 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 text-white" />
              <span>সরাসরি WhatsApp সাপোর্ট ({whatsappNumber})</span>
            </a>
          </div>
        </div>
      </main>

      {/* Footer Notice */}
      <footer className="w-full py-6 text-center text-xs text-slate-500 border-t border-[#132345]/60 relative z-10">
        <p>© {new Date().getFullYear()} BOOSTARA. All Rights Reserved. আপনার পূর্ববর্তী সকল অর্ডার নিরাপদে সংরক্ষিত আছে।</p>
      </footer>
    </div>
  );
};
