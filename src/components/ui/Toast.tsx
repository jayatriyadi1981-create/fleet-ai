import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, Sparkles, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'ai';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  addToast: (toast: { type: ToastType; title: string; message?: string; description?: string }) => void;
  showSuccess: (title: string, description?: string) => void;
  showError: (title: string, description?: string) => void;
  showWarning: (title: string, description?: string) => void;
  showInfo: (title: string, description?: string) => void;
  showAi: (title: string, description?: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (toast: Omit<ToastMessage, 'id'>) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastMessage = { ...toast, id };
      setToasts((prev) => [...prev, newToast]);

      const duration = toast.duration || 4000;
      setTimeout(() => {
        removeToast(id);
      }, duration);
    },
    [removeToast]
  );

  const addToast = useCallback(
    (opts: { type: ToastType; title: string; message?: string; description?: string }) => {
      showToast({
        type: opts.type,
        title: opts.title,
        description: opts.message || opts.description,
      });
    },
    [showToast]
  );

  const showSuccess = useCallback((title: string, description?: string) => showToast({ type: 'success', title, description }), [showToast]);
  const showError = useCallback((title: string, description?: string) => showToast({ type: 'error', title, description }), [showToast]);
  const showWarning = useCallback((title: string, description?: string) => showToast({ type: 'warning', title, description }), [showToast]);
  const showInfo = useCallback((title: string, description?: string) => showToast({ type: 'info', title, description }), [showToast]);
  const showAi = useCallback((title: string, description?: string) => showToast({ type: 'ai', title, description }), [showToast]);

  return (
    <ToastContext.Provider
      value={{ showToast, addToast, showSuccess, showError, showWarning, showInfo, showAi, removeToast }}
    >
      {children}
      {/* Toast Floating Container - elevated above mobile bottom navigation */}
      <div
        role="region"
        aria-label="Notifikasi sistem"
        className="fixed bottom-20 sm:bottom-6 right-3 sm:right-6 z-50 flex flex-col gap-2.5 max-w-sm w-[calc(100%-1.5rem)] sm:w-full pointer-events-none"
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const ToastItem: React.FC<{ toast: ToastMessage; onClose: () => void }> = ({ toast, onClose }) => {
  const icons: Record<ToastType, React.ReactNode> = {
    success: <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />,
    info: <Info className="h-5 w-5 text-sky-400 shrink-0" />,
    ai: <Sparkles className="h-5 w-5 text-purple-400 shrink-0 animate-pulse" />,
  };

  const borders: Record<ToastType, string> = {
    success: 'border-emerald-500/30 bg-slate-900/95',
    error: 'border-rose-500/30 bg-slate-900/95',
    warning: 'border-amber-500/30 bg-slate-900/95',
    info: 'border-sky-500/30 bg-slate-900/95',
    ai: 'border-purple-500/40 bg-gradient-to-r from-slate-900 to-purple-950/90',
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-auto flex items-start gap-3 rounded-2xl border p-4 shadow-2xl backdrop-blur-md animate-in slide-in-from-right duration-200 ${borders[toast.type]}`}
    >
      {icons[toast.type]}
      <div className="flex-1 space-y-0.5">
        <h4 className="text-xs font-bold text-white tracking-tight">{toast.title}</h4>
        {toast.description && <p className="text-[11px] text-slate-300 leading-snug">{toast.description}</p>}
      </div>
      <button
        onClick={onClose}
        aria-label="Tutup notifikasi"
        className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/60 transition-colors"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};
