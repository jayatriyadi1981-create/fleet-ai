/**
 * Safety Management & Incident Intelligence Main View Container
 * PROMPT 22 Architecture
 */

import React, { useState } from 'react';
import {
  mockAccidents,
  mockIncidents,
  mockNearMisses,
  mockSafetyObservations,
  mockSafetyEvents,
  mockInvestigations,
  mockEvidenceList,
  mockCorrectiveActions
} from '../data/mockSafetyData';

import {
  Accident,
  Incident,
  NearMiss,
  SafetyObservation,
  Investigation,
  Evidence,
  CorrectiveAction,
  InvestigationStatus
} from '../types';

import { SafetyScoreService } from '../services/safetyScoreService';

import { OverviewTab } from './tabs/OverviewTab';
import { AccidentsTab } from './tabs/AccidentsTab';
import { IncidentsTab } from './tabs/IncidentsTab';
import { NearMissTab } from './tabs/NearMissTab';
import { ObservationsTab } from './tabs/ObservationsTab';
import { InvestigationsTab } from './tabs/InvestigationsTab';
import { EvidenceTab } from './tabs/EvidenceTab';
import { CorrectiveActionsTab } from './tabs/CorrectiveActionsTab';
import { SafetyScoreTab } from './tabs/SafetyScoreTab';
import { AnalyticsTab } from './tabs/AnalyticsTab';
import { AISafetyInsightsTab } from './tabs/AISafetyInsightsTab';

import { ReportAccidentModal } from './modals/ReportAccidentModal';
import { QuickReportNearMissModal } from './modals/QuickReportNearMissModal';
import { InvestigationDetailModal } from './modals/InvestigationDetailModal';

import {
  ShieldAlert,
  LayoutDashboard,
  AlertTriangle,
  Activity,
  Search,
  Camera,
  GitCommit,
  ShieldCheck,
  BarChart3,
  Sparkles,
  Sliders,
  Users
} from 'lucide-react';

export type SafetyManagementTab =
  | 'overview'
  | 'accidents'
  | 'incidents'
  | 'near-miss'
  | 'observations'
  | 'investigations'
  | 'evidence'
  | 'corrective-actions'
  | 'score'
  | 'analytics'
  | 'ai-insights';

