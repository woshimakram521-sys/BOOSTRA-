import React from 'react';
import {
  LayoutDashboard,
  Share2,
  Globe,
  Star,
  Settings,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAdminAuth } from '../context/AdminAuthContext';

export const AdminNav: React.FC = () => {
  const { currentPath, navigate, settings } = useApp();
  const { logout, adminUser } = useAdminAuth();

  const cleanPath = currentPath.split('?')[0];

  const adminLinks = [
    { name: 'অর্ডার ও ড্যাশবোর্ড', path: '/admin', icon: LayoutDashboard },
    { name: 'SMM সার্ভিস ও প্রাইসিং', path: '/admin/smm-services', icon: Share2 },
    { name: 'ওয়েবসাইট প্যাকেজ ও প্রাইসিং', path: '/admin/website-packages', icon: Globe },
    { name: 'কাস্টমার রিভিউ', path: '/admin/reviews', icon: Star },
    { name: 'প্ল্যাটফর্ম সেটিংস', path: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="w-full bg-[#050b1b] border-b border-[#132345] mb-8">
      {settings.maintenanceMode?.enabled && (
        <div className="bg-amber-500/15 border-b border-amber-500/30 px-4 py-2 text-center text-xs font-semibold text-amber-300 flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>মেইনটেন্যান্স মোড বর্তমানে চালু আছে — সাধারণ কাস্টমাররা মেইনটেন্যান্স পেজ দেখছে।</span>
          <button
            onClick={() => navigate('/admin/settings')}
            className="underline text-amber-200 hover:text-white cursor-pointer ml-2"
          >
            সেটিংস পরিবর্তন করুন
          </button>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {adminLinks.map((tab) => {
            const isActive = cleanPath === tab.path;
            const Icon = tab.icon;
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'btn-primary'
                    : 'bg-[#091534] text-slate-300 border border-[#132345] hover:border-[#1ac8ff] hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="text-right hidden sm:block">
            <span className="text-[11px] text-slate-400 block font-mono">
              {adminUser?.email || 'Admin'}
            </span>
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
              ● Role: Admin
            </span>
          </div>

          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-lg bg-[#091534] border border-[#132345] text-slate-300 hover:text-[#1ac8ff] text-xs flex items-center gap-1.5 cursor-pointer"
            title="Go to Live Website"
          >
            <span>সাইট দেখুন</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleLogout}
            className="p-2 px-3 rounded-lg bg-rose-950/30 border border-rose-500/40 text-rose-300 hover:bg-rose-900/40 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>লগআউট</span>
          </button>
        </div>
      </div>
    </div>
  );
};
