/**
 * Fleet Intelligence Smart AI - Super Admin Control Center Main View (Prompt 42)
 * Central Command Hub for SaaS Platform Administrators.
 */

import React, { useState, useEffect } from 'react';
import { superAdminService } from '../../services/superAdminService';
import {
  PlatformCompany,
  PlatformCompanyQuota,
  PlatformUser,
  PlatformDeviceItem,
  PlatformRevenueMetrics,
  PlatformAiApiMetrics,
  MicroserviceHealthItem,
  SystemResourceMetrics,
  PlatformIncident,
  PlatformAnnouncement,
  PlatformAuditLog,
  ImpersonationSession,
  SuperAdminDashboardKpis,
} from '../../types/superAdmin';
import {
  ShieldCheck,
  Building2,
  Users,
  Radio,
  DollarSign,
  Sparkles,
  Activity,
  AlertTriangle,
  FileText,
  Bot,
  LayoutDashboard,
  Server,
  RefreshCw,
  Search,
  Bell,
  Command,
} from 'lucide-react';
import { SuperAdminDashboardTab } from './SuperAdminDashboardTab';
import { SuperAdminCompaniesTab } from './SuperAdminCompaniesTab';
import { SuperAdminUsersTab } from './SuperAdminUsersTab';
import { SuperAdminTelematicsTab } from './SuperAdminTelematicsTab';
import { SuperAdminBillingTab } from './SuperAdminBillingTab';
import { SuperAdminAiApiTab } from './SuperAdminAiApiTab';
import { SuperAdminHealthTab } from './SuperAdminHealthTab';
import { SuperAdminIncidentsTab } from './SuperAdminIncidentsTab';
import { SuperAdminAuditTab } from './SuperAdminAuditTab';
import { SuperAdminAiAssistant } from './SuperAdminAiAssistant';
import {
  ImpersonateModal,
  SuspendModal,
  ReactivateModal,
  ChangePlanModal,
  ExtendTrialModal,
  OverrideQuotasModal,
  CreateTenantModal,
  TenantDetailsDrawer,
} from './SuperAdminModals';

interface SuperAdminMainViewProps {
  currentUser?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  onImpersonateTenant?: (tenantId: string) => void;
}

