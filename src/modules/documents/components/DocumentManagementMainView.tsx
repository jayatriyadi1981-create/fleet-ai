/**
 * Fleet Intelligence Smart AI - Document Management & Expiry Intelligence Main Module View
 * PROMPT 48 - Comprehensive Orchestrator for Overview, Repository, Calendar, Verification & AI
 */

import React, { useState, useEffect } from 'react';
import {
  FolderCheck,
  FileText,
  Clock,
  AlertTriangle,
  Calendar,
  ShieldCheck,
  Layers,
  Sparkles,
  UploadCloud,
  Layers as BulkIcon,
  Download,
  Search,
  Filter,
  CheckCircle2,
  RefreshCw,
  Plus,
  Zap,
} from 'lucide-react';
import { documentService } from '../services/documentService';
import { documentComplianceEngine } from '../services/documentComplianceEngine';
import { documentExpiryEngine } from '../services/documentExpiryEngine';
import { DocumentItem, DocumentFilter, EntityType, DocumentType, DocumentComplianceSummary, MissingDocumentItem } from '../types/documentTypes';
import { DocumentOverviewTab } from './DocumentOverviewTab';
import { DocumentListTable } from './DocumentListTable';
import { ExpiryCalendarView } from './ExpiryCalendarView';
import { VerificationQueueTab } from './VerificationQueueTab';
import { RequirementTemplatesTab } from './RequirementTemplatesTab';
import { DocumentUploadModal } from './DocumentUploadModal';
import { BulkUploadModal } from './BulkUploadModal';
import { DocumentPreviewModal } from './DocumentPreviewModal';
import { DocumentAiDrawer } from './DocumentAiDrawer';
import { useAuth } from '../../../context/AuthContext';
import { useAuthorization } from '../../../hooks/useAuthorization';

export type DocumentSubTab =
  | 'overview'
  | 'documents'
  | 'expiring'
  | 'expired'
  | 'calendar'
  | 'verification'
  | 'templates';

