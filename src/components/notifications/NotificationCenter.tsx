/**
 * Fleet Intelligence Smart AI - Enterprise Header Notification Bell & Dropdown
 * PROMPT 20
 */

import React, { useState, useRef, useEffect } from 'react';
import { useFleet } from '../../context/FleetContext';
import { notificationService } from '../../modules/notifications/services/notificationService';
import { Notification } from '../../modules/notifications/types';
import {
  Bell,
  CheckCheck,
  Trash2,
  ExternalLink,
  ShieldAlert,
  AlertTriangle,
  Info,
  CheckCircle2,
  X,
  Radio,
  ChevronRight,
  Clock,
} from 'lucide-react';

export const NotificationCenter: React.FC = () => {
  const { setActiveView } = useFleet();
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Subscribe to notification updates
  const [notifications, setNotifications] = useState<Notification[]>(() =>
    notificationService.getNotifications('tenant-indonesia-logistics')
  );

  useEffect(() => {
    const refresh = () => {
      setNotifications([...notificationService.getNotifications('tenant-indonesia-logistics')]);
    };
    const unsubscribe = notificationService.subscribe(() => refresh());
    return () => unsubscribe();
  }, []);

  const unreadCount = notifications.filter((n) => n.status === 'UNREAD').length;
  const criticalCount = notifications.filter(
    (n) => (n.priority === 'CRITICAL' || n.severity === 'CRITICAL') && n.status === 'UNREAD'
  ).length;

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleMarkAllRead = () => {
    notificationService.markAllRead('tenant-indonesia-logistics');
    setNotifications([...notificationService.getNotifications('tenant-indonesia-logistics')]);
  };

  const handleMarkRead = (id: string) => {
    notificationService.markRead(id);
    setNotifications([...notificationService.getNotifications('tenant-indonesia-logistics')]);
  };

  const handleDelete = (id: string) => {
    notificationService.deleteNotification(id);
    setNotifications([...notificationService.getNotifications('tenant-indonesia-logistics')]);
  };

  const getPriorityInfo = (priority: string, severity?: string) => {
    if (priority === 'CRITICAL' || severity === 'CRITICAL') {
      return { icon: ShieldAlert, color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' };
    }
    if (priority === 'HIGH' || severity === 'HIGH') {
      return { icon: AlertTriangle, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
    }
    return { icon: Info, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' };
  };

  return (
    <div className="relative" ref={popoverRef}>
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative rounded-xl border px-2.5 py-1.5 transition-all flex items-center gap-1.5 ${
          criticalCount > 0
            ? 'border-rose-500/50 bg-rose-950/40 text-rose-300 shadow-md shadow-rose-950'
            : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700 hover:text-white'
        }`}
        title="Pusat Notifikasi System (In-App, Push, Email, WA, SMS)"
      >
        <Bell className={`h-4 w-4 ${criticalCount > 0 ? 'text-rose-400 animate-bounce' : ''}`} />

        {/* Counter Badge */}
        {unreadCount > 0 && (
          <span
            className={`flex items-center justify-center rounded-full text-[10px] font-extrabold text-white px-1.5 py-0.5 shadow-sm font-mono ${
              criticalCount > 0 ? 'bg-rose-600 animate-pulse' : 'bg-cyan-600'
            }`}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-800 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-xl z-50 space-y-3 animate-fadeIn">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                Pusat Notifikasi
              </h4>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold">
                  {unreadCount} Baru
                </span>
              )}
              {criticalCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-mono font-bold animate-pulse">
                  {criticalCount} Critical
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
                  title="Tandai Semua Sudah Dibaca"
                >
                  <CheckCheck className="h-3 w-3" />
                  <span>Tandai dibaca</span>
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* List Items */}
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                🔔 Tidak ada notifikasi saat ini.
              </div>
            ) : (
              notifications.slice(0, 6).map((notif) => {
                const info = getPriorityInfo(notif.priority, notif.severity);
                const Icon = info.icon;

                return (
                  <div
                    key={notif.id}
                    onClick={() => {
                      handleMarkRead(notif.id);
                      setIsOpen(false);
                      setActiveView('notifications');
                    }}
                    className={`group relative rounded-xl border p-3 cursor-pointer transition-all ${
                      notif.status === 'UNREAD'
                        ? 'border-slate-700 bg-slate-950 text-white font-medium shadow-sm'
                        : 'border-slate-800/60 bg-slate-950/40 text-slate-400 opacity-75'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className={`p-1.5 rounded-lg border shrink-0 ${info.color}`}>
                        <Icon className="h-3.5 w-3.5" />
                      </div>

                      <div className="flex-1 min-w-0 space-y-0.5">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold truncate text-slate-200">{notif.title}</p>
                          <span className="text-[9px] text-slate-500 font-mono shrink-0 ml-1">
                            {new Date(notif.createdAt).toLocaleTimeString('id-ID', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                          {notif.message}
                        </p>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(notif.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity"
                        title="Hapus"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer View All Link */}
          <div className="pt-2 border-t border-slate-800 text-center">
            <button
              onClick={() => {
                setIsOpen(false);
                setActiveView('notifications');
              }}
              className="w-full py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-cyan-300 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1"
            >
              <span>Lihat Semua Notifikasi (Notification Center)</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
