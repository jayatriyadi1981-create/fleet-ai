import React, { useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { Button } from './Button';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnBackdrop?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  closeOnBackdrop = true,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeStyles = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-6xl w-full',
  };

  const titleId = `modal-title-${Math.random().toString(36).substring(2, 9)}`;
  const descId = `modal-desc-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={description ? descId : undefined}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        className="fixed inset-0"
        onClick={() => closeOnBackdrop && onClose()}
        aria-hidden="true"
      />

      <div
        className={`relative z-10 w-full rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl shadow-slate-950/90 overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[90vh] ${sizeStyles[size]}`}
      >
        {/* Header */}
        {(title || description) && (
          <div className="flex items-start justify-between border-b border-slate-800 px-5 sm:px-6 py-4">
            <div>
              {title && <h3 id={titleId} className="text-base font-bold text-white tracking-tight">{title}</h3>}
              {description && <p id={descId} className="text-xs text-slate-400 mt-0.5 leading-relaxed">{description}</p>}
            </div>
            <button
              onClick={onClose}
              aria-label="Tutup modal"
              className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">{children}</div>

        {/* Footer */}
        {footer && <div className="border-t border-slate-800 bg-slate-950/70 px-5 sm:px-6 py-3.5 sm:py-4 flex flex-wrap items-center justify-end gap-2.5 sm:gap-3">{footer}</div>}
      </div>
    </div>
  );
};

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'primary';
  isLoading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Konfirmasi',
  cancelText = 'Batal',
  variant = 'danger',
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="flex items-start gap-4">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
            variant === 'danger'
              ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
          }`}
        >
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white">{title}</h3>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">{description}</p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-800 pt-4">
        <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
          {cancelText}
        </Button>
        <Button
          variant={variant === 'danger' ? 'destructive' : 'primary'}
          size="sm"
          onClick={onConfirm}
          isLoading={isLoading}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
};
