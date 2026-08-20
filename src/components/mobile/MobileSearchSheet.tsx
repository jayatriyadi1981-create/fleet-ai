import React, { useState, useMemo } from 'react';
import { MobileBottomSheet } from './MobileBottomSheet';
import { Search, X, Check, ArrowRight } from 'lucide-react';

export interface SearchOption {
  id: string | number;
  title: string;
  subtitle?: string;
  badge?: string;
  icon?: React.ReactNode;
}

export interface MobileSearchSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  placeholder?: string;
  options: SearchOption[];
  selectedId?: string | number;
  onSelect: (option: SearchOption) => void;
}

export const MobileSearchSheet: React.FC<MobileSearchSheetProps> = ({
  isOpen,
  onClose,
  title = 'Pilih Entitas Data',
  placeholder = 'Ketik untuk mencari armada / pengemudi...',
  options,
  selectedId,
  onSelect,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    const q = searchQuery.toLowerCase();
    return options.filter(
      (opt) =>
        opt.title.toLowerCase().includes(q) ||
        (opt.subtitle && opt.subtitle.toLowerCase().includes(q))
    );
  }, [options, searchQuery]);

  return (
    <MobileBottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      height="75vh"
    >
      <div className="space-y-3.5">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-xl bg-slate-950/90 pl-10 pr-10 py-3 text-sm text-white placeholder-slate-500 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
            autoFocus
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white p-1"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Options List */}
        <div className="space-y-1.5 max-h-[50vh] overflow-y-auto">
          {filteredOptions.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs">
              Tidak ditemukan hasil untuk "{searchQuery}"
            </div>
          ) : (
            filteredOptions.map((opt) => {
              const isSelected = selectedId !== undefined && opt.id === selectedId;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    onSelect(opt);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all min-h-[48px] ${
                    isSelected
                      ? 'border-cyan-500/40 bg-cyan-950/40 text-cyan-300 shadow-sm'
                      : 'border-slate-800/80 bg-slate-950/60 text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {opt.icon && (
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 shrink-0 text-cyan-400">
                        {opt.icon}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white truncate">
                          {opt.title}
                        </span>
                        {opt.badge && (
                          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-cyan-400 shrink-0">
                            {opt.badge}
                          </span>
                        )}
                      </div>
                      {opt.subtitle && (
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {opt.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  {isSelected ? (
                    <Check className="h-4 w-4 text-cyan-400 shrink-0 ml-2" />
                  ) : (
                    <ArrowRight className="h-3.5 w-3.5 text-slate-600 shrink-0 ml-2" />
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </MobileBottomSheet>
  );
};
