import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';

export interface DropdownMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  destructive?: boolean;
  onClick: () => void;
}

export interface DropdownMenuProps {
  trigger?: React.ReactNode;
  items: DropdownMenuItem[];
  align?: 'left' | 'right';
  className?: string;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  trigger,
  items,
  align = 'right',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const alignStyles = align === 'right' ? 'right-0' : 'left-0';

  return (
    <div ref={ref} className={`relative inline-block text-left ${className}`}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger || (
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
        )}
      </div>

      {isOpen && (
        <div
          className={`absolute ${alignStyles} z-50 mt-1.5 w-48 rounded-xl border border-slate-800 bg-slate-900/95 p-1 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150`}
        >
          {items.map((item) => (
            <button
              key={item.id}
              disabled={item.disabled}
              onClick={() => {
                if (!item.disabled) {
                  item.onClick();
                  setIsOpen(false);
                }
              }}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                item.destructive
                  ? 'text-rose-400 hover:bg-rose-500/10'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
