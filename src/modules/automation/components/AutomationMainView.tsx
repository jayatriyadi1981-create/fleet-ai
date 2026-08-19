/**
 * Fleet Intelligence Smart AI - Automation Module Main Container
 * PROMPT 35 - AI Automation Engine
 */

import React from 'react';
import { AutomationProvider, useAutomation } from '../context/AutomationContext';
import { AutomationHeader } from './AutomationHeader';
import { AutomationDashboardView } from './AutomationDashboardView';
import { AutomationWorkflowsListView } from './AutomationWorkflowsListView';
import { AutomationBuilderView } from './AutomationBuilderView';
import { AutomationTemplatesView } from './AutomationTemplatesView';
import { AutomationLogsView } from './AutomationLogsView';
import { AutomationSettingsView } from './AutomationSettingsView';

const AutomationContentRouter: React.FC = () => {
  const { activeTab } = useAutomation();

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AutomationDashboardView />;
      case 'workflows':
        return <AutomationWorkflowsListView />;
      case 'builder':
        return <AutomationBuilderView />;
      case 'templates':
        return <AutomationTemplatesView />;
      case 'logs':
        return <AutomationLogsView />;
      case 'failed':
        return <AutomationLogsView filterFailedOnly />;
      case 'settings':
        return <AutomationSettingsView />;
      default:
        return <AutomationDashboardView />;
    }
  };

  return (
    <div id="automation-main-view" className="flex flex-col min-h-full bg-slate-950 text-slate-100">
      <AutomationHeader />
      <div className="flex-1">
        {renderActiveTab()}
      </div>
    </div>
  );
};

export const AutomationMainView: React.FC<{
  initialTab?: 'dashboard' | 'workflows' | 'builder' | 'templates' | 'logs' | 'failed' | 'settings';
}> = ({ initialTab = 'dashboard' }) => {
  return (
    <AutomationProvider initialTab={initialTab}>
      <AutomationContentRouter />
    </AutomationProvider>
  );
};
