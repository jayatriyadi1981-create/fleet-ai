/**
 * Fleet Intelligence Smart AI - Geofencing Management View Component
 * PROMPT 17 — Enterprise Geofencing Management, Event Engine, AI Intelligence & Live Telemetry
 */

import React, { useState, useEffect } from 'react';
import { useFleet } from '../../context/FleetContext';
import { GeofenceFilterState, Geofence, GeofenceEvent, AIGeofenceAnalysisResult, UnregisteredStopRecommendation } from '../../modules/geofences/geofenceTypes';
import { geofenceManagementService } from '../../modules/geofences/services/geofenceManagementService';
import { geofenceDetectionService } from '../../modules/geofences/services/geofenceDetectionService';
import { geofenceAIService } from '../../modules/geofences/services/geofenceAIService';
import { GeofenceKpiBar } from '../../modules/geofences/components/GeofenceKpiBar';
import { GeofenceHeader } from '../../modules/geofences/components/GeofenceHeader';
import { GeofenceTable } from '../../modules/geofences/components/GeofenceTable';
import { GeofenceMapComponent } from '../../modules/geofences/components/GeofenceMapComponent';
import { CreateGeofenceWizardModal } from '../../modules/geofences/components/CreateGeofenceWizardModal';
import { GeofenceEventLogTable } from '../../modules/geofences/components/GeofenceEventLogTable';
import {
  Map,
  Table as TableIcon,
  Clock,
  Sparkles,
  Layers,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Truck,
  ArrowRight,
  ShieldAlert,
  BrainCircuit,
  MapPin
} from 'lucide-react';

