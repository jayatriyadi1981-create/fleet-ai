import React, { useEffect, useRef } from 'react';
import { X, Minus } from 'lucide-react';

export type BottomSheetHeight = 'fit' | '50vh' | '75vh' | '90vh' | 'full';

export interface MobileBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  height?: BottomSheetHeight;
  children: React.ReactNode;
  footer?: React.ReactNode;
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
  className?: string;
}

export const MobileBottomSheet: React.FC<MobileBottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  height = 'fit',
  children,
  footer,
  showCloseButton = true,
  closeOnBackdrop = true,
  className = '',
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number>(0);
  const currentTranslateY = useRef<number>(0);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const heightClasses: Record<BottomSheetHeight, string> = {
    fit: 'max-h-[85vh] h-auto',
    '50vh': 'h-[50vh]',
    '75vh': 'h-[75vh]',
    '90vh': 'h-[90vh]',
    full: 'h-[100dvh] max-h-[100dvh] rounded-none',
  };

  // Swipe down gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touchCurrentY = e.touches[0].clientY;
    const diff = touchCurrentY - touchStartY.current;
    if (diff > 0 && sheetRef.current) {
      currentTranslateY.current = diff;
      sheetRef.current.style.transform = `translateY(${diff}px)`;
    }
  };

  const handleTouchEnd = () => {
    if (currentTranslateY.current > 120) {
      onClose();
    }
    if (sheetRef.current) {
      sheetRef.current.style.transform = '';
    }
    currentTranslateY.current = 0;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title || 'Panel Mobile Bottom Sheet'}
      className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 cursor-pointer"
        onClick={() => closeOnBackdrop && onClose()}
        aria-hidden="true"
      />

      {/* Sheet Container */}
      <div
        ref={sheetRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`relative z-10 w-full rounded-t-3xl border-t border-x border-slate-800 bg-slate-900 shadow-2xl shadow-slate-950/95 flex flex-col overflow-hidden transition-transform duration-150 ease-out pb-[max(env(safe-area-inset-bottom),0.75rem)] ${heightClasses[height]} ${className}`}
      >
        {/* Drag Handle Bar */}
        <div className="w-full flex items-center justify-center pt-2.5 pb-1 shrink-0 cursor-grab active:cursor-grabbing">
          <div className="h-1.5 w-12 rounded-full bg-slate-700/80" />
        </div>

        {/* Fixed Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800/80 shrink-0">
            <div className="space-y-0.5 pr-3">
              {title && (
                <h3 className="text-base font-bold text-white tracking-tight leading-snug">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs text-slate-400 leading-normal">{subtitle}</p>
              )}
            </div>

            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Tutup bottom sheet"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors focus:ring-2 focus:ring-cyan-500 focus:outline-none shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 overscroll-contain">
          {children}
        </div>

        {/* Fixed Footer Actions */}
        {footer && (
          <div className="border-t border-slate-800 bg-slate-950/90 px-5 py-3.5 shrink-0 flex items-center justify-end gap-3 shadow-lg">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
