/**
 * DriverIntelligenceView - Master Container Component
 * PROMPT 29 - AI Driver Intelligence Module
 */

import React, { useState, useEffect } from 'react';
import {
  Brain,
  ShieldCheck,
  AlertTriangle,
  Zap,
  TrendingDown,
  TrendingUp,
  Award,
  Users,
  FileText,
  Sparkles,
  Calendar,
  Layers,
  Filter,
  CheckCircle2,
  Activity,
  Sliders,
  Target,
} from 'lucide-react';
import { DriverIntelligencePeriod, DriverIntelligenceTab, AIDriverCoachingSession } from './types';
import { driverIntelligenceService, DriverIntelligenceFullProfile } from './engines/DriverIntelligenceService';
import { aiDriverCoachingService } from './engines/AIDriverCoachingService';

// Tabs
import { OverviewTab } from './components/tabs/OverviewTab';
import { RiskScoreTab } from './components/tabs/RiskScoreTab';
import { DriverBehaviorTab } from './components/tabs/DriverBehaviorTab';
import { SafetyPerformanceTab } from './components/tabs/SafetyPerformanceTab';
import { DriverTrendsTab } from './components/tabs/DriverTrendsTab';
import { DriverRankingTab } from './components/tabs/DriverRankingTab';
import { SafetyRecommendationsTab } from './components/tabs/SafetyRecommendationsTab';
import { CoachingTab } from './components/tabs/CoachingTab';
import { DriverComparisonTab } from './components/tabs/DriverComparisonTab';
import { DriverReportsTab } from './components/tabs/DriverReportsTab';
import { DriverSelfCoachingTab } from './components/tabs/DriverSelfCoachingTab';

// Modals
import { CreateCoachingSessionModal } from './components/modals/CreateCoachingSessionModal';
import { DriverAcknowledgementModal } from './components/modals/DriverAcknowledgementModal';
import { ExplainDriverRiskModal } from './components/modals/ExplainDriverRiskModal';
import { WeightConfigModal } from './components/modals/WeightConfigModal';