export const GeofenceManagementView: React.FC = () => {
  const { vehicles, setActiveView } = useFleet();

  // Active Tab: 'TABLE_MAP' | 'FULL_MAP' | 'EVENT_LOG' | 'AI_ANALYTICS'
  const [activeTab, setActiveTab] = useState<'TABLE_MAP' | 'FULL_MAP' | 'EVENT_LOG' | 'AI_ANALYTICS'>('TABLE_MAP');

  // Filter State
  const [filter, setFilter] = useState<GeofenceFilterState>({
    searchQuery: '',
    type: 'ALL',
    category: 'ALL',
    status: 'ALL',
    priority: 'ALL',
  });

  // Data State
  const [geofences, setGeofences] = useState<Geofence[]>([]);
  const [events, setEvents] = useState<GeofenceEvent[]>([]);
  const [selectedGeofenceId, setSelectedGeofenceId] = useState<string | undefined>('geo-001');
  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);
  const [editingGeofence, setEditingGeofence] = useState<Geofence | undefined>();

  // AI Intelligence State
  const [aiAnalysis, setAiAnalysis] = useState<AIGeofenceAnalysisResult | null>(null);
  const [stopRecommendations, setStopRecommendations] = useState<UnregisteredStopRecommendation[]>([]);

  const loadData = () => {
    const list = geofenceManagementService.getGeofences(filter);
    setGeofences(list);
    const evts = geofenceDetectionService.getEvents();
    setEvents(evts);
  };

  useEffect(() => {
    loadData();
  }, [filter]);

  // Load AI Analysis when selected geofence changes
  useEffect(() => {
    if (selectedGeofenceId) {
      const g = geofenceManagementService.getGeofenceById(selectedGeofenceId);
      if (g) {
        geofenceAIService.analyzeGeofenceDwellIntelligence(g).then(setAiAnalysis);
      }
    }
    geofenceAIService.getUnregisteredStopRecommendations().then(setStopRecommendations);
  }, [selectedGeofenceId]);

  const handleCreateGeofence = () => {
    setEditingGeofence(undefined);
    setIsWizardOpen(true);
  };

  const handleEditGeofence = (geofenceId: string) => {
    const g = geofenceManagementService.getGeofenceById(geofenceId);
    if (g) {
      setEditingGeofence(g);
      setIsWizardOpen(true);
    }
  };

  const handleDeleteGeofence = (geofenceId: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus geofence ini?')) {
      geofenceManagementService.deleteGeofence(geofenceId);
      loadData();
    }
  };

  const handleSaveGeofence = (geofenceData: Omit<Geofence, 'id' | 'code' | 'createdAt' | 'updatedAt'>) => {
    if (editingGeofence) {
      geofenceManagementService.updateGeofence(editingGeofence.id, geofenceData);
    } else {
      geofenceManagementService.createGeofence(geofenceData);
    }
    loadData();
  };

  const handleExportGeoJSON = () => {
    const geoJsonStr = geofenceManagementService.exportToGeoJSON(geofences);
    const blob = new Blob([geoJsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `geofences-export-${new Date().toISOString().slice(0, 10)}.geojson`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const selectedGeofence = geofences.find((g) => g.id === selectedGeofenceId) || geofences[0];
  const vehiclesInsideState = selectedGeofence ? geofenceDetectionService.getVehiclesInsideGeofence(selectedGeofence.id) : [];

  return (
    <div className="space-y-6 pb-12 text-slate-100">
      {/* Top Header & Toolbar */}
      <GeofenceHeader
        filter={filter}
        onFilterChange={(newF) => setFilter((prev) => ({ ...prev, ...newF }))}
        onCreateGeofence={handleCreateGeofence}
        onExportGeoJSON={handleExportGeoJSON}
        onRefreshData={loadData}
      />

      <div className="px-4 sm:px-6 space-y-6">
        {/* KPI Dashboard Stats Bar */}
        <GeofenceKpiBar
          geofences={geofences}
          events={events}
          onFilterClick={(statusType) => setFilter((prev) => ({ ...prev, status: statusType as any }))}
        />

        {/* View Switcher Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('TABLE_MAP')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'TABLE_MAP'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-950'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              <TableIcon className="w-4 h-4" />
              <span>Daftar Master & Visualisasi</span>
            </button>

            <button
              onClick={() => setActiveTab('FULL_MAP')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'FULL_MAP'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-950'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              <Map className="w-4 h-4" />
              <span>Peta Fullscreen & Direct Drawing</span>
            </button>

            <button
              onClick={() => setActiveTab('EVENT_LOG')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'EVENT_LOG'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-950'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Riwayat Event Telemetri</span>
            </button>

            <button
              onClick={() => setActiveTab('AI_ANALYTICS')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'AI_ANALYTICS'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-950'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>AI Intelligence & Dwell Analytics</span>
            </button>
          </div>

          <div className="text-xs text-slate-400 font-medium hidden md:block">
            Menampilkan <strong className="text-white">{geofences.length}</strong> Geofence terdaftar
          </div>
        </div>

        {/* TAB 1: MASTER TABLE + SIDE MAP PANEL */}
        {activeTab === 'TABLE_MAP' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Table Area (2 cols) */}
            <div className="lg:col-span-2 space-y-4">
              <GeofenceTable
                geofences={geofences}
                events={events}
                onSelectGeofence={(id) => setSelectedGeofenceId(id)}
                onEditGeofence={handleEditGeofence}
                onViewEvents={(id) => {
                  setSelectedGeofenceId(id);
                  setActiveTab('EVENT_LOG');
                }}
                onDeleteGeofence={handleDeleteGeofence}
              />
            </div>

            {/* Map Preview & Live Vehicles Side Panel (1 col) */}
            <div className="space-y-4">
              {/* Map Canvas */}
              <div className="h-[320px] rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
                <GeofenceMapComponent
                  geofences={geofences}
                  selectedGeofenceId={selectedGeofenceId}
                  onSelectGeofence={setSelectedGeofenceId}
                />
              </div>

              {/* Selected Geofence Detail Card */}
              {selectedGeofence && (
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-sm text-white">{selectedGeofence.name}</h4>
                      <span className="text-[10px] font-mono text-slate-500">{selectedGeofence.code}</span>
                    </div>
                    <span
                      className="px-2 py-0.5 text-[9px] font-extrabold rounded-md text-white border"
                      style={{ backgroundColor: selectedGeofence.color, borderColor: selectedGeofence.color }}
                    >
                      {selectedGeofence.category}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2">
                    {selectedGeofence.description || 'Tidak ada catatan deskripsi.'}
                  </p>

                  {/* Vehicles Currently Inside */}
                  <div className="pt-2 border-t border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                      <span className="flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Armada di Dalam Kawasan</span>
                      </span>
                      <span className="px-2 py-0.5 bg-cyan-950 text-cyan-300 rounded-full text-[10px]">
                        {vehiclesInsideState.length} Unit
                      </span>
                    </div>

                    {vehiclesInsideState.length > 0 ? (
                      <div className="space-y-1.5">
                        {vehiclesInsideState.map((vs) => (
                          <div
                            key={vs.vehicleId}
                            className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center text-xs"
                          >
                            <div>
                              <span className="font-bold text-white block">
                                {vs.vehicleId === 'veh-01' ? 'B 9821 UTX' : 'B 9102 CKR'}
                              </span>
                              <span className="text-[10px] text-slate-500">
                                Masuk: {vs.enteredAt ? new Date(vs.enteredAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'}
                              </span>
                            </div>
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-900">
                              Inside
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-500 italic block">Tidak ada armada di dalam kawasan saat ini</span>
                    )}
                  </div>

                  {/* AI Intelligence Card */}
                  {aiAnalysis && (
                    <div className="p-3 bg-purple-950/40 border border-purple-800/50 rounded-xl space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300">
                        <BrainCircuit className="w-4 h-4 text-purple-400" />
                        <span>AI Dwell Intelligence</span>
                      </div>
                      <p className="text-[11px] text-purple-200 leading-snug">{aiAnalysis.aiRecommendation}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: FULLSCREEN MAP */}
        {activeTab === 'FULL_MAP' && (
          <div className="h-[620px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative">
            <GeofenceMapComponent
              geofences={geofences}
              selectedGeofenceId={selectedGeofenceId}
              onSelectGeofence={setSelectedGeofenceId}
            />
          </div>
        )}

        {/* TAB 3: EVENT HISTORY LOG */}
        {activeTab === 'EVENT_LOG' && (
          <div className="space-y-4">
            <GeofenceEventLogTable events={events} />
          </div>
        )}

        {/* TAB 4: AI INTELLIGENCE & DWELL ANALYTICS */}
        {activeTab === 'AI_ANALYTICS' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: AI Dwell Analysis */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl">
              <div className="flex items-center gap-2 text-purple-400 border-b border-slate-800 pb-3">
                <BrainCircuit className="w-5 h-5" />
                <h3 className="font-extrabold text-sm text-white">Analisis Dwell & Anomaly Telemetri</h3>
              </div>

              {selectedGeofence && aiAnalysis && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <span className="font-bold text-white block text-sm">{selectedGeofence.name}</span>
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase block">Avg Dwell</span>
                        <span className="font-extrabold text-white text-base">{aiAnalysis.averageDwellMinutes}m</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase block">Max Dwell</span>
                        <span className="font-extrabold text-amber-400 text-base">{aiAnalysis.maxDwellMinutes}m</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase block">Dwell Count</span>
                        <span className="font-extrabold text-purple-400 text-base">{aiAnalysis.dwellCount}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-purple-950/40 border border-purple-800/60 rounded-xl space-y-2">
                    <span className="font-extrabold text-purple-300 block">Saran Optimalisasi AI Engine:</span>
                    <p className="text-slate-300 leading-relaxed text-xs">{aiAnalysis.aiRecommendation}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Unregistered Stop Recommendations */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl">
              <div className="flex items-center gap-2 text-blue-400 border-b border-slate-800 pb-3">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <h3 className="font-extrabold text-sm text-white">Rekomendasi Geofence Baru (AI Detection)</h3>
              </div>

              <div className="space-y-3">
                {stopRecommendations.map((rec) => (
                  <div key={rec.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-bold text-white text-xs block">{rec.suggestedName}</span>
                        <span className="text-[10px] text-slate-500">{rec.centroid.address}</span>
                      </div>
                      <span className="px-2 py-0.5 text-[9px] font-extrabold text-emerald-300 bg-emerald-950 border border-emerald-800 rounded">
                        {rec.confidenceScore}% Match
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                      <span>Total Pemberhentian: <strong className="text-white">{rec.stopCount}x</strong></span>
                      <span>Rata-rata: <strong className="text-blue-300">{rec.averageStopMinutes} menit</strong></span>
                    </div>

                    <button
                      onClick={() => handleCreateGeofence()}
                      className="w-full mt-2 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Buat Geofence dari Rekomendasi AI</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 8-Step Wizard Modal */}
      <CreateGeofenceWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onSave={handleSaveGeofence}
        existingGeofence={editingGeofence}
      />
    </div>
  );
};
