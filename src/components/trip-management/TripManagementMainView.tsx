/**
 * Fleet Intelligence Smart AI - Trip Management Main View Orchestrator
 * PROMPT 15 — Operational Planned Trip Management, Dispatch & Live/History Linking
 */

import React, { useState, useEffect } from 'react';
import { useFleet } from '../../context/FleetContext';
import { PlannedTrip, TripFilterState } from '../../modules/trips/plannedTripTypes';
import { tripManagementService } from '../../modules/trips/services/tripManagementService';
import { TripManagementHeader } from './TripManagementHeader';
import { TripManagementKpiBar } from './TripManagementKpiBar';
import { TripTable } from './TripTable';
import { CreateTripWizardModal } from './CreateTripWizardModal';
import { TripDetailDrawerModal } from './TripDetailDrawerModal';
import { TripCancelModal } from './TripCancelModal';

export const TripManagementMainView: React.FC = () => {
  const { vehicles, drivers, setActiveView, setSelectedVehicle } = useFleet();

  // Filters
  const [filter, setFilter] = useState<TripFilterState>({
    searchQuery: '',
    datePreset: 'TODAY',
    status: 'ALL',
    priority: 'ALL',
    vehicleId: 'ALL',
    driverId: 'ALL',
    branchId: 'ALL',
  });

  const [trips, setTrips] = useState<PlannedTrip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<PlannedTrip | null>(null);
  const [editingTrip, setEditingTrip] = useState<PlannedTrip | null>(null);

  // Modals
  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState<boolean>(false);

  // Reload trips when filter or actions change
  const reloadTrips = () => {
    const data = tripManagementService.getTrips(filter);
    setTrips(data);
  };

  useEffect(() => {
    reloadTrips();
  }, [filter]);

  const handleFilterChange = (newFilter: Partial<TripFilterState>) => {
    setFilter((prev) => ({ ...prev, ...newFilter }));
  };

  const handleOpenCreateWizard = () => {
    setEditingTrip(null);
    setIsWizardOpen(true);
  };

  const handleOpenEditWizard = (trip: PlannedTrip) => {
    setEditingTrip(trip);
    setIsWizardOpen(true);
  };

  const handleSubmitWizard = (tripData: Partial<PlannedTrip>, isDraft: boolean) => {
    if (editingTrip) {
      tripManagementService.updateTrip(editingTrip.id, tripData);
    } else {
      tripManagementService.createTrip(tripData, isDraft);
    }
    reloadTrips();
  };

  const handleSelectTrip = (trip: PlannedTrip) => {
    setSelectedTrip(trip);
    setIsDetailOpen(true);
  };

  const handleDispatchTrip = (trip: PlannedTrip) => {
    tripManagementService.dispatchTrip(trip.id);
    reloadTrips();
    if (selectedTrip?.id === trip.id) {
      setSelectedTrip(tripManagementService.getTripById(trip.id));
    }
  };

  const handleStartTrip = (trip: PlannedTrip) => {
    tripManagementService.startTrip(trip.id);
    reloadTrips();
    if (selectedTrip?.id === trip.id) {
      setSelectedTrip(tripManagementService.getTripById(trip.id));
    }
  };

  const handleCompleteTrip = (trip: PlannedTrip) => {
    tripManagementService.completeTrip(trip.id);
    reloadTrips();
    if (selectedTrip?.id === trip.id) {
      setSelectedTrip(tripManagementService.getTripById(trip.id));
    }
  };

  const handleOpenCancelModal = (trip: PlannedTrip) => {
    setSelectedTrip(trip);
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancelTrip = (reason: string) => {
    if (selectedTrip) {
      tripManagementService.cancelTrip(selectedTrip.id, reason);
      reloadTrips();
      setSelectedTrip(tripManagementService.getTripById(selectedTrip.id));
    }
  };

  // Redirect to Live GPS Tracking for active vehicle
  const handleTrackLive = (vehicleId: string) => {
    const veh = vehicles.find((v) => v.id === vehicleId);
    if (veh) {
      setSelectedVehicle(veh);
    }
    setActiveView('live_tracking');
  };

  // Redirect to Trip History & Playback (Prompt 14)
  const handleViewHistory = (actualTripId: string) => {
    setActiveView('trips'); // 'trips' maps to Trip History & Playback
  };

  const handleExport = () => {
    tripManagementService.exportTrips(trips);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-y-auto">
      {/* Top Header & Filters */}
      <TripManagementHeader
        filter={filter}
        onFilterChange={handleFilterChange}
        onExport={handleExport}
        onCreateTrip={handleOpenCreateWizard}
        vehicles={vehicles}
        drivers={drivers}
      />

      {/* Main Content Area */}
      <div className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto space-y-6">
        {/* KPI Metrics Bar */}
        <TripManagementKpiBar
          trips={trips}
          onSelectStatusFilter={(st) => handleFilterChange({ status: st as any })}
        />

        {/* Trips Table */}
        <TripTable
          trips={trips}
          selectedTripId={selectedTrip?.id || null}
          onSelectTrip={handleSelectTrip}
          onEditTrip={handleOpenEditWizard}
          onDispatchTrip={handleDispatchTrip}
          onStartTrip={handleStartTrip}
          onCancelTrip={handleOpenCancelModal}
          onTrackLive={handleTrackLive}
          onViewHistory={handleViewHistory}
        />
      </div>

      {/* Create / Edit Wizard Modal */}
      <CreateTripWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onSubmit={handleSubmitWizard}
        editingTrip={editingTrip}
        vehicles={vehicles}
        drivers={drivers}
        existingTrips={trips}
      />

      {/* Detail Drawer Modal */}
      <TripDetailDrawerModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        trip={selectedTrip}
        onDispatchTrip={handleDispatchTrip}
        onStartTrip={handleStartTrip}
        onCompleteTrip={handleCompleteTrip}
        onCancelTrip={handleOpenCancelModal}
        onTrackLive={handleTrackLive}
        onViewHistory={handleViewHistory}
      />

      {/* Cancel Modal */}
      <TripCancelModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirmCancel={handleConfirmCancelTrip}
        trip={selectedTrip}
      />
    </div>
  );
};