export const SuperAdminMainView: React.FC<SuperAdminMainViewProps> = ({
  currentUser = {
    id: 'u-super-01',
    name: 'Alexandra Pratama',
    email: 'superadmin@platform.local',
    role: 'super_admin',
  },
  onImpersonateTenant,
}) => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [kpis, setKpis] = useState<SuperAdminDashboardKpis>(superAdminService.getDashboardKpis());
  const [companies, setCompanies] = useState<PlatformCompany[]>(superAdminService.getCompanies());
  const [users, setUsers] = useState<PlatformUser[]>(superAdminService.getUsers());
  const [devices, setDevices] = useState<PlatformDeviceItem[]>(superAdminService.getDevices());
  const [revenueMetrics, setRevenueMetrics] = useState<PlatformRevenueMetrics>(superAdminService.getRevenueMetrics());
  const [aiApiMetrics, setAiApiMetrics] = useState<PlatformAiApiMetrics>(superAdminService.getAiApiMetrics());
  const [microservices, setMicroservices] = useState<MicroserviceHealthItem[]>(superAdminService.getMicroservicesHealth());
  const [resourceMetrics, setResourceMetrics] = useState<SystemResourceMetrics>(superAdminService.getSystemResourceMetrics());
  const [incidents, setIncidents] = useState<PlatformIncident[]>(superAdminService.getIncidents());
  const [announcements, setAnnouncements] = useState<PlatformAnnouncement[]>(superAdminService.getAnnouncements());
  const [auditLogs, setAuditLogs] = useState<PlatformAuditLog[]>(superAdminService.getAuditLogs());

  // Modal States
  const [selectedCompany, setSelectedCompany] = useState<PlatformCompany | null>(null);
  const [isImpersonateModalOpen, setIsImpersonateModalOpen] = useState(false);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [isReactivateModalOpen, setIsReactivateModalOpen] = useState(false);
  const [isChangePlanModalOpen, setIsChangePlanModalOpen] = useState(false);
  const [isExtendTrialModalOpen, setIsExtendTrialModalOpen] = useState(false);
  const [isOverrideQuotasModalOpen, setIsOverrideQuotasModalOpen] = useState(false);
  const [isCreateTenantModalOpen, setIsCreateTenantModalOpen] = useState(false);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const refreshAllData = () => {
    setKpis(superAdminService.getDashboardKpis());
    setCompanies(superAdminService.getCompanies());
    setUsers(superAdminService.getUsers());
    setDevices(superAdminService.getDevices());
    setRevenueMetrics(superAdminService.getRevenueMetrics());
    setAiApiMetrics(superAdminService.getAiApiMetrics());
    setMicroservices(superAdminService.getMicroservicesHealth());
    setResourceMetrics(superAdminService.getSystemResourceMetrics());
    setIncidents(superAdminService.getIncidents());
    setAnnouncements(superAdminService.getAnnouncements());
    setAuditLogs(superAdminService.getAuditLogs());
  };

  // Keyboard shortcut Ctrl+K to jump to AI Assistant
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setActiveTab('assistant');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // --- MODAL HANDLERS ---
  const handleImpersonateClick = (comp: PlatformCompany) => {
    setSelectedCompany(comp);
    setIsImpersonateModalOpen(true);
  };

  const handleConfirmImpersonate = (reason: string) => {
    if (!selectedCompany) return;
    superAdminService.startImpersonation(selectedCompany.id, reason, currentUser);
    setIsImpersonateModalOpen(false);
    showToast(`Support Access aktif untuk tenant: ${selectedCompany.name}`);
    if (onImpersonateTenant) {
      onImpersonateTenant(selectedCompany.id);
    }
  };

  const handleSuspendClick = (comp: PlatformCompany) => {
    setSelectedCompany(comp);
    setIsSuspendModalOpen(true);
  };

  const handleConfirmSuspend = (reason: string) => {
    if (!selectedCompany) return;
    superAdminService.suspendCompany(selectedCompany.id, reason, currentUser.name);
    setIsSuspendModalOpen(false);
    refreshAllData();
    showToast(`Tenant ${selectedCompany.name} berhasil dibekukan.`);
  };

  const handleReactivateClick = (comp: PlatformCompany) => {
    setSelectedCompany(comp);
    setIsReactivateModalOpen(true);
  };

  const handleConfirmReactivate = (reason: string) => {
    if (!selectedCompany) return;
    superAdminService.reactivateCompany(selectedCompany.id, reason, currentUser.name);
    setIsReactivateModalOpen(false);
    refreshAllData();
    showToast(`Tenant ${selectedCompany.name} berhasil direaktivasi.`);
  };

  const handleChangePlanClick = (comp: PlatformCompany) => {
    setSelectedCompany(comp);
    setIsChangePlanModalOpen(true);
  };

  const handleConfirmChangePlan = (planName: 'Starter' | 'Professional' | 'Enterprise' | 'Custom', cycle: 'monthly' | 'yearly') => {
    if (!selectedCompany) return;
    superAdminService.changePlan(selectedCompany.id, planName, cycle, currentUser.name);
    setIsChangePlanModalOpen(false);
    refreshAllData();
    showToast(`Paket tenant ${selectedCompany.name} diubah menjadi ${planName} (${cycle}).`);
  };

  const handleExtendTrialClick = (comp: PlatformCompany) => {
    setSelectedCompany(comp);
    setIsExtendTrialModalOpen(true);
  };

  const handleConfirmExtendTrial = (days: number, reason: string) => {
    if (!selectedCompany) return;
    superAdminService.extendTrial(selectedCompany.id, days, reason, currentUser.name);
    setIsExtendTrialModalOpen(false);
    refreshAllData();
    showToast(`Masa trial ${selectedCompany.name} diperpanjang ${days} hari.`);
  };

  const handleOverrideQuotasClick = (comp: PlatformCompany) => {
    setSelectedCompany(comp);
    setIsOverrideQuotasModalOpen(true);
  };

  const handleConfirmOverrideQuotas = (quotas: Partial<PlatformCompanyQuota>, reason: string) => {
    if (!selectedCompany) return;
    superAdminService.overrideQuotas(selectedCompany.id, quotas, reason, currentUser.name);
    setIsOverrideQuotasModalOpen(false);
    refreshAllData();
    showToast(`Kuota khusus untuk ${selectedCompany.name} berhasil diperbarui.`);
  };

  const handleCreateTenantConfirm = (data: Partial<PlatformCompany>) => {
    const created = superAdminService.createCompany(data, currentUser.name);
    setIsCreateTenantModalOpen(false);
    refreshAllData();
    showToast(`Tenant ${created.name} (${created.code}) berhasil dibuat!`);
  };

  const handleViewDetails = (comp: PlatformCompany) => {
    setSelectedCompany(comp);
    setIsDetailsDrawerOpen(true);
  };

  // User Actions
  const handleToggleUserLock = (user: PlatformUser) => {
    const nextStatus = user.status === 'locked' || user.status === 'suspended' ? 'active' : 'locked';
    superAdminService.updateUserStatus(
      user.id,
      nextStatus,
      nextStatus === 'locked' ? 'Super Admin Security Lock' : 'Super Admin Unlock',
      currentUser.name
    );
    refreshAllData();
    showToast(`Status pengguna ${user.name} diubah menjadi ${nextStatus}.`);
  };

  const handleForceRevokeUserSessions = (user: PlatformUser) => {
    superAdminService.forceRevokeUserSessions(user.id, currentUser.name);
    refreshAllData();
    showToast(`Seluruh sesi login ${user.name} berhasil diputus.`);
  };

  // Device Actions
  const handleDispatchOta = (deviceIds: string[], firmwareVersion: string) => {
    const res = superAdminService.dispatchOtaUpdate(deviceIds, firmwareVersion, currentUser.name);
    refreshAllData();
    showToast(res.message);
  };

  // Incident Actions
  const handleCreateIncident = (data: {
    title: string;
    severity: PlatformIncident['severity'];
    affectedServices: string[];
    impactDescription: string;
    initialMessage: string;
  }) => {
    superAdminService.createIncident(data, currentUser.name);
    refreshAllData();
    showToast(`Insiden "${data.title}" dipublikasikan.`);
  };

  const handleAddIncidentUpdate = (incidentId: string, status: PlatformIncident['status'], message: string) => {
    superAdminService.addIncidentUpdate(incidentId, status, message, currentUser.name);
    refreshAllData();
    showToast('Pembaruan insiden berhasil dicatat.');
  };

  const handleCreateAnnouncement = (data: {
    title: string;
    message: string;
    severity: PlatformAnnouncement['severity'];
    targetAudience: PlatformAnnouncement['targetAudience'];
    expiresDays: number;
  }) => {
    superAdminService.createAnnouncement(data, currentUser.name);
    refreshAllData();
    showToast(`Broadcast pengumuman "${data.title}" berhasil dipublikasikan.`);
  };

  const handleDeleteAnnouncement = (id: string) => {
    superAdminService.deleteAnnouncement(id, currentUser.name);
    refreshAllData();
    showToast('Pengumuman broadcast dihapus.');
  };

  const navItems = [
    { id: 'dashboard', label: 'Executive Overview', icon: LayoutDashboard },
    { id: 'companies', label: 'Perusahaan SaaS', icon: Building2, badge: kpis.totalCompanies },
    { id: 'users', label: 'Pengguna (IAM)', icon: Users, badge: kpis.totalUsers },
    { id: 'telematics', label: 'GPS & IoT Pool', icon: Radio, badge: kpis.totalDevices },
    { id: 'billing', label: 'Revenue & MRR', icon: DollarSign },
    { id: 'ai_api', label: 'AI Compute & API', icon: Sparkles },
    { id: 'health', label: 'System Health', icon: Server },
    { id: 'incidents', label: 'Insiden & Broadcast', icon: AlertTriangle, badge: kpis.openIncidentsCount > 0 ? kpis.openIncidentsCount : undefined },
    { id: 'audit', label: 'Audit Trail Global', icon: ShieldCheck },
    { id: 'assistant', label: 'AI Platform Copilot', icon: Bot },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl border border-cyan-500/40 bg-slate-900 px-4 py-3 text-xs font-semibold text-cyan-300 shadow-2xl animate-in slide-in-from-bottom duration-200">
          <ShieldCheck className="h-4 w-4 text-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white font-black shadow-lg shadow-cyan-950 shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-extrabold text-white tracking-tight">SUPER ADMIN CONTROL CENTER</h1>
              <span className="rounded bg-purple-950/80 px-2 py-0.5 text-[10px] font-mono font-bold text-purple-300 border border-purple-500/30 uppercase">
                PLATFORM ROOT TIER
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Pusat Kendali Ekosistem Multi-Tenant SaaS • {currentUser.name} ({currentUser.email})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick AI shortcut button */}
          <button
            onClick={() => setActiveTab('assistant')}
            title="Buka AI Platform Copilot (Ctrl+K)"
            className="flex items-center gap-1.5 rounded-xl border border-purple-500/30 bg-purple-950/30 px-3 py-1.5 text-xs font-bold text-purple-300 hover:bg-purple-900/40 transition-all shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5 text-purple-400" />
            <span className="hidden md:inline">AI Copilot</span>
            <kbd className="hidden lg:inline text-[9px] font-mono bg-purple-900/60 px-1.5 py-0.2 rounded border border-purple-500/40">
              Ctrl+K
            </kbd>
          </button>

          {/* Refresh Button */}
          <button
            onClick={() => {
              refreshAllData();
              showToast('Data ekosistem platform diperbarui!');
            }}
            title="Refresh Data Platform"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Main Sub-Navigation Bar */}
      <nav className="border-b border-slate-800 bg-slate-900/50 px-4 sm:px-6 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1 py-2 min-w-max">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono font-bold ${
                      isActive
                        ? 'bg-cyan-500 text-slate-950'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Content Body */}
      <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
        {activeTab === 'dashboard' && (
          <SuperAdminDashboardTab
            kpis={kpis}
            revenueMetrics={revenueMetrics}
            aiApiMetrics={aiApiMetrics}
            microservices={microservices}
            onNavigateTab={(tabId) => setActiveTab(tabId)}
          />
        )}

        {activeTab === 'companies' && (
          <SuperAdminCompaniesTab
            companies={companies}
            onImpersonate={handleImpersonateClick}
            onSuspend={handleSuspendClick}
            onReactivate={handleReactivateClick}
            onChangePlan={handleChangePlanClick}
            onExtendTrial={handleExtendTrialClick}
            onOverrideQuotas={handleOverrideQuotasClick}
            onCreateCompany={() => setIsCreateTenantModalOpen(true)}
            onViewDetails={handleViewDetails}
          />
        )}

        {activeTab === 'users' && (
          <SuperAdminUsersTab
            users={users}
            onToggleUserLock={handleToggleUserLock}
            onForceRevokeSessions={handleForceRevokeUserSessions}
          />
        )}

        {activeTab === 'telematics' && (
          <SuperAdminTelematicsTab
            devices={devices}
            onDispatchOta={handleDispatchOta}
          />
        )}

        {activeTab === 'billing' && (
          <SuperAdminBillingTab
            revenueMetrics={revenueMetrics}
            companies={companies}
          />
        )}

        {activeTab === 'ai_api' && (
          <SuperAdminAiApiTab
            aiApiMetrics={aiApiMetrics}
          />
        )}

        {activeTab === 'health' && (
          <SuperAdminHealthTab
            microservices={microservices}
            resourceMetrics={resourceMetrics}
          />
        )}

        {activeTab === 'incidents' && (
          <SuperAdminIncidentsTab
            incidents={incidents}
            announcements={announcements}
            onCreateIncident={handleCreateIncident}
            onAddIncidentUpdate={handleAddIncidentUpdate}
            onCreateAnnouncement={handleCreateAnnouncement}
            onDeleteAnnouncement={handleDeleteAnnouncement}
          />
        )}

        {activeTab === 'audit' && (
          <SuperAdminAuditTab
            auditLogs={auditLogs}
          />
        )}

        {activeTab === 'assistant' && (
          <SuperAdminAiAssistant />
        )}
      </main>

      {/* Action Modals */}
      <ImpersonateModal
        company={selectedCompany}
        isOpen={isImpersonateModalOpen}
        onClose={() => setIsImpersonateModalOpen(false)}
        onConfirm={handleConfirmImpersonate}
      />

      <SuspendModal
        company={selectedCompany}
        isOpen={isSuspendModalOpen}
        onClose={() => setIsSuspendModalOpen(false)}
        onConfirm={handleConfirmSuspend}
      />

      <ReactivateModal
        company={selectedCompany}
        isOpen={isReactivateModalOpen}
        onClose={() => setIsReactivateModalOpen(false)}
        onConfirm={handleConfirmReactivate}
      />

      <ChangePlanModal
        company={selectedCompany}
        isOpen={isChangePlanModalOpen}
        onClose={() => setIsChangePlanModalOpen(false)}
        onConfirm={handleConfirmChangePlan}
      />

      <ExtendTrialModal
        company={selectedCompany}
        isOpen={isExtendTrialModalOpen}
        onClose={() => setIsExtendTrialModalOpen(false)}
        onConfirm={handleConfirmExtendTrial}
      />

      <OverrideQuotasModal
        company={selectedCompany}
        isOpen={isOverrideQuotasModalOpen}
        onClose={() => setIsOverrideQuotasModalOpen(false)}
        onConfirm={handleConfirmOverrideQuotas}
      />

      <CreateTenantModal
        isOpen={isCreateTenantModalOpen}
        onClose={() => setIsCreateTenantModalOpen(false)}
        onConfirm={handleCreateTenantConfirm}
      />

      <TenantDetailsDrawer
        company={selectedCompany}
        isOpen={isDetailsDrawerOpen}
        onClose={() => setIsDetailsDrawerOpen(false)}
        onImpersonate={handleImpersonateClick}
      />
    </div>
  );
};
