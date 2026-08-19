/**
 * Fleet Intelligence Smart AI - Vehicle Inspection Module Main View
 * Central coordinator with tab routing, modals, and seamless navigation.
 */

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  PlusCircle, 
  RotateCcw, 
  History, 
  AlertTriangle, 
  FileCode, 
  BarChart3, 
  Sparkles, 
  CarFront,
  CheckCircle2
} from 'lucide-react';
import { InspectionOverviewView } from './InspectionOverviewView';
import { PreTripInspectionView } from './PreTripInspectionView';
import { PostTripInspectionView } from './PostTripInspectionView';
import { InspectionHistoryView } from './InspectionHistoryView';
import { InspectionIssuesView } from './InspectionIssuesView';
import { InspectionTemplatesView } from './InspectionTemplatesView';
import { InspectionAnalyticsView } from './InspectionAnalyticsView';
import { InspectionAiView } from './InspectionAiView';
import { MobileInspectionMode } from './MobileInspectionMode';
import { InspectionDetailModal } from './InspectionDetailModal';
import { VehicleInspection, InspectionIssue } from '../types/inspection';

export type InspectionSubTab = 
  | 'overview' 
  | 'pre_trip' 
  | 'post_trip' 
  | 'history' 
  | 'issues' 
  | 'templates' 
  | 'analytics' 
  | 'ai_insights'
  | 'mobile_mode';

export const InspectionMainView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<InspectionSubTab>('overview');
  const [selectedInspection, setSelectedInspection] = useState<VehicleInspection | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleInspectionCompleted = (inspection: VehicleInspection) => {
    setSelectedInspection(inspection);
    setSuccessToast(`Inspeksi ${inspection.inspectionNumber} berhasil disimpan! Status: ${inspection.result}`);
    setActiveTab('overview');
    setTimeout(() => setSuccessToast(null), 5000);
  };

  const navTabs: { id: InspectionSubTab; label: string; icon: any }[] = [
    { id: 'overview', label: 'Overview', icon: ShieldCheck },
    { id: 'pre_trip', label: 'Pre-Trip', icon: PlusCircle },
    { id: 'post_trip', label: 'Post-Trip', icon: RotateCcw },
    { id: 'history', label: 'History', icon: History },
    { id: 'issues', label: 'Issues', icon: AlertTriangle },
    { id: 'templates', label: 'Templates', icon: FileCode },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'ai_insights', label: 'AI Inspection', icon: Sparkles },
    { id: 'mobile_mode', label: 'Mobile Mode', icon: CarFront },
  ];

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs font-semibold flex items-center justify-between shadow-lg animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>{successToast}</span>
          </div>
          <button
            onClick={() => setSuccessToast(null)}
            className="text-emerald-400 hover:text-white"
          >
            &times;
          </button>
        </div>
      )}

      {/* Top Tabs Bar */}
      {activeTab !== 'mobile_mode' && (
        <div className="flex items-center overflow-x-auto p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 gap-1.5 shadow-sm scrollbar-thin">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Tab Contents */}
      {activeTab === 'overview' && (
        <InspectionOverviewView
          onNavigateTab={(tab) => setActiveTab(tab as InspectionSubTab)}
          onSelectInspection={(ins) => setSelectedInspection(ins)}
          onSelectIssue={() => setActiveTab('issues')}
        />
      )}

      {activeTab === 'pre_trip' && (
        <PreTripInspectionView
          onCompleted={handleInspectionCompleted}
        />
      )}

      {activeTab === 'post_trip' && (
        <PostTripInspectionView
          onCompleted={handleInspectionCompleted}
        />
      )}

      {activeTab === 'history' && (
        <InspectionHistoryView
          onSelectInspection={(ins) => setSelectedInspection(ins)}
        />
      )}

      {activeTab === 'issues' && (
        <InspectionIssuesView />
      )}

      {activeTab === 'templates' && (
        <InspectionTemplatesView />
      )}

      {activeTab === 'analytics' && (
        <InspectionAnalyticsView />
      )}

      {activeTab === 'ai_insights' && (
        <InspectionAiView />
      )}

      {activeTab === 'mobile_mode' && (
        <MobileInspectionMode
          onExitMobile={() => setActiveTab('overview')}
          onCompleted={handleInspectionCompleted}
        />
      )}

      {/* Inspection Detail Modal */}
      {selectedInspection && (
        <InspectionDetailModal
          inspection={selectedInspection}
          onClose={() => setSelectedInspection(null)}
        />
      )}
    </div>
  );
};
