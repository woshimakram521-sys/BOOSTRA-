import React, { useState } from 'react';
import { Shield, Lock, Mail, AlertTriangle, ArrowRight } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useApp } from '../../context/AppContext';

export const AdminLoginPage: React.FC = () => {
  const { login } = useAdminAuth();
  const { navigate, settings } = useApp();
  const [email, setEmail] = useState('mdmohammad.644633815@gmail.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      await login(email.trim(), password);
      navigate('/admin');
    } catch (err: any) {
      setErrorMsg(err.message || 'ভুল ইমেল বা পাসওয়ার্ড।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Glow */}
        <div className="text-center mb-8 relative">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#8b3dff] to-[#1ac8ff] flex items-center justify-center mx-auto mb-4 p-[2px] shadow-[inset_1.5px_2px_3px_rgba(255,255,255,0.45),inset_-2px_-3px_5px_rgba(0,0,0,0.4),0_8px_20px_rgba(139,61,255,0.5)]">
            <div className="w-full h-full bg-[#050b1b] rounded-[14px] flex items-center justify-center shadow-[inset_2px_2px_4px_rgba(0,0,0,0.7)]">
              <Shield className="w-7 h-7 text-[#1ac8ff]" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white drop-shadow-md">
            {settings.siteName || 'BOOSTARA'} <span className="text-gradient">Admin Portal</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            ম্যানেজমেন্ট ড্যাশবোর্ডে প্রবেশ করতে সিকিউর ক্রেডেনশিয়াল দিন।
          </p>
        </div>

        <div className="clay-card-elevated p-6 sm:p-8 rounded-3xl border border-white/[0.08] relative">
          {errorMsg && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs sm:text-sm flex items-center gap-3 mb-6 shadow-[inset_1px_1px_2px_rgba(244,63,94,0.2)]">
              <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                অ্যাডমিন ইমেল (Email)
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full clay-input px-4 py-3 pl-10 text-xs sm:text-sm font-mono"
                  required
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                পাসওয়ার্ড (Password)
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full clay-input px-4 py-3 pl-10 text-xs sm:text-sm font-mono"
                  required
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 text-xs sm:text-sm font-bold clay-btn-primary flex items-center justify-center gap-2 cursor-pointer mt-6 rounded-2xl"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>লগইন হচ্ছে...</span>
                </>
              ) : (
                <>
                  <span>লগইন করুন (Secure Sign In)</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#132345] text-center">
            <button
              onClick={() => navigate('/')}
              className="text-xs text-slate-400 hover:text-[#1ac8ff] transition-colors cursor-pointer"
            >
              ← মূল ওয়েবসাইটে ফিরে যান
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
