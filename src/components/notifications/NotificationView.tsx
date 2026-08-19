/**
 * Fleet Intelligence Smart AI - Unified Multi-Provider Notification Engine
 * PROMPT 45: Complete Multi-Provider Hub (Email, Push, WhatsApp, SMS & In-App)
 */

import React, { useState, useEffect } from 'react';
import { useFleet } from '../../context/FleetContext';
import { notificationService } from '../../modules/notifications/services/notificationService';
import { notificationDeepLinkService } from '../../modules/notifications/services/notificationDeepLinkService';
import { notificationAnalyticsService } from '../../modules/notifications/services/notificationAnalyticsService';
import { Notification } from '../../modules/notifications/types';
import { NotificationCenterTab } from '../../modules/notifications/components/NotificationCenterTab';
import { NotificationDetailDrawer } from '../../modules/notifications/components/NotificationDetailDrawer';
import { OverviewHealthTab } from './tabs/OverviewHealthTab';
import { ProviderManagementTab } from './tabs/ProviderManagementTab';
import { TemplateManagerTab } from './tabs/TemplateManagerTab';
import { NotificationRulesTab } from './tabs/NotificationRulesTab';
import { UserPreferencesTab } from './tabs/UserPreferencesTab';
import { LiveLogsAuditTab } from './tabs/LiveLogsAuditTab';
import { AnalyticsCostTab } from './tabs/AnalyticsCostTab';
import { NotificationSimulatorTab } from './tabs/NotificationSimulatorTab';
import { PageTransition } from '../common/PageTransition';
import {
  Bell,
  Activity,
  Server,
  FileText,
  Sliders,
  Radio,
  History,
  BarChart3,
  Zap,
  Sparkles,
} from 'lucide-react';

export type NotificationEngineTab =
  | 'CENTER'
  | 'OVERVIEW'
  | 'PROVIDERS'
  | 'TEMPLATES'
  | 'RULES'
  | 'PREFERENCES'
  | 'LOGS'
  | 'ANALYTICS'
  | 'SIMULATOR';

export const NotificationView: React.FC = () => {
  const { setActiveView } = useFleet();

  const [activeTab, setActiveTab] = useState<NotificationEngineTab>('OVERVIEW');

  const [notifications, setNotifications] = useState<Notification[]>(() =>
    notificationService.getNotifications('tenant-indonesia-logistics')
  );

  const [summary, setSummary] = useState(() =>
    notificationAnalyticsService.getSummary('tenant-indonesia-logistics')
  );

  // Detail Drawer state
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const refresh = () => {
    setNotifications([...notificationService.getNotifications('tenant-indonesia-logistics')]);
    setSummary(notificationAnalyticsService.getSummary('tenant-indonesia-logistics'));
  };

  useEffect(() => {
    const unsubscribe = notificationService.subscribe(() => refresh());
    return () => unsubscribe();
  }, []);

  // Handlers
  const handleMarkRead = (id: string) => {
    notificationService.markRead(id);
    refresh();
  };

  const handleMarkUnread = (id: string) => {
    notificationService.markUnread(id);
    refresh();
  };

  const handleArchive = (id: string) => {
    notificationService.archiveNotification(id);
    refresh();
  };

  const handleDelete = (id: string) => {
    notificationService.deleteNotification(id);
    refresh();
  };

  const handleMarkAllRead = () => {
    notificationService.markAllRead('tenant-indonesia-logistics');
    refresh();
  };

  const handleSelectNotification = (n: Notification) => {
    setSelectedNotification(n);
    setIsDrawerOpen(true);
  };

  const handleNavigateDeepLink = (url: string) => {
    const targetView = notificationDeepLinkService.mapUrlToActiveView(url) as any;
    setActiveView(targetView);
  };

  return (
    <PageTransition>
      <div className="space-y-6 animate-fade-in">
        {/* Page Header */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Unified Multi-Provider Notification Engine
              </h1>
              <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                Enterprise HA Engine
              </span>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              Arsitektur abstraksi perpesanan multi-provider (Email, Push, WhatsApp, SMS) dengan failover otomatis, dynamic templating, rule engine, dan kontrol biaya.
            </p>
          </div>
        </div>

        {/* Main Tabs Navigation */}
        <div className="flex border-b border-slate-800 overflow-x-auto no-scrollbar gap-1 text-xs font-bold">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`flex items-center gap-2 pb-3 px-3.5 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'OVERVIEW'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Overview & Health</span>
          </button>

          <button
            onClick={() => setActiveTab('SIMULATOR')}
            className={`flex items-center gap-2 pb-3 px-3.5 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'SIMULATOR'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Test Simulator</span>
          </button>

          <button
            onClick={() => setActiveTab('PROVIDERS')}
            className={`flex items-center gap-2 pb-3 px-3.5 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'PROVIDERS'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Server className="w-4 h-4 text-purple-400" />
            <span>Providers & Failover</span>
          </button>

          <button
            onClick={() => setActiveTab('TEMPLATES')}
            className={`flex items-center gap-2 pb-3 px-3.5 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'TEMPLATES'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Templates</span>
          </button>

          <button
            onClick={() => setActiveTab('RULES')}
            className={`flex items-center gap-2 pb-3 px-3.5 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'RULES'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Rules & Escalation</span>
          </button>

          <button
            onClick={() => setActiveTab('PREFERENCES')}
            className={`flex items-center gap-2 pb-3 px-3.5 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'PREFERENCES'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className="w-4 h-4 text-emerald-400" />
            <span>Preferences & Devices</span>
          </button>

          <button
            onClick={() => setActiveTab('LOGS')}
            className={`flex items-center gap-2 pb-3 px-3.5 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'LOGS'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Live Delivery Logs</span>
          </button>

          <button
            onClick={() => setActiveTab('ANALYTICS')}
            className={`flex items-center gap-2 pb-3 px-3.5 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'ANALYTICS'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <span>Cost & Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('CENTER')}
            className={`flex items-center gap-2 pb-3 px-3.5 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'CENTER'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bell className="w-4 h-4 text-amber-400" />
            <span>In-App Center ({notifications.filter(n => n.status === 'UNREAD').length})</span>
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === 'OVERVIEW' && (
          <OverviewHealthTab
            summary={summary}
            onRefresh={refresh}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'SIMULATOR' && (
          <NotificationSimulatorTab onEventDispatched={refresh} />
        )}

        {activeTab === 'PROVIDERS' && (
          <ProviderManagementTab onRefresh={refresh} />
        )}

        {activeTab === 'TEMPLATES' && <TemplateManagerTab />}

        {activeTab === 'RULES' && <NotificationRulesTab />}

        {activeTab === 'PREFERENCES' && <UserPreferencesTab />}

        {activeTab === 'LOGS' && <LiveLogsAuditTab onRefresh={refresh} />}

        {activeTab === 'ANALYTICS' && <AnalyticsCostTab summary={summary} />}

        {activeTab === 'CENTER' && (
          <NotificationCenterTab
            notifications={notifications}
            onMarkRead={handleMarkRead}
            onMarkUnread={handleMarkUnread}
            onArchive={handleArchive}
            onDelete={handleDelete}
            onMarkAllRead={handleMarkAllRead}
            onSelectNotification={handleSelectNotification}
            onNavigateDeepLink={handleNavigateDeepLink}
          />
        )}

        {/* Detail Drawer */}
        <NotificationDetailDrawer
          notification={selectedNotification}
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onMarkRead={handleMarkRead}
          onArchive={handleArchive}
          onNavigateDeepLink={handleNavigateDeepLink}
        />
      </div>
    </PageTransition>
  );
};
