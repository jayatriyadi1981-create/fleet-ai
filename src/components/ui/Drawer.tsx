import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: string;
  children: React.ReactNode;
  position?: 'right' | 'left';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  position = 'right',
  size = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeStyles = {
    sm: 'max-w-xs',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
  };

  const positionStyles = position === 'right' ? 'right-0' : 'left-0';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div
        className={`fixed inset-y-0 ${positionStyles} z-10 flex w-full ${sizeStyles[size]} flex-col border-l border-slate-800 bg-slate-900 shadow-2xl shadow-slate-950`}
      >
        {/* Drawer Header */}
        {(title || description) && (
          <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
            <div>
              {title && <h3 className="text-base font-bold text-white">{title}</h3>}
              {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">{children}</div>
      </div>
    </div>
  );
};

export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/80 backdrop-blur-sm sm:hidden">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative z-10 w-full rounded-t-3xl border-t border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
        <div className="mx-auto h-1.5 w-12 rounded-full bg-slate-700 mb-2" />
        {title && (
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white">{title}</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        <div>{children}</div>
      </div>
    </div>
  );
};
