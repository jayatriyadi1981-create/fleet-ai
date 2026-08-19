/**
 * Fleet Intelligence Smart AI - Alerts & Event Engine View
 */

import React, { useState, useEffect } from 'react';
import { Alert, AlertRule, ResolutionCode } from '../../modules/alerts/types';
import { alertEngine } from '../../modules/alerts/services/alertEngine';
import { alertRuleService } from '../../modules/alerts/services/alertRuleService';
import { alertAnalyticsService } from '../../modules/alerts/services/alertAnalyticsService';
import { AlertsKpiBar } from '../../modules/alerts/components/AlertsKpiBar';
import { ActiveAlertsTab } from '../../modules/alerts/components/ActiveAlertsTab';
import { AlertHistoryTab } from '../../modules/alerts/components/AlertHistoryTab';
import { AlertRulesTab } from '../../modules/alerts/components/AlertRulesTab';
import { AlertAnalyticsTab } from '../../modules/alerts/components/AlertAnalyticsTab';
import { AlertDetailDrawer } from '../../modules/alerts/components/AlertDetailDrawer';
import { RuleBuilderModal } from '../../modules/alerts/components/RuleBuilderModal';
import {
  Bell,
  Sliders,
  History,
  BarChart3,
  ShieldAlert,
  Radio,
  Plus,
} from 'lucide-react';

