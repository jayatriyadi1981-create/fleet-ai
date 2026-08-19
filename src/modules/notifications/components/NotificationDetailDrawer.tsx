/**
 * Fleet Intelligence Smart AI - Notification Detail Drawer Component
 */

import React from 'react';
import { Notification } from '../types';
import { notificationDeliveryService } from '../services/notificationDeliveryService';
import {
  X,
  Bell,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldAlert,
  AlertTriangle,
  Info,
  MapPin,
  Truck,
  User,
  PackageCheck,
  Send,
  Smartphone,
  Mail,
  MessageSquare,
  MessageCircle,
  Hash,
} from 'lucide-react';

interface NotificationDetailDrawerProps {
  notification: Notification | null;
  isOpen: boolean;
  onClose: () => void;
  onMarkRead: (id: string) => void;
  onArchive: (id: string) => void;
  onNavigateDeepLink: (url: string) => void;
}

export const NotificationDetailDrawer: React.FC<NotificationDetailDrawerProps> = ({
  notification,
  isOpen,
  onClose,
  onMarkRead,
  onArchive,
  onNavigateDeepLink,
}) => {
  if (!isOpen || !notification) return null;

  const logs = notificationDeliveryService
    .getDeliveryLogs()
    .filter((l) => l.notificationId === notification.id);

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return { label: 'CRITICAL', icon: ShieldAlert, color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' };
      case 'HIGH':
        return { label: 'HIGH', icon: AlertTriangle, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
      case 'NORMAL':
        return { label: 'NORMAL', icon: CheckCircle2, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' };
      default:
        return { label: 'LOW', icon: Info, color: 'text-slate-400 bg-slate-800 border-slate-700' };
    }
  };

  const badgeInfo = getPriorityBadge(notification.priority);
  const PriorityIcon = badgeInfo.icon;

  const getChannelIcon = (ch: string) => {
    switch (ch) {
      case 'IN_APP':
        return Bell;
      case 'PUSH':
        return Smartphone;
      case 'EMAIL':
        return Mail;
      case 'WHATSAPP':
        return MessageSquare;
      case 'SMS':
        return MessageCircle;
      default:
        return Send;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm animate-fade-in flex justify-end">
      <div className="w-full max-w-xl bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl overflow-y-auto">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${badgeInfo.color}`}>
              <PriorityIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border font-mono ${badgeInfo.color}`}>
                  {badgeInfo.label}
                </span>
                <span className="text-xs font-mono text-slate-400 uppercase">{notification.category}</span>
              </div>
              <h2 className="text-base font-bold text-white mt-1 line-clamp-1">{notification.title}</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 flex-1">
          {/* Main Message Card */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pesan Notifikasi System</p>
            <p className="text-sm text-slate-200 leading-relaxed font-medium">{notification.message}</p>

            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-900 font-mono">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                {new Date(notification.createdAt).toLocaleString('id-ID')}
              </span>
              <span className={`font-bold ${notification.status === 'READ' ? 'text-emerald-400' : 'text-amber-400'}`}>
                {notification.status}
              </span>
            </div>
          </div>

          {/* Deep Link Action Button */}
          {notification.deepLink && (
            <button
              onClick={() => {
                onClose();
                onNavigateDeepLink(notification.deepLink!);
              }}
              className="w-full py-3 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold rounded-2xl shadow-lg shadow-cyan-950 transition-all flex items-center justify-center gap-2"
            >
              <span>Buka Halaman Modul Terkait ({notification.deepLink})</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          )}

          {/* Entity & Metadata Breakdown */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Hash className="w-4 h-4 text-cyan-400" />
              Informasi Entitas Terkait
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              {notification.vehicleId && (
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase flex items-center gap-1">
                    <Truck className="w-3 h-3 text-cyan-400" />
                    Plat Nomor Armada
                  </span>
                  <span className="font-mono font-bold text-white">{notification.metadata?.vehiclePlate || 'B 1234 ABC'}</span>
                </div>
              )}

              {notification.driverId && (
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase flex items-center gap-1">
                    <User className="w-3 h-3 text-cyan-400" />
                    Pengemudi Assigned
                  </span>
                  <span className="font-bold text-white">{notification.metadata?.driverName || 'Andi'}</span>
                </div>
              )}

              {notification.deliveryId && (
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase flex items-center gap-1">
                    <PackageCheck className="w-3 h-3 text-cyan-400" />
                    No. Order Pengiriman
                  </span>
                  <span className="font-mono font-bold text-cyan-300">{notification.deliveryId}</span>
                </div>
              )}
            </div>
          </div>

          {/* Multi-Channel Delivery Status Logs */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Send className="w-4 h-4 text-emerald-400" />
                Status Pengiriman Multi-Channel
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">{notification.channels.length} Channel Dispatched</span>
            </div>

            <div className="space-y-2.5">
              {notification.channels.map((ch) => {
                const ChIcon = getChannelIcon(ch);
                const log = logs.find((l) => l.channel === ch);

                return (
                  <div key={ch} className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-slate-800 text-cyan-400 rounded-lg">
                        <ChIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-white block">{ch}</span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {log ? log.provider : 'Dispatched via Queue Worker'}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          log?.status === 'DELIVERED' || log?.status === 'READ'
                            ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                            : log?.status === 'FAILED'
                            ? 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                            : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                        }`}
                      >
                        {log?.status || 'DELIVERED'}
                      </span>
                      {log?.providerMessageId && (
                        <p className="text-[9px] text-slate-500 font-mono mt-0.5">{log.providerMessageId}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between gap-3 sticky bottom-0">
          <button
            onClick={() => {
              onMarkRead(notification.id);
              onClose();
            }}
            className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Tandai Dibaca
          </button>

          <button
            onClick={() => {
              onArchive(notification.id);
              onClose();
            }}
            className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs rounded-xl border border-slate-800 transition-colors"
          >
            Arsipkan
          </button>
        </div>
      </div>
    </div>
  );
};
