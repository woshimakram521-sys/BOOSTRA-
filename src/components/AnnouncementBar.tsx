import React, { useState } from 'react';
import { Sparkles, ArrowRight, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AnnouncementBar: React.FC = () => {
  const { settings, navigate } = useApp();
  const [dismissed, setDismissed] = useState(false);

  const config = settings.announcementBar;

  if (!config || !config.enabled || !config.text || dismissed) {
    return null;
  }

  const handleLinkClick = () => {
    if (!config.linkUrl) return;
    if (config.linkUrl.startsWith('http')) {
      window.open(config.linkUrl, '_blank', 'noopener,noreferrer');
    } else {
      navigate(config.linkUrl);
    }
  };

  return (
    <div className="relative z-50 bg-gradient-to-r from-[#091534] via-[#0b1c44] to-[#091534] border-b border-[#1ac8ff]/30 text-white text-[11px] sm:text-xs py-1.5 px-3 sm:px-6 shadow-[0_0_15px_rgba(26,200,255,0.15)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        <div className="flex-1 flex items-center justify-center flex-wrap gap-1.5 sm:gap-2 text-center">
          {config.badge && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-[#8b3dff] to-[#1ac8ff] text-[9px] font-black uppercase tracking-wider text-white shadow-sm shrink-0">
              <Sparkles className="w-2.5 h-2.5" />
              <span>{config.badge}</span>
            </span>
          )}

          <span className="text-slate-200 font-medium leading-snug">
            {config.text}
          </span>

          {config.linkText && config.linkUrl && (
            <button
              onClick={handleLinkClick}
              className="inline-flex items-center gap-0.5 font-bold text-[#1ac8ff] hover:text-white underline underline-offset-2 ml-1 cursor-pointer transition-colors"
            >
              <span>{config.linkText}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="text-slate-400 hover:text-white p-0.5 rounded transition-colors cursor-pointer shrink-0"
          aria-label="Close Announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
