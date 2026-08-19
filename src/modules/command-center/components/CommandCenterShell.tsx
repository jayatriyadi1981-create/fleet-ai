/**
 * Fleet Intelligence Smart AI - Command Center Shell
 * Primary Full-Viewport Layout uniting Header, Ribbon, Left/Right/Bottom Panels and Map
 */

import React, { useState, useEffect } from 'react';
import { CommandCenterHeader } from './CommandCenterHeader';
import { FleetKpiRibbon } from './FleetKpiRibbon';
import { CommandCenterMapContainer } from './map/CommandCenterMapContainer';
import { CommandCenterLeftPanel } from './panels/CommandCenterLeftPanel';
import { CommandCenterRightPanel } from './panels/CommandCenterRightPanel';
import { CommandCenterBottomPanel } from './panels/CommandCenterBottomPanel';
import { EmergencyResponseModal } from './modals/EmergencyResponseModal';
import { SmartDispatchModal } from './modals/SmartDispatchModal';
import { AcknowledgeAlertModal } from './modals/AcknowledgeAlertModal';
import { CommandCenterSettingsModal } from './modals/CommandCenterSettingsModal';
import { CommandCenterAICopilot } from './copilot/CommandCenterAICopilot';
import { commandCenterService } from '../services/commandCenterService';
import { AIInsightCard, CommandAlertItem, EmergencyAlertItem } from '../types/commandCenterTypes';

interface CommandCenterShellProps {
  onCallDriver?: (phone: string, name: string) => void;
}

export const CommandCenterShell: React.FC<CommandCenterShellProps> = ({ onCallDriver }) => {
  const [displayMode, setDisplayMode] = useState(commandCenterService.getDisplayMode());
  const [activeEmergencyId, setActiveEmergencyId] = useState<string | null>(null);
  const [isDispatchOpen, setIsDispatchOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [ackTarget, setAckTarget] = useState<CommandAlertItem | EmergencyAlertItem | null>(null);

  useEffect(() => {
    const unsubscribe = commandCenterService.subscribe(() => {
      setDisplayMode(commandCenterService.getDisplayMode());
    });
    return unsubscribe;
  }, []);

  const handleSelectVehicle = (vehicleId: string) => {
    commandCenterService.setSelectedVehicleId(vehicleId);
  };

  const handleTriggerInsightAction = (insight: AIInsightCard) => {
    if (insight.actionType === 'DISPATCH_REROUTE') {
      setIsDispatchOpen(true);
    } else if (insight.actionType === 'ALERT_DRIVER') {
      if (onCallDriver) {
        onCallDriver('+62 813-8899-7711', 'Driver Terkait');
      }
    } else if (insight.actionType === 'SCHEDULE_MAINTENANCE') {
      commandCenterService.addEvent({
        category: 'MAINTENANCE',
        title: 'Work Order Otomatis Terbit',
        description: `WO Inspeksi BBM dibuat untuk armada ${insight.impactedUnits.join(', ')}`,
        severity: 'MEDIUM',
      });
      alert(`Work Order Pemeliharaan dijadwalkan untuk ${insight.impactedUnits.join(', ')}.`);
    }
  };

  return (
    <div
      className={`relative w-full h-[calc(100vh-4rem)] flex flex-col bg-slate-950 overflow-hidden font-sans ${
        displayMode === 'CONTROL_ROOM' ? 'dark text-slate-100' : ''
      }`}
    >
      {/* 1. Command Center Top Header Bar */}
      <CommandCenterHeader
        onOpenCopilot={() => setIsCopilotOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenDispatch={() => setIsDispatchOpen(true)}
      />

      {/* 2. Fleet KPI Ribbon Bar */}
      <FleetKpiRibbon />

      {/* 3. Main Workspace Area: Left Panel + Map Center + Right Panel */}
      <div className="flex-1 relative flex overflow-hidden">
        {/* Left Tactical Panel */}
        <CommandCenterLeftPanel
          onSelectVehicle={handleSelectVehicle}
          onCallDriver={onCallDriver}
        />

        {/* Central Map Canvas */}
        <main className="flex-1 relative h-full">
          <CommandCenterMapContainer
            onSelectVehicle={handleSelectVehicle}
            onOpenEmergency={(emgId) => setActiveEmergencyId(emgId)}
          />
        </main>

        {/* Right Tactical Panel */}
        <CommandCenterRightPanel
          onOpenEmergencyModal={(emgId) => setActiveEmergencyId(emgId)}
          onOpenAckModal={(target) => setAckTarget(target)}
          onOpenDispatch={() => setIsDispatchOpen(true)}
          onCallDriver={onCallDriver}
        />
      </div>

      {/* 4. Bottom Tactical Panel (AI Insights & Operations Event Stream) */}
      <CommandCenterBottomPanel
        onTriggerInsightAction={handleTriggerInsightAction}
        onSelectVehicle={handleSelectVehicle}
      />

      {/* MODALS */}
      {activeEmergencyId && (
        <EmergencyResponseModal
          emergencyId={activeEmergencyId}
          onClose={() => setActiveEmergencyId(null)}
          onOpenSmartDispatch={() => {
            setActiveEmergencyId(null);
            setIsDispatchOpen(true);
          }}
          onCallDriver={onCallDriver}
        />
      )}

      {isDispatchOpen && (
        <SmartDispatchModal
          onClose={() => setIsDispatchOpen(false)}
          emergencyId={activeEmergencyId || undefined}
        />
      )}

      {isSettingsOpen && (
        <CommandCenterSettingsModal onClose={() => setIsSettingsOpen(false)} />
      )}

      {ackTarget && (
        <AcknowledgeAlertModal
          targetAlert={ackTarget}
          onClose={() => setAckTarget(null)}
        />
      )}

      {isCopilotOpen && (
        <CommandCenterAICopilot
          onClose={() => setIsCopilotOpen(false)}
          onOpenEmergencyModal={(emgId) => setActiveEmergencyId(emgId)}
          onOpenDispatch={() => setIsDispatchOpen(true)}
        />
      )}
    </div>
  );
};
