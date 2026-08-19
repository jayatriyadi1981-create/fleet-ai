import React from 'react';
import {
  ReportProvider,
  useReports,
  ReportHeader,
  ReportDashboardView,
  ReportListView,
  ReportBuilderWizard,
  ReportInteractiveViewer,
  ReportPrintView,
  ReportTemplatesView,
  ScheduledReportsView,
  GeneratedReportsView,
  ReportHistoryView,
  ReportSettingsView,
  ReportShareModal,
  ReportCompareModal,
} from '../../modules/reports';

const ReportContent: React.FC = () => {
  const { activeTab } = useReports();

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <ReportHeader />

      {/* View Switcher */}
      {activeTab === 'dashboard' && <ReportDashboardView />}
      {activeTab === 'all' && <ReportListView />}
      {activeTab === 'builder' && <ReportBuilderWizard />}
      {activeTab === 'viewer' && <ReportInteractiveViewer />}
      {activeTab === 'print' && <ReportPrintView />}
      {activeTab === 'templates' && <ReportTemplatesView />}
      {activeTab === 'scheduled' && <ScheduledReportsView />}
      {activeTab === 'generated' && <GeneratedReportsView />}
      {activeTab === 'history' && <ReportHistoryView />}
      {activeTab === 'settings' && <ReportSettingsView />}

      {/* Global Modals */}
      <ReportShareModal />
      <ReportCompareModal />
    </div>
  );
};

export const ReportsView: React.FC = () => {
  return (
    <ReportProvider initialTab="dashboard">
      <ReportContent />
    </ReportProvider>
  );
};