export const DriverIntelligenceView: React.FC = () => {
  // Global View States
  const [activeTab, setActiveTab] = useState<DriverIntelligenceTab>('OVERVIEW');
  const [period, setPeriod] = useState<DriverIntelligencePeriod>('30_DAYS');
  const [selectedDriverId, setSelectedDriverId] = useState<string>('drv-01');
  const [comparisonDriverIds, setComparisonDriverIds] = useState<string[]>(['drv-01', 'drv-02', 'drv-03']);
  const [coachingFocusType, setCoachingFocusType] = useState<any>('SPEED_MANAGEMENT');

  // Modal States
  const [isCoachingModalOpen, setIsCoachingModalOpen] = useState(false);
  const [isAckModalOpen, setIsAckModalOpen] = useState(false);
  const [selectedAckSession, setSelectedAckSession] = useState<AIDriverCoachingSession | null>(null);
  const [isExplainModalOpen, setIsExplainModalOpen] = useState(false);
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);

  // Refresh Trigger
  const [refreshKey, setRefreshKey] = useState(0);

  // Data fetching from DriverIntelligenceService
  const allDrivers = driverIntelligenceService.getDriverList();
  const executiveSummary = driverIntelligenceService.getFleetExecutiveSummary(period);
  const selectedProfile = driverIntelligenceService.getDriverProfile(selectedDriverId, period);
  const rankings = driverIntelligenceService.getDriverRankings(period);
  const topPerformers = driverIntelligenceService.getTopPerformers(5, period);
  const attentionRequired = driverIntelligenceService.getAttentionRequiredDrivers(period);
  const recommendations = driverIntelligenceService.getSafetyRecommendations(period);
  const coachingSessions = aiDriverCoachingService.getSessions();

  const handleOpenCoachingModal = (driverId?: string, focusType?: string) => {
    if (driverId) setSelectedDriverId(driverId);
    if (focusType) setCoachingFocusType(focusType);
    setIsCoachingModalOpen(true);
  };

  const handleOpenAckModal = (session: AIDriverCoachingSession) => {
    setSelectedAckSession(session);
    setIsAckModalOpen(true);
  };

  const handleCompareDrivers = (driverIds: string[]) => {
    setComparisonDriverIds(driverIds);
    setActiveTab('COMPARISON');
  };

  const handleSelectDriverAndTab = (driverId: string, tab: DriverIntelligenceTab) => {
    setSelectedDriverId(driverId);
    setActiveTab(tab);
  };

  const tabList: { id: DriverIntelligenceTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'OVERVIEW', label: 'Overview AI', icon: Layers },
    { id: 'RISK_SCORE', label: 'Skor Risiko', icon: AlertTriangle },
    { id: 'BEHAVIOR', label: 'Perilaku Mengemudi', icon: Zap },
    { id: 'SAFETY_SCORE', label: 'Safety & Performa', icon: ShieldCheck },
    { id: 'TRENDS', label: 'Tren & Trajectory', icon: Activity },
    { id: 'RANKING', label: 'Leaderboard', icon: Award },
    { id: 'RECOMMENDATIONS', label: 'Rekomendasi AI', icon: Sparkles },
    { id: 'COACHING', label: 'AI Coaching Center', icon: Brain },
    { id: 'COMPARISON', label: 'Komparasi Driver', icon: Users },
    { id: 'REPORTS', label: 'Scorecard & Laporan', icon: FileText },
    { id: 'SELF_COACHING', label: 'Self-Coaching (Driver)', icon: Target },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto animate-fade-in">
      {/* Top Header & Executive Quick Bar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-slate-900/95 p-5 rounded-3xl border border-slate-800 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10 shrink-0">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                AI Driver Intelligence
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 uppercase">
                PROMPT 29 • TELEMATICS SUITE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Pusat analitik risiko telematika, evaluasi objektif multi-dimensi, dan pembinaan pengemudi terpadu.
            </p>
          </div>
        </div>

        {/* Global Period Selector & Quick Actions */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Period Toggle */}
          <div className="flex items-center bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs">
            <button
              onClick={() => setPeriod('7_DAYS')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                period === '7_DAYS'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              7 Hari
            </button>
            <button
              onClick={() => setPeriod('30_DAYS')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                period === '30_DAYS'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              30 Hari
            </button>
            <button
              onClick={() => setPeriod('90_DAYS')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                period === '90_DAYS'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              90 Hari
            </button>
          </div>

          {/* New Coaching Session Button */}
          <button
            onClick={() => handleOpenCoachingModal(selectedDriverId)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-cyan-500/20"
          >
            <Sparkles className="w-4 h-4" />
            <span>Jadwalkan Coaching</span>
          </button>
        </div>
      </div>

      {/* Main Tab Navigation Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-800">
        {tabList.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20 font-extrabold'
                  : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border-slate-800'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tab View Rendering */}
      <div className="transition-all duration-300">
        {activeTab === 'OVERVIEW' && (
          <OverviewTab
            period={period}
            onPeriodChange={setPeriod}
            rankings={rankings}
            topPerformers={topPerformers}
            attentionRequired={attentionRequired}
            matrixNodes={driverIntelligenceService.getDriverRiskMatrix(period).nodes}
            onSelectDriver={(driverId) => handleSelectDriverAndTab(driverId, 'RISK_SCORE')}
            onOpenCoachingModal={handleOpenCoachingModal}
            onNavigateTab={(tab) => setActiveTab(tab as DriverIntelligenceTab)}
          />
        )}

        {activeTab === 'RISK_SCORE' && (
          <RiskScoreTab
            selectedProfile={selectedProfile}
            allDrivers={allDrivers}
            onSelectDriverId={setSelectedDriverId}
            period={period}
            onOpenExplainModal={() => setIsExplainModalOpen(true)}
            onOpenWeightConfigModal={() => setIsWeightModalOpen(true)}
            onOpenCoachingModal={handleOpenCoachingModal}
          />
        )}

        {activeTab === 'BEHAVIOR' && (
          <DriverBehaviorTab
            selectedProfile={selectedProfile}
            allDrivers={allDrivers}
            onSelectDriverId={setSelectedDriverId}
            period={period}
            onOpenCoachingModal={handleOpenCoachingModal}
          />
        )}

        {activeTab === 'SAFETY_SCORE' && (
          <SafetyPerformanceTab
            selectedProfile={selectedProfile}
            allDrivers={allDrivers}
            onSelectDriverId={setSelectedDriverId}
            period={period}
          />
        )}

        {activeTab === 'TRENDS' && (
          <DriverTrendsTab
            selectedProfile={selectedProfile}
            allDrivers={allDrivers}
            onSelectDriverId={setSelectedDriverId}
            period={period}
            onPeriodChange={setPeriod}
          />
        )}

        {activeTab === 'RANKING' && (
          <DriverRankingTab
            rankings={rankings}
            topPerformers={topPerformers}
            attentionRequired={attentionRequired}
            period={period}
            onSelectDriver={(driverId) => handleSelectDriverAndTab(driverId, 'RISK_SCORE')}
            onOpenCoachingModal={handleOpenCoachingModal}
            onCompareDrivers={handleCompareDrivers}
          />
        )}

        {activeTab === 'RECOMMENDATIONS' && (
          <SafetyRecommendationsTab
            recommendations={recommendations}
            period={period}
            onOpenCoachingModal={handleOpenCoachingModal}
            onSelectDriver={(driverId) => handleSelectDriverAndTab(driverId, 'RISK_SCORE')}
          />
        )}

        {activeTab === 'COACHING' && (
          <CoachingTab
            sessions={coachingSessions}
            onOpenCreateSessionModal={handleOpenCoachingModal}
            onOpenAcknowledgementModal={handleOpenAckModal}
            onSelectDriver={(driverId) => handleSelectDriverAndTab(driverId, 'RISK_SCORE')}
            onRefreshSessions={() => setRefreshKey((k) => k + 1)}
          />
        )}

        {activeTab === 'COMPARISON' && (
          <DriverComparisonTab
            initialDriverIds={comparisonDriverIds}
            allDrivers={allDrivers}
            period={period}
            onSelectDriver={(driverId) => handleSelectDriverAndTab(driverId, 'RISK_SCORE')}
            onOpenCoachingModal={handleOpenCoachingModal}
          />
        )}

        {activeTab === 'REPORTS' && (
          <DriverReportsTab
            selectedDriverId={selectedDriverId}
            allDrivers={allDrivers}
            onSelectDriverId={setSelectedDriverId}
            period={period}
          />
        )}

        {activeTab === 'SELF_COACHING' && (
          <DriverSelfCoachingTab
            profile={selectedProfile}
            onSelectDriverId={setSelectedDriverId}
          />
        )}
      </div>

      {/* Global Modals */}
      <CreateCoachingSessionModal
        isOpen={isCoachingModalOpen}
        onClose={() => setIsCoachingModalOpen(false)}
        initialDriverId={selectedDriverId}
        initialFocusType={coachingFocusType}
        allDrivers={allDrivers}
        onSessionCreated={() => setRefreshKey((k) => k + 1)}
      />

      <DriverAcknowledgementModal
        isOpen={isAckModalOpen}
        onClose={() => setIsAckModalOpen(false)}
        session={selectedAckSession}
        onAcknowledged={() => setRefreshKey((k) => k + 1)}
      />

      <ExplainDriverRiskModal
        isOpen={isExplainModalOpen}
        onClose={() => setIsExplainModalOpen(false)}
      />

      <WeightConfigModal
        isOpen={isWeightModalOpen}
        onClose={() => setIsWeightModalOpen(false)}
        onSaved={() => setRefreshKey((k) => k + 1)}
      />
    </div>
  );
};
