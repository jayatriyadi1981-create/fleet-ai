/**
 * Fleet Intelligence Smart AI - GPS Device Management & Architecture Orchestrator
 * PROMPT 10 & PROMPT 12 - Enterprise Router & Sub-View Container
 */

import React, { useState } from 'react';
import { GPSDeviceExtended } from '../../types/gps';
import { gpsDeviceService } from '../../services/gpsDeviceService';
import { useFleet } from '../../context/FleetContext';
import { DeviceListView } from './DeviceListView';
import { DeviceProfileDetail } from './DeviceProfileDetail';
import { DeviceHealthDashboard } from './DeviceHealthDashboard';
import { SIMsManagementView } from './SIMsManagementView';
import { ProtocolsManagementView } from './ProtocolsManagementView';
import { FirmwareManagementView } from './FirmwareManagementView';
import { DeviceDiagnosticsModal } from './DeviceDiagnosticsModal';
import { RemoteCommandModal } from './RemoteCommandModal';
import { DeviceOnboardingWizard } from './DeviceOnboardingWizard';

// Imports for Prompt 12 Architecture Module
import { GpsArchitectureOverview } from '../../modules/gps/components/GpsArchitectureOverview';
import { GpsIngestionInspector } from '../../modules/gps/components/GpsIngestionInspector';
import { GpsRealtimeLocationView } from '../../modules/gps/components/GpsRealtimeLocationView';
import { GpsAdaptersView } from '../../modules/gps/components/GpsAdaptersView';
import { GpsEventRulesView } from '../../modules/gps/components/GpsEventRulesView';
import { GpsCommandConsole } from '../../modules/gps/components/GpsCommandConsole';
import { GpsSimulatorConsole } from '../../modules/gps/components/GpsSimulatorConsole';

import { 
  Layers, 
  Cpu, 
  Terminal, 
  MapPin, 
  Network, 
  Sparkles, 
  Radio, 
  FlaskConical 
} from 'lucide-react';

type GpsTabMode = 
  | 'devices'
  | 'architecture'
  | 'ingestion'
  | 'realtime'
  | 'adapters'
  | 'rules'
  | 'commands'
  | 'simulator';

export const GpsDevicesView: React.FC = () => {
  const { activeView, currentUser } = useFleet();

  const [activeTab, setActiveTab] = useState<GpsTabMode>('devices');
  const [selectedDevice, setSelectedDevice] = useState<GPSDeviceExtended | null>(null);
  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);
  const [diagnosticDevice, setDiagnosticDevice] = useState<GPSDeviceExtended | null>(null);
  const [commandDevice, setCommandDevice] = useState<GPSDeviceExtended | null>(null);

  // Handle route matching if triggered from sidebar navigation
  if (activeView === 'gps_health') {
    return (
      <DeviceHealthDashboard
        onSelectDevice={(device) => {
          setSelectedDevice(device);
        }}
      />
    );
  }

  if (activeView === 'gps_sims') {
    return <SIMsManagementView />;
  }

  if (activeView === 'gps_protocols') {
    return <ProtocolsManagementView />;
  }

  if (activeView === 'gps_firmware') {
    return <FirmwareManagementView />;
  }

  // If a device is selected, render Profile Detail View
  if (selectedDevice) {
    return (
      <>
        <DeviceProfileDetail
          device={selectedDevice}
          onBack={() => setSelectedDevice(null)}
          onOpenDiagnostics={() => setDiagnosticDevice(selectedDevice)}
          onOpenCommands={() => setCommandDevice(selectedDevice)}
        />

        {diagnosticDevice && (
          <DeviceDiagnosticsModal
            isOpen={!!diagnosticDevice}
            onClose={() => setDiagnosticDevice(null)}
            device={diagnosticDevice}
            performedBy={currentUser.name}
          />
        )}

        {commandDevice && (
          <RemoteCommandModal
            isOpen={!!commandDevice}
            onClose={() => setCommandDevice(null)}
            device={commandDevice}
            sentBy={currentUser.name}
          />
        )}
      </>
    );
  }

  return (
    <div className="space-y-6">
      {/* Module Header & Top Navigation Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Cpu className="h-5 w-5 text-cyan-400" /> Pengelolaan Perangkat &amp; Telematika GPS
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manajemen hardware GPS IoT, Ingestion Pipeline multi-protocol, dan engine pemrosesan lokasi real-time.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('devices')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all whitespace-nowrap ${
              activeTab === 'devices'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Cpu className="h-3.5 w-3.5" /> Perangkat GPS
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all whitespace-nowrap ${
              activeTab === 'architecture'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="h-3.5 w-3.5" /> Konsep Arsitektur
          </button>

          <button
            onClick={() => setActiveTab('ingestion')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all whitespace-nowrap ${
              activeTab === 'ingestion'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Terminal className="h-3.5 w-3.5" /> Raw Ingestion
          </button>

          <button
            onClick={() => setActiveTab('realtime')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all whitespace-nowrap ${
              activeTab === 'realtime'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MapPin className="h-3.5 w-3.5" /> Live Location
          </button>

          <button
            onClick={() => setActiveTab('adapters')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all whitespace-nowrap ${
              activeTab === 'adapters'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Network className="h-3.5 w-3.5" /> Adapters
          </button>

          <button
            onClick={() => setActiveTab('rules')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all whitespace-nowrap ${
              activeTab === 'rules'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" /> Event Engine
          </button>

          <button
            onClick={() => setActiveTab('commands')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all whitespace-nowrap ${
              activeTab === 'commands'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Radio className="h-3.5 w-3.5" /> Remote Console
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all whitespace-nowrap ${
              activeTab === 'simulator'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FlaskConical className="h-3.5 w-3.5" /> Test Suite
          </button>
        </div>
      </div>

      {/* Tab Content Rendering */}
      {activeTab === 'devices' && (
        <>
          <DeviceListView
            onSelectDevice={(device) => setSelectedDevice(device)}
            onOpenWizard={() => setIsWizardOpen(true)}
            onOpenDiagnostics={(device) => setDiagnosticDevice(device)}
            onOpenCommands={(device) => setCommandDevice(device)}
          />

          {isWizardOpen && (
            <DeviceOnboardingWizard
              isOpen={isWizardOpen}
              onClose={() => setIsWizardOpen(false)}
              onCompleted={(newId) => {
                const dev = gpsDeviceService.getDevice(newId);
                if (dev) setSelectedDevice(dev);
              }}
            />
          )}

          {diagnosticDevice && (
            <DeviceDiagnosticsModal
              isOpen={!!diagnosticDevice}
              onClose={() => setDiagnosticDevice(null)}
              device={diagnosticDevice}
              performedBy={currentUser.name}
            />
          )}

          {commandDevice && (
            <RemoteCommandModal
              isOpen={!!commandDevice}
              onClose={() => setCommandDevice(null)}
              device={commandDevice}
              sentBy={currentUser.name}
            />
          )}
        </>
      )}

      {activeTab === 'architecture' && <GpsArchitectureOverview />}
      {activeTab === 'ingestion' && <GpsIngestionInspector />}
      {activeTab === 'realtime' && <GpsRealtimeLocationView />}
      {activeTab === 'adapters' && <GpsAdaptersView />}
      {activeTab === 'rules' && <GpsEventRulesView />}
      {activeTab === 'commands' && <GpsCommandConsole />}
      {activeTab === 'simulator' && <GpsSimulatorConsole />}
    </div>
  );
};

