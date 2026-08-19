/**
 * Fleet Intelligence Smart AI - Organization & Multi-Tenant SaaS Master View
 * Central control room for Enterprise Tenants, Org Tree, Branches, Departments, Fleets & Security
 */

import React, { useState, useEffect } from 'react';
import { useOrganization } from '../../context/OrganizationContext';
import { OrganizationScopeBar } from './OrganizationScopeBar';
import { OrgHierarchyTreeTab } from './tabs/OrgHierarchyTreeTab';
import { TenantsManagementTab } from './tabs/TenantsManagementTab';
import { BranchesManagementTab } from './tabs/BranchesManagementTab';
import { DepartmentsManagementTab } from './tabs/DepartmentsManagementTab';
import { FleetsManagementTab } from './tabs/FleetsManagementTab';
import { SecurityIsolationTab } from './tabs/SecurityIsolationTab';
import { OrganizationAuditTab } from './tabs/OrganizationAuditTab';
import { 
  Building2, 
  Layers, 
  MapPin, 
  Briefcase, 
  Truck, 
  ShieldCheck, 
  History, 
  Sparkles, 
  ArrowRightLeft, 
  CheckCircle2,
  HardDrive,
  Users
} from 'lucide-react';

export type OrganizationTab = 
  | 'tree' 
  | 'tenants' 
  | 'branches' 
  | 'departments' 
  | 'fleets' 
  | 'security' 
  | 'audit';

interface OrganizationMainViewProps {
  initialTab?: OrganizationTab;
}

export const OrganizationMainView: React.FC<OrganizationMainViewProps> = ({ initialTab = 'tree' }) => {
  const { currentTenant, tenants, branches, departments, fleets } = useOrganization();
  const [activeTab, setActiveTab] = useState<OrganizationTab>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const tabs = [
    { id: 'tree', label: 'Pohon Hirarki (Org Tree)', icon: Layers },
    { id: 'tenants', label: 'Perusahaan SaaS (Tenants)', icon: Building2, count: tenants.length },
    { id: 'branches', label: 'Cabang & Depo', icon: MapPin, count: branches.length },
    { id: 'departments', label: 'Departemen & Divisi', icon: Briefcase, count: departments.length },
    { id: 'fleets', label: 'Grup Sub-Armada', icon: Truck, count: fleets.length },
    { id: 'security', label: 'Security & Isolation Lab', icon: ShieldCheck },
    { id: 'audit', label: 'Audit Trail Organisasi', icon: History },
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Banner & KPI Stat Cards */}
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-lg shadow-cyan-950">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                Multi-Tenant SaaS & Struktur Organisasi
              </h1>
              <p className="text-xs text-slate-400">
                Manajemen hirarki entitas, isolasi data level-baris (Row-Level Security), cabang depo, dan kuota SaaS.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Tenant Info Ribbon */}
        <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 rounded-2xl px-4 py-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Tenant Aktif:</span>
            <span className="font-bold text-white">{currentTenant.name}</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              {currentTenant.subscriptionPlan}
            </span>
          </div>
        </div>
      </div>

      {/* Global Scope Bar */}
      <OrganizationScopeBar />

      {/* Modern Tabs Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as OrganizationTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-950'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-slate-950' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono font-bold ${
                    isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Tab View Rendering */}
      <div>
        {activeTab === 'tree' && <OrgHierarchyTreeTab />}
        {activeTab === 'tenants' && <TenantsManagementTab />}
        {activeTab === 'branches' && <BranchesManagementTab />}
        {activeTab === 'departments' && <DepartmentsManagementTab />}
        {activeTab === 'fleets' && <FleetsManagementTab />}
        {activeTab === 'security' && <SecurityIsolationTab />}
        {activeTab === 'audit' && <OrganizationAuditTab />}
      </div>
    </div>
  );
};
