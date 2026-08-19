/**
 * Safety Intelligence View - Main Module View
 * PROMPT 33 Architecture
 */

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Sparkles, 
  Activity, 
  User, 
  Truck, 
  Navigation, 
  Moon, 
  Flame, 
  HelpCircle, 
  UserCheck, 
  Bot, 
  FileText, 
  Layers,
  AlertTriangle,
  Radio
} from 'lucide-react';
import { safetyIntelligenceService } from '../engines/SafetyIntelligenceService';
import { SafetyIntelligenceTabKey, DriverSafetyProfile, VehicleSafetyProfile, RouteSafetyProfile } from '../types';
import { Incident, Accident } from '../../safety/types';
import { IncidentAIAnalysisModal } from './modals/IncidentAIAnalysisModal';
import { AccidentAIAnalysisModal } from './modals/AccidentAIAnalysisModal';
import { FiveWhyModal } from './modals/FiveWhyModal';
import { CoachingPlanModal } from './modals/CoachingPlanModal';

import { OverviewTab } from './tabs/OverviewTab';
import { IncidentIntelligenceTab } from './tabs/IncidentIntelligenceTab';
import { AccidentIntelligenceTab } from './tabs/AccidentIntelligenceTab';
import { RiskPredictionTab } from './tabs/RiskPredictionTab';
import { DriverSafetyTab } from './tabs/DriverSafetyTab';
import { VehicleSafetyTab } from './tabs/VehicleSafetyTab';
import { RouteSafetyTab } from './tabs/RouteSafetyTab';
import { FatigueSafetyTab } from './tabs/FatigueSafetyTab';
import { SafetyPatternHotspotsTab } from './tabs/SafetyPatternHotspotsTab';
import { InvestigationAssistantTab } from './tabs/InvestigationAssistantTab';
import { SafetyCoachingCAPATab } from './tabs/SafetyCoachingCAPATab';
import { AISafetyAdvisorTab } from './tabs/AISafetyAdvisorTab';
import { SafetyReportsTab } from './tabs/SafetyReportsTab';

