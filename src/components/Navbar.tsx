import React, { useState } from 'react';
import {
  Zap,
  Menu,
  X,
  Share2,
  TrendingUp,
  Globe,
  Search,
  HelpCircle,
  Shield,
  ShieldCheck,
  UserCheck,
  DollarSign,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAdminAuth } from '../context/AdminAuthContext';

export const Navbar: React.FC = () => {
  const { currentPath, navigate, settings } = useApp();
  const { isAdminAuthenticated } = useAdminAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cleanPath = currentPath.split('?')[0];

  const navLinks = [
    { name: 'Home', path: '/', icon: Zap },
    { name: 'SMM Panel', path: '/smm', icon: Share2 },
    { name: 'Ads Boost', path: '/ads', icon: TrendingUp },
    { name: 'Website Building', path: '/website', icon: Globe },
    { name: 'Dollar', path: '/dollar', icon: DollarSign, badge: 'New' },
    { name: 'Track Order', path: '/track-order', icon: Search },
    { name: 'FAQ', path: '/faq', icon: HelpCircle },
    { name: 'Terms', path: '/terms', icon: Shield },
  ];

  const handleNav = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0a1124]/92 backdrop-blur-xl border-b border-white/[0.07] shadow-[0_12px_32px_-6px_rgba(0,0,0,0.7)] transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => handleNav('/')}
          className="flex items-center gap-3.5 group text-left cursor-pointer focus:outline-none"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#8b3dff] via-[#6d28d9] to-[#1ac8ff] flex items-center justify-center p-[2px] shadow-[inset_1.5px_2px_3px_rgba(255,255,255,0.45),inset_-2px_-3px_5px_rgba(0,0,0,0.4),0_8px_20px_-3px_rgba(139,61,255,0.5)] group-hover:scale-105 transition-all duration-300">
            <div className="w-full h-full bg-[#0b1226] rounded-[14px] flex items-center justify-center shadow-[inset_2px_2px_4px_rgba(0,0,0,0.7),inset_-1px_-1px_2px_rgba(255,255,255,0.1)]">
              <Zap className="w-5 h-5 text-[#1ac8ff] fill-[#1ac8ff]/25 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-black tracking-wider text-gradient block drop-shadow-sm">
              {settings.siteName || 'BOOSTARA'}
            </span>
            <span className="text-[10px] tracking-widest uppercase text-slate-400 font-bold block -mt-0.5">
              Social Growth Engine
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#070d1a] border border-white/[0.04] shadow-[inset_2px_3px_5px_rgba(0,0,0,0.7),inset_-1px_-1px_2px_rgba(255,255,255,0.04)]">
          {navLinks.map((link) => {
            const isActive = cleanPath === link.path;
            const Icon = link.icon;
            return (
              <button
                key={link.path}
                onClick={() => handleNav(link.path)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-b from-[#1c2b4c] to-[#101b34] text-[#1ac8ff] border border-cyan-400/30 shadow-[inset_1.5px_1.5px_2px_rgba(255,255,255,0.15),inset_-2px_-2px_4px_rgba(0,0,0,0.6),0_4px_12px_rgba(26,200,255,0.25)]'
                    : 'text-slate-300 hover:text-white hover:bg-[#121c33] border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#1ac8ff]' : 'text-slate-400'}`} />
                <span>{link.name}</span>
                {link.badge && (
                  <span className="px-1.5 py-0.2 rounded-md text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase shadow-[inset_1px_1px_2px_rgba(255,255,255,0.2)]">
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Actions (Admin indicator / CTA) */}
        <div className="hidden sm:flex items-center gap-3">
          {isAdminAuthenticated ? (
            <button
              onClick={() => handleNav('/admin')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                cleanPath.startsWith('/admin')
                  ? 'clay-btn-primary'
                  : 'clay-btn-secondary text-purple-300 border-purple-500/30'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Admin Panel</span>
            </button>
          ) : (
            <button
              onClick={() => handleNav('/smm')}
              className="px-5 py-2.5 text-xs font-bold clay-btn-primary tracking-wide cursor-pointer"
            >
              Order Now
            </button>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2.5 rounded-xl bg-[#0e172a] border border-white/[0.08] text-slate-300 hover:text-white cursor-pointer shadow-[inset_1.5px_1.5px_3px_rgba(255,255,255,0.08),inset_-2px_-3px_5px_rgba(0,0,0,0.6),0_4px_10px_rgba(0,0,0,0.4)]"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/[0.06] bg-[#091022]/98 backdrop-blur-2xl px-4 pt-3 pb-6 animate-in slide-in-from-top-4 duration-200 shadow-[0_18px_36px_rgba(0,0,0,0.8)]">
          <div className="space-y-2">
            {navLinks.map((link) => {
              const isActive = cleanPath === link.path;
              const Icon = link.icon;
              return (
                <button
                  key={link.path}
                  onClick={() => handleNav(link.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#1c2c4f] to-[#121c35] text-[#1ac8ff] border border-cyan-400/40 font-semibold shadow-[inset_1.5px_1.5px_2px_rgba(255,255,255,0.15),inset_-2px_-2px_4px_rgba(0,0,0,0.6)]'
                      : 'text-slate-300 hover:bg-[#121b33] border border-transparent'
                  }`}
                >
                  <Icon className="w-4 h-4 text-slate-400" />
                  <span className="flex-1">{link.name}</span>
                  {link.badge && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase">
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}

            <div className="pt-4 mt-2 border-t border-white/[0.06] flex flex-col gap-2">
              {isAdminAuthenticated ? (
                <button
                  onClick={() => handleNav('/admin')}
                  className="w-full py-3 clay-btn-primary text-center text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin Dashboard</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => handleNav('/smm')}
                    className="w-full py-3 clay-btn-primary text-center text-sm font-bold cursor-pointer"
                  >
                    Start SMM Order
                  </button>
                  <button
                    onClick={() => handleNav('/admin/login')}
                    className="w-full py-2.5 text-center text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    Admin Login
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
