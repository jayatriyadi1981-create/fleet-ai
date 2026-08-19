import React, { useState } from 'react';
import { Sparkles, X, ArrowRight } from 'lucide-react';
import { landingContent } from '../../config/landingContent';

export const AnnouncementBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative z-50 bg-gradient-to-r from-cyan-950 via-blue-950 to-slate-950 border-b border-cyan-500/20 px-4 py-2 text-xs font-medium text-cyan-200 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2">
        <div className="flex flex-1 items-center justify-center gap-2 text-center sm:text-left">
          <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-pulse shrink-0" />
          <span className="truncate">{landingContent.announcement.text}</span>
          <a
            href={landingContent.announcement.link}
            className="hidden sm:inline-flex items-center gap-1 font-bold text-cyan-400 hover:text-cyan-300 transition-colors ml-1"
          >
            <span>{landingContent.announcement.cta}</span>
          </a>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          title="Tutup Pengumuman"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