export const SafetyIntelligenceView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SafetyIntelligenceTabKey>('OVERVIEW');
  const [selectedIncidentForAnalysis, setSelectedIncidentForAnalysis] = useState<Incident | null>(null);
  const [selectedAccidentForAnalysis, setSelectedAccidentForAnalysis] = useState<Accident | null>(null);
  const [fiveWhyIncidentId, setFiveWhyIncidentId] = useState<string | null>(null);
  const [coachingDriver, setCoachingDriver] = useState<DriverSafetyProfile | null>(null);

  // Load Data via Service Facade
  const kpis = safetyIntelligenceService.getKPIs();
  const drivers = safetyIntelligenceService.getDriverProfiles();
  const vehicles = safetyIntelligenceService.getVehicleProfiles();
  const routes = safetyIntelligenceService.getRouteProfiles();
  const hotspots = safetyIntelligenceService.getHotspots();
  const recommendations = safetyIntelligenceService.getRecommendations();

  const navTabs: { key: SafetyIntelligenceTabKey; label: string; icon: React.ReactNode; badge?: string | number }[] = [
    { key: 'OVERVIEW', label: 'Ringkasan', icon: <Layers className="w-4 h-4" /> },
    { key: 'INCIDENT_INTELLIGENCE', label: 'Incident Intelligence', icon: <ShieldAlert className="w-4 h-4" />, badge: kpis.totalIncidents },
    { key: 'ACCIDENT_INTELLIGENCE', label: 'Accident Intelligence', icon: <AlertTriangle className="w-4 h-4 text-red-400" />, badge: kpis.totalAccidents },
    { key: 'RISK_PREDICTION', label: 'Prediksi Risiko', icon: <Radio className="w-4 h-4 text-amber-400" /> },
    { key: 'DRIVER_SAFETY', label: 'Driver Safety', icon: <User className="w-4 h-4" /> },
    { key: 'VEHICLE_SAFETY', label: 'Vehicle Safety', icon: <Truck className="w-4 h-4" /> },
    { key: 'ROUTE_SAFETY', label: 'Route Safety', icon: <Navigation className="w-4 h-4" /> },
    { key: 'FATIGUE_SAFETY', label: 'Fatigue & Waktu', icon: <Moon className="w-4 h-4" /> },
    { key: 'PATTERNS_HOTSPOTS', label: 'Hotspot & Pola', icon: <Flame className="w-4 h-4 text-red-400" />, badge: hotspots.length },
    { key: 'INVESTIGATION_5WHY', label: 'Investigasi 5-Why', icon: <HelpCircle className="w-4 h-4" /> },
    { key: 'COACHING_CAPA', label: 'Coaching & CAPA', icon: <UserCheck className="w-4 h-4" /> },
    { key: 'ADVISOR', label: 'AI Safety Advisor', icon: <Bot className="w-4 h-4 text-emerald-400" /> },
    { key: 'REPORTS', label: 'Laporan HSE', icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      
      {/* Top Header Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white tracking-tight">
                AI Safety Intelligence & Risk Analytics
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                PROMPT 33
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Intelijen Keselamatan Armada Terpadu • Rekonstruksi Insiden & Laka • Prediksi Risiko & CAPA
            </p>
          </div>
        </div>

        {/* Quick KPI Badges */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs flex items-center gap-2">
            <span className="text-slate-400">Fleet Score:</span>
            <span className="font-bold text-emerald-400 font-mono text-sm">{kpis.overallSafetyScore}/100</span>
          </div>

          <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs flex items-center gap-2">
            <span className="text-slate-400">High Risk:</span>
            <span className="font-bold text-amber-400 font-mono text-sm">
              {kpis.highRiskDriversCount} Driver • {kpis.highRiskVehiclesCount} Armada
            </span>
          </div>

          <button
            onClick={() => setActiveTab('REPORTS')}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <FileText className="w-3.5 h-3.5" />
            Laporan HSE
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="bg-slate-900/60 border-b border-slate-800 px-6 py-2 overflow-x-auto flex items-center gap-1.5">
        {navTabs.map(tab => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                  isActive ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-800 text-slate-300'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 max-w-7xl w-full mx-auto">
        {activeTab === 'OVERVIEW' && (
          <OverviewTab
            kpis={kpis}
            drivers={drivers}
            vehicles={vehicles}
            routes={routes}
            hotspots={hotspots}
            recommendations={recommendations}
            onSelectDriver={(d) => {
              setCoachingDriver(d);
            }}
            onSelectVehicle={(v) => {
              setActiveTab('VEHICLE_SAFETY');
            }}
            onSelectRoute={(r) => {
              setActiveTab('ROUTE_SAFETY');
            }}
            onSwitchTab={(t) => setActiveTab(t)}
          />
        )}

        {activeTab === 'INCIDENT_INTELLIGENCE' && (
          <IncidentIntelligenceTab
            onAnalyzeIncident={(inc) => setSelectedIncidentForAnalysis(inc)}
            onOpen5Why={(id) => setFiveWhyIncidentId(id)}
          />
        )}

        {activeTab === 'ACCIDENT_INTELLIGENCE' && (
          <AccidentIntelligenceTab
            onAnalyzeAccident={(acc) => setSelectedAccidentForAnalysis(acc)}
            onOpen5Why={(id) => setFiveWhyIncidentId(id)}
          />
        )}

        {activeTab === 'RISK_PREDICTION' && <RiskPredictionTab />}

        {activeTab === 'DRIVER_SAFETY' && (
          <DriverSafetyTab
            drivers={drivers}
            onOpenCoachingModal={(d) => setCoachingDriver(d)}
          />
        )}

        {activeTab === 'VEHICLE_SAFETY' && <VehicleSafetyTab vehicles={vehicles} />}

        {activeTab === 'ROUTE_SAFETY' && <RouteSafetyTab routes={routes} />}

        {activeTab === 'FATIGUE_SAFETY' && <FatigueSafetyTab />}

        {activeTab === 'PATTERNS_HOTSPOTS' && <SafetyPatternHotspotsTab />}

        {activeTab === 'INVESTIGATION_5WHY' && <InvestigationAssistantTab />}

        {activeTab === 'COACHING_CAPA' && <SafetyCoachingCAPATab />}

        {activeTab === 'ADVISOR' && <AISafetyAdvisorTab />}

        {activeTab === 'REPORTS' && <SafetyReportsTab />}
      </div>

      {/* Modals */}
      {selectedIncidentForAnalysis && (
        <IncidentAIAnalysisModal
          incident={selectedIncidentForAnalysis}
          onClose={() => setSelectedIncidentForAnalysis(null)}
          onOpen5Why={(id) => {
            setSelectedIncidentForAnalysis(null);
            setFiveWhyIncidentId(id);
          }}
        />
      )}

      {selectedAccidentForAnalysis && (
        <AccidentAIAnalysisModal
          accident={selectedAccidentForAnalysis}
          onClose={() => setSelectedAccidentForAnalysis(null)}
          onOpen5Why={(id) => {
            setSelectedAccidentForAnalysis(null);
            setFiveWhyIncidentId(id);
          }}
        />
      )}

      {fiveWhyIncidentId && (
        <FiveWhyModal
          incidentId={fiveWhyIncidentId}
          onClose={() => setFiveWhyIncidentId(null)}
        />
      )}

      {coachingDriver && (
        <CoachingPlanModal
          driver={coachingDriver}
          onClose={() => setCoachingDriver(null)}
        />
      )}

    </div>
  );
};