export const DocumentManagementMainView: React.FC = () => {
  const { user } = useAuth();
  const { can } = useAuthorization();

  const [activeTab, setActiveTab] = useState<DocumentSubTab>('overview');
  const [documents, setDocuments] = useState<DocumentItem[]>(documentService.getAllDocuments());
  const [summary, setSummary] = useState<DocumentComplianceSummary>(documentService.getComplianceSummary());
  const [missingDocs, setMissingDocs] = useState<MissingDocumentItem[]>(documentService.getMissingDocuments());

  // Modal / Drawer States
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [replaceDoc, setReplaceDoc] = useState<DocumentItem | undefined>(undefined);
  const [initialUploadEntity, setInitialUploadEntity] = useState<EntityType | undefined>(undefined);
  const [initialUploadDocType, setInitialUploadDocType] = useState<DocumentType | undefined>(undefined);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  // Sync state from documentService
  const refreshData = () => {
    const all = documentService.getAllDocuments();
    setDocuments(all);
    setSummary(documentService.getComplianceSummary());
    setMissingDocs(documentService.getMissingDocuments());
  };

  useEffect(() => {
    refreshData();
    const unsubscribe = documentService.subscribe(() => {
      refreshData();
    });
    return () => unsubscribe();
  }, []);

  const handleOpenUpload = (entityType?: EntityType, docType?: DocumentType) => {
    setReplaceDoc(undefined);
    setInitialUploadEntity(entityType);
    setInitialUploadDocType(docType);
    setIsUploadOpen(true);
  };

  const handleOpenReplace = (doc: DocumentItem) => {
    setReplaceDoc(doc);
    setInitialUploadEntity(doc.entityType);
    setInitialUploadDocType(doc.documentType);
    setIsUploadOpen(true);
  };

  const handleExportSummary = () => {
    const csvContent = documentService.exportComplianceCsv();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Compliance_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setNotificationToast('Laporan kepatuhan berhasil diekspor!');
    setTimeout(() => setNotificationToast(null), 4000);
  };

  const expiringList = documentService.getExpiringDocuments(30);
  const expiredList = documentService.getExpiredDocuments();
  const pendingCount = summary.pendingVerificationCount;

  const tabs: { id: DocumentSubTab; label: string; icon: React.FC<{ className?: string }>; badge?: number; badgeColor?: string }[] = [
    { id: 'overview', label: 'Ringkasan & Kepatuhan', icon: FolderCheck },
    { id: 'documents', label: 'Repositori Berkas', icon: FileText, badge: documents.length },
    { id: 'expiring', label: 'Mendekati Kadaluarsa', icon: Clock, badge: expiringList.length, badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    { id: 'expired', label: 'Kadaluarsa (Expired)', icon: AlertTriangle, badge: expiredList.length, badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
    { id: 'calendar', label: 'Kalender & Jadwal', icon: Calendar },
    { id: 'verification', label: 'Antrean Verifikasi', icon: ShieldCheck, badge: pendingCount, badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' },
    { id: 'templates', label: 'Aturan Kepatuhan', icon: Layers },
  ];

  return (
    <div className="space-y-6">
      {/* Toast */}
      {notificationToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-cyan-500/40 bg-slate-900/95 px-4 py-3 text-xs font-semibold text-cyan-300 shadow-2xl backdrop-blur">
          <CheckCircle2 className="h-4 w-4 text-cyan-400" />
          <span>{notificationToast}</span>
        </div>
      )}

      {/* Main Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-cyan-500/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-cyan-400 border border-cyan-500/20">
              PROMPT 48 • ENTERPRISE DMS
            </span>
            <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              AI OCR & Expiry Intelligence Active
            </span>
          </div>
          <h1 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <FolderCheck className="h-6 w-6 text-cyan-400" />
            <span>Manajemen Dokumen Legalitas & Kepatuhan Armada</span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Pusat repositori terenkripsi, OCR scanner cerdas, peringatan multi-channel kedaluwarsa, dan audit perizinan Dishub / Korlantas.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsAiDrawerOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-purple-500/30 bg-purple-500/10 px-3.5 py-2 text-xs font-bold text-purple-300 hover:bg-purple-500/20 transition-all shadow-sm shadow-purple-950"
          >
            <Sparkles className="h-4 w-4 text-purple-400 animate-pulse" />
            <span>Tanya AI Dokumen</span>
          </button>

          <button
            onClick={handleExportSummary}
            className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            title="Export CSV"
          >
            <Download className="h-4 w-4 text-slate-400" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button
            onClick={() => setIsBulkOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/90 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-700 transition-colors"
          >
            <BulkIcon className="h-4 w-4 text-cyan-400" />
            <span>Bulk Upload</span>
          </button>

          <button
            onClick={() => handleOpenUpload()}
            className="flex items-center gap-1.5 rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20"
          >
            <Plus className="h-4 w-4" />
            <span>Unggah Dokumen</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex overflow-x-auto no-scrollbar gap-1 border-b border-slate-800 pb-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                isActive
                  ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-950'
                  : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200 border border-transparent'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-black border ${
                    tab.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content Display */}
      {activeTab === 'overview' && (
        <DocumentOverviewTab
          summary={summary}
          expiringDocs={expiringList}
          expiredDocs={expiredList}
          missingDocs={missingDocs}
          onSelectDocument={(doc) => setSelectedDoc(doc)}
          onReplaceVersion={(doc) => handleOpenReplace(doc)}
          onUploadNew={() => handleOpenUpload()}
          onNavigateTab={(tab) => setActiveTab(tab as DocumentSubTab)}
        />
      )}

      {activeTab === 'documents' && (
        <DocumentListTable
          documents={documents}
          onSelectDocument={(doc) => setSelectedDoc(doc)}
          onReplaceVersion={(doc) => handleOpenReplace(doc)}
          onUploadNew={(eType, dType) => handleOpenUpload(eType, dType)}
          onUpdate={refreshData}
        />
      )}

      {activeTab === 'expiring' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-300 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Clock className="h-5 w-5 text-amber-400 shrink-0" />
              <div>
                <p className="font-bold text-amber-200">Dokumen Jatuh Tempo Mendekati Batas (≤ 30 Hari)</p>
                <p className="text-[11px] text-amber-300/80">
                  Segera lakukan perpanjangan uji KIR Dishub atau pembayaran PKB STNK untuk mencegah sanksi operasional.
                </p>
              </div>
            </div>
            <button
              onClick={() => handleExportSummary()}
              className="rounded-lg border border-amber-500/40 bg-amber-500/20 px-3 py-1.5 text-xs font-bold text-amber-200 hover:bg-amber-500/30"
            >
              Export Jadwal
            </button>
          </div>
          <DocumentListTable
            documents={expiringList}
            onSelectDocument={(doc) => setSelectedDoc(doc)}
            onReplaceVersion={(doc) => handleOpenReplace(doc)}
            onUploadNew={(eType, dType) => handleOpenUpload(eType, dType)}
            onUpdate={refreshData}
            defaultFilter={{ status: 'EXPIRING_SOON' }}
          />
        </div>
      )}

      {activeTab === 'expired' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0" />
              <div>
                <p className="font-bold text-rose-200">Perhatian: Dokumen Telah Kedaluwarsa (Expired)</p>
                <p className="text-[11px] text-rose-300/80">
                  Unit atau Pengemudi dengan dokumen kedaluwarsa otomatis diblokir dari penugasan trip baru hingga berkas diperbarui.
                </p>
              </div>
            </div>
            <button
              onClick={() => handleOpenUpload()}
              className="rounded-lg bg-rose-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-600 shadow-md shadow-rose-950"
            >
              Upload Pembaruan
            </button>
          </div>
          <DocumentListTable
            documents={expiredList}
            onSelectDocument={(doc) => setSelectedDoc(doc)}
            onReplaceVersion={(doc) => handleOpenReplace(doc)}
            onUploadNew={(eType, dType) => handleOpenUpload(eType, dType)}
            onUpdate={refreshData}
            defaultFilter={{ status: 'EXPIRED' }}
          />
        </div>
      )}

      {activeTab === 'calendar' && (
        <ExpiryCalendarView
          documents={documents}
          onSelectDocument={(doc) => setSelectedDoc(doc)}
          onRenewDocument={(doc) => handleOpenReplace(doc)}
        />
      )}

      {activeTab === 'verification' && (
        <VerificationQueueTab
          onSelectDocument={(doc) => setSelectedDoc(doc)}
          onUpdate={refreshData}
        />
      )}

      {activeTab === 'templates' && <RequirementTemplatesTab />}

      {/* Modals and Drawers */}
      <DocumentUploadModal
        isOpen={isUploadOpen}
        onClose={() => {
          setIsUploadOpen(false);
          setReplaceDoc(undefined);
        }}
        onSuccess={(doc) => {
          refreshData();
          setIsUploadOpen(false);
          setReplaceDoc(undefined);
          setNotificationToast(`Dokumen "${doc.title}" berhasil diunggah!`);
          setTimeout(() => setNotificationToast(null), 4000);
        }}
        replaceDoc={replaceDoc}
        initialEntityType={initialUploadEntity}
        initialDocumentType={initialUploadDocType}
      />

      <BulkUploadModal
        isOpen={isBulkOpen}
        onClose={() => setIsBulkOpen(false)}
        onSuccess={(count) => {
          refreshData();
          setIsBulkOpen(false);
          setNotificationToast(`${count} berkas berhasil diunggah secara batch!`);
          setTimeout(() => setNotificationToast(null), 4000);
        }}
      />

      <DocumentPreviewModal
        document={selectedDoc}
        isOpen={!!selectedDoc}
        onClose={() => setSelectedDoc(null)}
        onReplaceVersion={(doc) => {
          setSelectedDoc(null);
          handleOpenReplace(doc);
        }}
        onUpdate={refreshData}
      />

      <DocumentAiDrawer
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
        onSelectDocument={(doc) => {
          setIsAiDrawerOpen(false);
          setSelectedDoc(doc);
        }}
        onApplyFilter={(filterType, value) => {
          if (filterType === 'EXPIRING_SOON') setActiveTab('expiring');
          else if (filterType === 'EXPIRED') setActiveTab('expired');
          else if (filterType === 'MISSING') setActiveTab('overview');
          else setActiveTab('documents');
          setIsAiDrawerOpen(false);
        }}
      />
    </div>
  );
};