export const AlertsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ACTIVE_ALERTS' | 'ALERT_HISTORY' | 'ALERT_RULES' | 'ANALYTICS'>('ACTIVE_ALERTS');

  // State
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [rules, setRules] = useState<AlertRule[]>([]);
  const [selectedSeverityFilter, setSelectedSeverityFilter] = useState('ALL');

  // Drawer & Modal State
  const [selectedDrawerAlert, setSelectedDrawerAlert] = useState<Alert | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<AlertRule | null>(null);

  // Load Data
  const refreshData = () => {
    setAlerts([...alertEngine.getAlerts()]);
    setRules([...alertRuleService.getRules()]);
  };

  useEffect(() => {
    refreshData();
  }, []);

  // KPIs
  const kpis = alertAnalyticsService.calculateKPIs(alerts);

  // Handlers
  const handleAcknowledge = (alertId: string) => {
    alertEngine.acknowledgeAlert(alertId, 'Dispatcher Duty Officer');
    refreshData();
    if (selectedDrawerAlert?.id === alertId) {
      setSelectedDrawerAlert(alertEngine.getAlertById(alertId) || null);
    }
  };

  const handleResolve = (alertId: string, code: ResolutionCode, note: string) => {
    alertEngine.resolveAlert(alertId, code, note, 'Operations Fleet Manager');
    refreshData();
    if (selectedDrawerAlert?.id === alertId) {
      setSelectedDrawerAlert(alertEngine.getAlertById(alertId) || null);
    }
  };

  const handleEscalate = (alertId: string) => {
    alertEngine.escalateAlert(alertId, 'VP Safety & Operations');
    refreshData();
    if (selectedDrawerAlert?.id === alertId) {
      setSelectedDrawerAlert(alertEngine.getAlertById(alertId) || null);
    }
  };

  const handleMarkFalsePositive = (alertId: string, reason: string) => {
    alertEngine.resolveAlert(alertId, 'FALSE_POSITIVE', reason, 'AI Feedback Trainer');
    refreshData();
  };

  const handleOpenDetail = (alert: Alert) => {
    setSelectedDrawerAlert(alert);
    setIsDetailOpen(true);
  };

  const handleLiveTracking = (alertObj: Alert) => {
    // Navigates or highlights live GPS map
    console.log(`[Live GPS Tracking] Vehicle ${alertObj.vehiclePlate} at (${alertObj.latitude}, ${alertObj.longitude})`);
  };

  // Rule Handlers
  const handleToggleRule = (ruleId: string, enabled: boolean) => {
    alertRuleService.toggleRule(ruleId, enabled);
    refreshData();
  };

  const handleDuplicateRule = (ruleId: string) => {
    alertRuleService.duplicateRule(ruleId);
    refreshData();
  };

  const handleDeleteRule = (ruleId: string) => {
    alertRuleService.deleteRule(ruleId);
    refreshData();
  };

  const handleSaveRule = (ruleData: Omit<AlertRule, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => {
    if (editingRule) {
      alertRuleService.updateRule(editingRule.id, ruleData, 'Operations Admin');
    } else {
      alertRuleService.createRule(ruleData);
    }
    setEditingRule(null);
    refreshData();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* View Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Pusat Peringatan & Event Telematika (Alert Engine)
            </h1>
            <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Radio className="w-3 h-3 animate-pulse" />
              Realtime Processing
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Deteksi otomatis pelanggaran armada, eskalasi bertahap, visual rule builder, & analitik keandalan AI.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditingRule(null);
              setIsRuleModalOpen(true);
            }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Buat Rule Baru
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <AlertsKpiBar
        kpis={kpis}
        selectedSeverityFilter={selectedSeverityFilter}
        onSelectSeverityFilter={setSelectedSeverityFilter}
      />

      {/* Main Tabs Navigation */}
      <div className="flex border-b border-slate-800 overflow-x-auto no-scrollbar gap-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('ACTIVE_ALERTS')}
          className={`flex items-center gap-2 pb-3 px-3 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'ACTIVE_ALERTS'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bell className="w-4 h-4" />
          Active Alerts ({kpis.activeCount})
        </button>

        <button
          onClick={() => setActiveTab('ALERT_HISTORY')}
          className={`flex items-center gap-2 pb-3 px-3 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'ALERT_HISTORY'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <History className="w-4 h-4" />
          Histori Log Peringatan ({alerts.length})
        </button>

        <button
          onClick={() => setActiveTab('ALERT_RULES')}
          className={`flex items-center gap-2 pb-3 px-3 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'ALERT_RULES'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sliders className="w-4 h-4" />
          Aturan Pemicu (Alert Rules) ({rules.length})
        </button>

        <button
          onClick={() => setActiveTab('ANALYTICS')}
          className={`flex items-center gap-2 pb-3 px-3 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'ANALYTICS'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Analitik AI & False Positive
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'ACTIVE_ALERTS' && (
        <ActiveAlertsTab
          alerts={alerts}
          severityFilter={selectedSeverityFilter}
          onAcknowledge={handleAcknowledge}
          onResolve={handleResolve}
          onEscalate={handleEscalate}
          onOpenDetail={handleOpenDetail}
          onLiveTracking={handleLiveTracking}
        />
      )}

      {activeTab === 'ALERT_HISTORY' && (
        <AlertHistoryTab
          alerts={alerts}
          onOpenDetail={handleOpenDetail}
          onMarkFalsePositive={handleMarkFalsePositive}
        />
      )}

      {activeTab === 'ALERT_RULES' && (
        <AlertRulesTab
          rules={rules}
          onToggleRule={handleToggleRule}
          onDuplicateRule={handleDuplicateRule}
          onDeleteRule={handleDeleteRule}
          onEditRule={(rule) => {
            setEditingRule(rule);
            setIsRuleModalOpen(true);
          }}
          onCreateRule={() => {
            setEditingRule(null);
            setIsRuleModalOpen(true);
          }}
        />
      )}

      {activeTab === 'ANALYTICS' && (
        <AlertAnalyticsTab alerts={alerts} kpis={kpis} />
      )}

      {/* Alert Detail Drawer */}
      <AlertDetailDrawer
        alert={selectedDrawerAlert}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onAcknowledge={handleAcknowledge}
        onResolve={(id) => handleResolve(id, 'NORMAL_OPERATION', 'Resolved from detail drawer')}
        onEscalate={handleEscalate}
        onLiveTracking={handleLiveTracking}
      />

      {/* Rule Builder Modal */}
      <RuleBuilderModal
        isOpen={isRuleModalOpen}
        onClose={() => setIsRuleModalOpen(false)}
        onSaveRule={handleSaveRule}
        initialRule={editingRule}
      />
    </div>
  );
};
