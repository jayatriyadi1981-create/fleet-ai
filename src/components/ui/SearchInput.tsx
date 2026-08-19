import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

export interface SearchInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onDebounceChange?: (value: string) => void;
  debounceMs?: number;
  placeholder?: string;
  className?: string;
  shortcut?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value = '',
  onChange,
  onDebounceChange,
  debounceMs = 300,
  placeholder = 'Cari armada, driver, plat nomor, lokasi...',
  className = '',
  shortcut = '⌘K',
}) => {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  useEffect(() => {
    if (!onDebounceChange) return;
    const timer = setTimeout(() => {
      onDebounceChange(internalValue);
    }, debounceMs);
    return () => clearTimeout(timer);
  }, [internalValue, onDebounceChange, debounceMs]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInternalValue(val);
    if (onChange) onChange(val);
  };

  const handleClear = () => {
    setInternalValue('');
    if (onChange) onChange('');
    if (onDebounceChange) onDebounceChange('');
  };

  return (
    <div className={`relative flex items-center w-full ${className}`}>
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
      <input
        type="text"
        value={internalValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-800 bg-slate-900/90 pl-10 pr-10 py-2 text-xs text-white placeholder-slate-500 outline-none transition-all focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
      />
      {internalValue ? (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      ) : shortcut ? (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-slate-800 bg-slate-950 px-1.5 py-0.5 text-[10px] font-mono text-slate-500 pointer-events-none">
          {shortcut}
        </span>
      ) : null}
    </div>
  );
};