export const SafetyManagementView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SafetyManagementTab>('overview');

  // Datasets State
  const [accidents, setAccidents] = useState<Accident[]>(mockAccidents);
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);
  const [nearMisses, setNearMisses] = useState<NearMiss[]>(mockNearMisses);
  const [observations, setObservations] = useState<SafetyObservation[]>(mockSafetyObservations);
  const [investigations, setInvestigations] = useState<Investigation[]>(mockInvestigations);
  const [evidenceList, setEvidenceList] = useState<Evidence[]>(mockEvidenceList);
  const [capas, setCapas] = useState<CorrectiveAction[]>(mockCorrectiveActions);

  // Modal States
  const [isReportAccidentOpen, setIsReportAccidentOpen] = useState(false);
  const [isQuickNearMissOpen, setIsQuickNearMissOpen] = useState(false);
  const [selectedInvestigation, setSelectedInvestigation] = useState<Investigation | null>(null);

  // Safety Score Metrics
  const scoreMetrics = SafetyScoreService.calculateFleetSafetyScore(accidents, incidents, nearMisses, capas);

  // Handlers
  const handleAddAccident = (newAcc: Partial<Accident>) => {
    setAccidents((prev) => [newAcc as Accident, ...prev]);
  };

  const handleAddNearMiss = (newNm: Partial<NearMiss>) => {
    setNearMisses((prev) => [newNm as NearMiss, ...prev]);
  };

  const handleUpdateInvestigationStatus = (id: string, newStatus: InvestigationStatus) => {
    setInvestigations((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: newStatus } : inv))
    );
    if (selectedInvestigation && selectedInvestigation.id === id) {
      setSelectedInvestigation((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleCreateCAPAFromInvestigation = (inv: Investigation) => {
    const newCAPA: CorrectiveAction = {
      id: `capa-${Math.random()}`,
      tenantId: 'tenant-01',
      actionNumber: `CAPA-2026-${Math.floor(100000 + Math.random() * 900000)}`,
      sourceType: 'ACCIDENT',
      sourceId: inv.caseId,
      sourceNumber: inv.caseNumber,
      type: 'CORRECTIVE',
      title: `Tindakan Hasil Penyelidikan ${inv.investigationNumber}`,
      description: `Perbaikan berdasarkan akar masalah (Root Cause): ${inv.rootCause || 'Evaluasi SOP mengemudi'}`,
      rootCause: inv.rootCause || 'Human & Environmental Factor',
      priority: 'HIGH',
      assignedTo: 'usr-maint-01',
      assignedToName: 'Agus Mantap (Bengkel Support)',
      departmentId: 'dept-maint',
      departmentName: 'Maintenance & Safety',
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString(),
      status: 'ASSIGNED',
      verificationRequired: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCapas((prev) => [newCAPA, ...prev]);
    setSelectedInvestigation(null);
    setActiveTab('corrective-actions');
  };

  const handleVerifyCAPA = (id: string) => {
    setCapas((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: 'VERIFIED',
              verifiedByName: 'Ir. Bambang Wijaya (HSE Manager)',
              verifiedAt: new Date().toISOString(),
            }
          : c
      )
    );
  };

  const handleCloseCAPA = (id: string) => {
    setCapas((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'CLOSED' } : c)));
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Overview */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold uppercase">
              PROMPT 22 ENTERPRISE SAFETY
            </span>
            <span className="text-xs text-slate-400">• Accident & Incident Intelligence Platform</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white mt-1 flex items-center gap-2.5">
            <ShieldAlert className="h-6 w-6 text-rose-400" />
            Safety Management & Incident Intelligence
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-3xl">
            Sistem terpadu investigasi kecelakaan, pencatatan near miss, analisis 5-Why, bukti telemetri GPS, tindakan korektif (CAPA), dan AI Safety Copilot.
          </p>
        </div>
      </div>

      {/* Navigation Sub-Tabs Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800/80">
        {[
          { id: 'overview', label: 'Safety Overview', icon: LayoutDashboard },
          { id: 'accidents', label: 'Kecelakaan (Accidents)', icon: ShieldAlert },
          { id: 'incidents', label: 'Insiden (Incidents)', icon: AlertTriangle },
          { id: 'near-miss', label: 'Near Miss', icon: Activity },
          { id: 'observations', label: 'Observasi Safety', icon: ShieldCheck },
          { id: 'investigations', label: 'Penyelidikan (Investigations)', icon: Search },
          { id: 'evidence', label: 'Bukti & Telemetri', icon: Camera },
          { id: 'corrective-actions', label: 'Tindakan CAPA', icon: GitCommit },
          { id: 'score', label: 'Safety Score Engine', icon: Sliders },
          { id: 'analytics', label: 'Analitik & Hotspot', icon: BarChart3 },
          { id: 'ai-insights', label: 'AI Safety Copilot', icon: Sparkles },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SafetyManagementTab)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                isActive
                  ? 'bg-rose-500/15 text-rose-300 border border-rose-500/40 shadow-inner'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-rose-400' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Render Area */}
      <div className="pt-1">
        {activeTab === 'overview' && (
          <OverviewTab
            accidents={accidents}
            incidents={incidents}
            nearMisses={nearMisses}
            capas={capas}
            investigations={investigations}
            safetyEvents={mockSafetyEvents}
            safetyScore={scoreMetrics.score}
            onOpenReportAccident={() => setIsReportAccidentOpen(true)}
            onOpenReportIncident={() => setActiveTab('incidents')}
            onOpenReportNearMiss={() => setIsQuickNearMissOpen(true)}
            onOpenReportObservation={() => setActiveTab('observations')}
            onSelectTab={(k) => setActiveTab(k as SafetyManagementTab)}
          />
        )}

        {activeTab === 'accidents' && (
          <AccidentsTab
            accidents={accidents}
            onOpenReportModal={() => setIsReportAccidentOpen(true)}
            onSelectAccident={() => {}}
          />
        )}

        {activeTab === 'incidents' && (
          <IncidentsTab
            incidents={incidents}
            onOpenReportModal={() => setActiveTab('accidents')}
          />
        )}

        {activeTab === 'near-miss' && (
          <NearMissTab
            nearMisses={nearMisses}
            onOpenQuickReport={() => setIsQuickNearMissOpen(true)}
          />
        )}

        {activeTab === 'observations' && (
          <ObservationsTab
            observations={observations}
            onOpenReportModal={() => {}}
          />
        )}

        {activeTab === 'investigations' && (
          <InvestigationsTab
            investigations={investigations}
            onSelectInvestigation={(inv) => setSelectedInvestigation(inv)}
          />
        )}

        {activeTab === 'evidence' && (
          <EvidenceTab
            evidenceList={evidenceList}
            onOpenUploadModal={() => alert('Buka dialog unggah bukti file/telemetri baru...')}
          />
        )}

        {activeTab === 'corrective-actions' && (
          <CorrectiveActionsTab
            capas={capas}
            onVerifyCAPA={handleVerifyCAPA}
            onCloseCAPA={handleCloseCAPA}
          />
        )}

        {activeTab === 'score' && (
          <SafetyScoreTab scoreMetrics={scoreMetrics} />
        )}

        {activeTab === 'analytics' && <AnalyticsTab />}

        {activeTab === 'ai-insights' && (
          <AISafetyInsightsTab
            accidents={accidents}
            incidents={incidents}
            nearMisses={nearMisses}
            capas={capas}
          />
        )}
      </div>

      {/* Global Modals */}
      {isReportAccidentOpen && (
        <ReportAccidentModal
          onClose={() => setIsReportAccidentOpen(false)}
          onSubmit={handleAddAccident}
        />
      )}

      {isQuickNearMissOpen && (
        <QuickReportNearMissModal
          onClose={() => setIsQuickNearMissOpen(false)}
          onSubmit={handleAddNearMiss}
        />
      )}

      {selectedInvestigation && (
        <InvestigationDetailModal
          investigation={selectedInvestigation}
          onClose={() => setSelectedInvestigation(null)}
          onUpdateStatus={handleUpdateInvestigationStatus}
          onCreateCAPA={handleCreateCAPAFromInvestigation}
        />
      )}
    </div>
  );
};
