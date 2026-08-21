import React, { useState } from 'react';
import { 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Search, 
  MessageSquare,
  ShieldAlert
} from 'lucide-react';
import { LogisticsExceptionTicket } from '../../../modules/logistics/types';

interface Props {
  tickets: LogisticsExceptionTicket[];
}

export const LogisticsExceptionsTab: React.FC<Props> = ({ tickets: initialTickets }) => {
  const [tickets, setTickets] = useState<LogisticsExceptionTicket[]>(initialTickets);

  const handleResolve = (id: string) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: 'RESOLVED_CLOSED',
              resolvedAt: new Date().toISOString(),
              actionTaken: 'Kendala telah diselesaikan oleh tim Dispatcher & Customer Care.'
            }
          : t
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <AlertOctagon className="w-6 h-6 text-rose-600" />
            Pusat Penanganan Kendala (Exceptions & Incident Resolution)
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">
            Tiket insiden operasional logistik: ban meletus, kecelakaan jalan raya, paket basah/rusak, dan keterlambatan cuaca ekstrem.
          </p>
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {tickets.map((t) => (
          <div 
            key={t.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 hover:border-rose-300 dark:hover:border-rose-800/60 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                  t.severity === 'CRITICAL'
                    ? 'bg-rose-100 dark:bg-rose-950/50 text-rose-600'
                    : 'bg-amber-100 dark:bg-amber-950/50 text-amber-600'
                }`}>
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">{t.ticketNumber}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      t.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {t.severity}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">{t.exceptionType.replace(/_/g, ' ')}</h4>
                </div>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-bold w-max ${
                t.status === 'RESOLVED_CLOSED'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                  : 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300'
              }`}>
                {t.status.replace(/_/g, ' ')}
              </span>
            </div>

            <div className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
              <strong>Deskripsi Masalah:</strong> {t.description}
            </div>

            {t.actionTaken && (
              <div className="text-xs text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/30 p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-800/40">
                <strong>Solusi Dijalankan:</strong> {t.actionTaken}
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
              <div>
                <span>Pelapor/Driver: <strong>{t.driverName}</strong></span> • <span>Terkait Resi: <strong className="font-mono text-slate-600 dark:text-slate-300">{t.connoteNumber || '-'}</strong></span>
              </div>

              {t.status !== 'RESOLVED_CLOSED' && (
                <button 
                  onClick={() => handleResolve(t.id)}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" /> Tandai Selesai & Tutup Tiket
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
