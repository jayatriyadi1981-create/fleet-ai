/**
 * Fleet Intelligence Smart AI - Subscription Audit Logs & Lifecycle Events Tab (Prompt 41)
 * Displays immutable log of plan changes, payment verifications, and quota alerts
 */

import React from 'react';
import { useSubscription } from '../../../context/SubscriptionContext';
import {
  History,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  FileText,
  Clock,
  User,
} from 'lucide-react';

export const SubscriptionEventsTab: React.FC = () => {
  const { events, planHistory } = useSubscription();

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'UPGRADED':
        return <TrendingUp className="w-4 h-4 text-emerald-600" />;
      case 'DOWNGRADED':
        return <TrendingDown className="w-4 h-4 text-amber-600" />;
      case 'PAYMENT_SUCCESS':
      case 'INVOICE_PAID':
        return <CheckCircle2 className="w-4 h-4 text-cyan-600" />;
      case 'QUOTA_WARNING':
      case 'PAYMENT_FAILED':
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      default:
        return <History className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Plan Migration History */}
      <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <History className="w-4 h-4 text-cyan-600" />
          <span>Histori Perubahan Paket Langganan</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
              <tr>
                <th className="py-2.5 px-3">Waktu Perubahan</th>
                <th className="py-2.5 px-3">Tipe Migrasi</th>
                <th className="py-2.5 px-3">Paket Asal → Tujuan</th>
                <th className="py-2.5 px-3">Dilakukan Oleh</th>
                <th className="py-2.5 px-3">Catatan / Alasan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {planHistory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60">
                  <td className="py-2.5 px-3 font-mono text-slate-500">
                    {new Date(item.effectiveDate || item.createdAt).toLocaleDateString('id-ID', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        item.action === 'UPGRADE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.action === 'DOWNGRADE'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-cyan-100 text-cyan-800'
                      }`}
                    >
                      {item.action}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">
                    {item.oldPlanName || 'Trial'} → {item.newPlanName}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">{item.performedBy.userName}</td>
                  <td className="py-2.5 px-3 text-slate-500 italic">{item.reason || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Real-Time Subscription Events Stream */}
      <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-600" />
          <span>Audit Log Lifecycle Langganan & Webhook</span>
        </h3>

        <div className="space-y-3">
          {events.map((evt) => (
            <div
              key={evt.id}
              className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3 text-xs"
            >
              <div className="p-2 bg-white rounded-lg border border-slate-200 shrink-0">
                {getEventIcon(evt.eventType)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{evt.eventType.replace(/_/g, ' ')}</span>
                  <span className="font-mono text-[11px] text-slate-500">
                    {new Date(evt.timestamp).toLocaleDateString('id-ID', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="text-slate-600 mt-0.5">{evt.details}</p>
                {evt.tenantName && (
                  <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-400" />
                    <span>Tenant: {evt.tenantName}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
