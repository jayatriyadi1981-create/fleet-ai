/**
 * Fleet Intelligence Smart AI - Notification Center Tab Component
 */

import React, { useState } from 'react';
import { Notification, NotificationPriority, NotificationCategory } from '../types';
import { notificationAIService } from '../services/notificationAIService';
import {
  Bell,
  CheckCheck,
  Search,
  Filter,
  ShieldAlert,
  AlertTriangle,
  Info,
  CheckCircle2,
  Trash2,
  Archive,
  ExternalLink,
  Sparkles,
  Bot,
  Sliders,
  X,
} from 'lucide-react';

interface NotificationCenterTabProps {
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onMarkUnread: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  onMarkAllRead: () => void;
  onSelectNotification: (notification: Notification) => void;
  onNavigateDeepLink: (url: string) => void;
}

export const NotificationCenterTab: React.FC<NotificationCenterTabProps> = ({
  notifications,
  onMarkRead,
  onMarkUnread,
  onArchive,
  onDelete,
  onMarkAllRead,
  onSelectNotification,
  onNavigateDeepLink,
}) => {
  const [subTab, setSubTab] = useState<'ALL' | 'UNREAD' | 'CRITICAL' | 'SYSTEM' | 'MENTIONS'>('ALL');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // AI Summary
  const aiSummary = notificationAIService.summarizeNotifications(notifications);

  // Filtering
  const filtered = notifications.filter((n) => {
    // SubTab Filter
    if (subTab === 'UNREAD' && n.status !== 'UNREAD') return false;
    if (subTab === 'CRITICAL' && n.priority !== 'CRITICAL' && n.severity !== 'CRITICAL') return false;
    if (subTab === 'SYSTEM' && n.category !== 'SYSTEM') return false;
    if (subTab === 'MENTIONS' && (n.category as string) !== 'MENTION' && !n.title.toLowerCase().includes('mention')) return false;

    // Search
    const matchesSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.message.toLowerCase().includes(search.toLowerCase()) ||
      (n.metadata?.vehiclePlate && n.metadata.vehiclePlate.toLowerCase().includes(search.toLowerCase()));

    // Category
    const matchesCat = selectedCategory === 'ALL' || n.category === selectedCategory;

    // Priority
    const matchesPri = selectedPriority === 'ALL' || n.priority === selectedPriority;

    return matchesSearch && matchesCat && matchesPri;
  });

  // Bulk Selection Handlers
  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((f) => f.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkMarkRead = () => {
    selectedIds.forEach((id) => onMarkRead(id));
    setSelectedIds([]);
  };

  const handleBulkArchive = () => {
    selectedIds.forEach((id) => onArchive(id));
    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    selectedIds.forEach((id) => onDelete(id));
    setSelectedIds([]);
  };

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

  return (
    <div className="space-y-6">
      {/* AI Intelligence Summary Banner */}
      <div className="bg-gradient-to-r from-cyan-950/80 via-slate-900 to-slate-950 border border-cyan-500/30 rounded-3xl p-5 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 rounded-2xl">
              <Bot className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-cyan-600 text-slate-950 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  AI Notification Intelligence
                </span>
                <span className="text-xs text-cyan-300 font-mono">Realtime Executive Digest</span>
              </div>
              <h2 className="text-sm font-bold text-white mt-1">{aiSummary.summaryText}</h2>
            </div>
          </div>

          <button
            onClick={onMarkAllRead}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 font-bold text-xs rounded-xl transition-all shrink-0 flex items-center gap-1.5"
          >
            <CheckCheck className="w-4 h-4" />
            Tandai Semua Dibaca
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs & Search Toolbar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-4 backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar w-full md:w-auto">
            {([
              { id: 'ALL', label: 'All Notifications' },
              { id: 'UNREAD', label: 'Unread' },
              { id: 'CRITICAL', label: 'Critical' },
              { id: 'SYSTEM', label: 'System' },
              { id: 'MENTIONS', label: 'Mentions' },
            ] as const).map((t) => (
              <button
                key={t.id}
                onClick={() => setSubTab(t.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  subTab === t.id
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-950'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari notifikasi, armada..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-300 outline-none focus:border-cyan-500"
            >
              <option value="ALL">Semua Prioritas</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="NORMAL">Normal</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        </div>

        {/* Bulk Action Controls */}
        {selectedIds.length > 0 && (
          <div className="bg-cyan-950/40 border border-cyan-500/30 p-2.5 rounded-xl flex items-center justify-between text-xs text-cyan-300 animate-fade-in">
            <span className="font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              {selectedIds.length} Notifikasi Dipilih
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handleBulkMarkRead}
                className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-lg transition-colors"
              >
                Mark as Read
              </button>
              <button
                onClick={handleBulkArchive}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition-colors"
              >
                Archive
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        )}

        {/* Notification List Items */}
        <div className="space-y-2.5">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-500 font-medium">
              🔔 Tidak ada notifikasi yang sesuai dengan kriteria filter.
            </div>
          ) : (
            filtered.map((item) => {
              const badge = getPriorityBadge(item.priority);
              const Icon = badge.icon;
              const isSelected = selectedIds.includes(item.id);

              return (
                <div
                  key={item.id}
                  className={`group relative rounded-2xl border p-4 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                    item.status === 'UNREAD'
                      ? 'border-slate-700 bg-slate-950 text-white shadow-md'
                      : 'border-slate-800/80 bg-slate-950/40 text-slate-300 opacity-80'
                  } ${isSelected ? 'border-cyan-500 bg-cyan-950/20' : ''}`}
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(item.id)}
                      className="mt-1 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0 cursor-pointer"
                    />

                    <div className={`p-2.5 rounded-xl border shrink-0 ${badge.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    <div
                      onClick={() => onSelectNotification(item)}
                      className="space-y-1 cursor-pointer flex-1 min-w-0"
                    >
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-white hover:text-cyan-300 transition-colors truncate">
                          {item.title}
                        </h4>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border ${badge.color}`}>
                          {item.priority}
                        </span>
                        {item.status === 'UNREAD' && (
                          <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                        )}
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">{item.message}</p>
                      <div className="flex items-center gap-3 text-[10px] text-slate-500 font-mono">
                        <span>{new Date(item.createdAt).toLocaleString('id-ID')}</span>
                        <span>•</span>
                        <span className="uppercase">{item.category}</span>
                        <span>•</span>
                        <span>Channels: {item.channels.join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2 shrink-0 justify-end pt-2 md:pt-0 border-t md:border-0 border-slate-800">
                    {item.deepLink && (
                      <button
                        onClick={() => onNavigateDeepLink(item.deepLink!)}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 font-semibold text-xs rounded-xl transition-all flex items-center gap-1"
                      >
                        <span>Buka Modul</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {item.status === 'UNREAD' ? (
                      <button
                        onClick={() => onMarkRead(item.id)}
                        className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-900 rounded-xl transition-colors"
                        title="Tandai Dibaca"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => onMarkUnread(item.id)}
                        className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-900 rounded-xl transition-colors"
                        title="Tandai Belum Dibaca"
                      >
                        <Bell className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => onDelete(item.id)}
                      className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded-xl transition-colors"
                      title="Hapus Notifikasi"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
